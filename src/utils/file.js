const fileTypes = {
  ai: ['ai', 'eps'],
  app: ['app'],
  axure: ['rp'],
  book: [
    'mobi',
    'oeb',
    'lit',
    'xeb',
    'ebx',
    'rb',
    'pdb',
    'epub',
    'azw3',
    'hlp',
    'chm',
    'wdl',
    'ceb',
    'abm',
    'pdg',
    'caj',
  ],
  css: ['css', 'less', 'sass'],
  dmg: ['dmg'],
  excel: [
    'csv',
    'fods',
    'ods',
    'ots',
    'xls',
    'xlsm',
    'xlsx',
    'xlt',
    'xltm',
    'xltx',
    'et',
    'ett',
  ],
  exe: ['exe'],
  html: ['htm', 'html', 'mht'],
  // prettier-ignore
  img: ['png', 'bmp', 'jpg', 'jpeg', 'gif', 'webp', 'tga', 'exif', 'fpx', 'svg', 'hdri', 'raw', 'ico', 'jfif', 'dib', 'pbm', 'pgm', 'ppm', 'rgb'],
  java: ['jar', 'java'],
  js: ['js', 'jsx', 'ts', 'tsx'],
  json: ['json'],
  keynote: ['key'],
  md: ['md', 'markdown'],
  // prettier-ignore
  music: ['au', 'aif', 'aiff', 'aifc', 'rmi', 'mp3', 'mid', 'cda', 'wav', 'wma', 'ra', 'ram', 'snd', 'mida', 'ogg', 'ape', 'flac', 'aac'],
  numbers: ['numbers'],
  pages: ['pages'],
  pdf: ['pdf'],
  php: ['php'],
  pkg: ['pkg'],
  // prettier-ignore
  ppt: ['fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'dps', 'dpt', 'wpp'],
  psd: ['psd'],
  python: ['python'],
  sh: ['sh'],
  sketch: ['sketch'],
  sql: ['sql'],
  text: ['text', 'txt'],
  video: ['mp4', 'avi', 'mov', 'rmvb', 'rm', 'flv', 'mpeg', 'wmv', 'mkv'],
  vue: ['vue'],
  // prettier-ignore
  word: ['doc', 'docm', 'docx', 'dot', 'dotm', 'dotx', 'epub', 'fodt', 'odt', 'ott', 'rtf', 'wps', 'wpt'],
  xmind: ['xmind'],
  // prettier-ignore
  zip: ['zip', 'rar', 'tar', 'gz', 'gzip', 'uue', 'bz2', 'iso', '7z', 'z', 'ace', 'lzh', 'arj', 'cab'],
  font: ['eot', 'otf', 'fon', 'font', 'ttf', 'ttc', 'woff', 'woff2'],
}

export const getFileExtname = (filename) => {
  const splitFileName = filename?.split('.')
  return splitFileName ? splitFileName[splitFileName.length - 1] : undefined
}

export const getFileIcon = (filename) => {
  let iconName = 'common'
  const extname = getFileExtname(filename)
  if (extname) {
    for (const type of Object.keys(fileTypes)) {
      if (fileTypes[type].includes(extname)) {
        iconName = type
      }
    }
  }
  return iconName
}

export const getImageDimensions = (file) => {
  try {
    return new Promise((resolve) => {
      const { type } = file
      if (type.startsWith('image/')) {
        const img = new Image()
        img.onload = () => {
          const width = img.naturalWidth
          const height = img.naturalHeight
          URL.revokeObjectURL(img.src)
          resolve({ width, height }) // 返回宽高对象
        }
        img.onerror = () => {
          // 出错时返回默认尺寸或null，根据需求调整
          resolve({ width: 0, height: 0 })
        }
        img.src = URL.createObjectURL(file)
      } else {
        resolve({ width: 0, height: 0 })
      }
    })
  } catch (e) {
    return null
  }
}

export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

const loadImageElement = (file) => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to decode image'))
    }

    image.src = objectUrl
  })
}

const replaceExtension = (filename, nextExtension) => {
  const basename = filename?.replace(/\.[^.]+$/, '') || 'image'
  return `${basename}.${nextExtension}`
}

export const compressImageForEmbedding = async (
  file,
  { maxWidth = 600, mimeType = 'image/webp', quality = 0.6 } = {},
) => {
  const { width, height } = await getImageDimensions(file)

  if (!width || !height) {
    const src = await fileToDataURL(file)
    return {
      src,
      width: 0,
      height: 0,
      type: file.type,
      size: file.size,
      name: file.name,
    }
  }

  const scale = width > maxWidth ? maxWidth / width : 1
  const targetWidth = Math.max(1, Math.round(width * scale))
  const targetHeight = Math.max(1, Math.round(height * scale))

  const image = await loadImageElement(file)
  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const context = canvas.getContext('2d', { alpha: true })
  if (!context) {
    const src = await fileToDataURL(file)
    return {
      src,
      width: targetWidth,
      height: targetHeight,
      type: file.type,
      size: file.size,
      name: file.name,
    }
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight)

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, mimeType, quality)
  })

  if (!blob) {
    return {
      src: canvas.toDataURL(mimeType, quality),
      width: targetWidth,
      height: targetHeight,
      type: mimeType,
      size: file.size,
      name: replaceExtension(file.name, 'webp'),
    }
  }

  const embeddedFile = new File([blob], replaceExtension(file.name, 'webp'), {
    type: mimeType,
  })

  return {
    src: await fileToDataURL(embeddedFile),
    width: targetWidth,
    height: targetHeight,
    type: mimeType,
    size: blob.size,
    name: embeddedFile.name,
  }
}

export const dataURLToFile = (dataURL, name) => {
  if (!dataURL || !dataURL.startsWith('data:')) {
    throw new Error('Invalid dataURL')
  }

  const [header, data] = dataURL.split(',')
  const mimeMatch = header.match(/data:(.*?)(;|$)/)

  if (!mimeMatch) {
    throw new Error('Cannot parse mime type from dataURL')
  }
  const [, mime] = mimeMatch

  // mime → 后缀映射
  const extensionMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
  }

  const ext = extensionMap[mime] || mime.split('/')[1] || 'png'
  const filename = `${name}.${ext}`

  let content

  if (header.includes('base64')) {
    const binary = atob(data)
    const buffer = new Uint8Array(binary.length)

    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i)
    }

    content = buffer
  } else {
    // 非 base64（如 svg+xml;utf8）
    content = decodeURIComponent(data)
  }

  const file = new File([content], filename, { type: mime })

  return { file, filename }
}

export const svgToDataURL = (svg) => {
  let svgString = svg
  if (svg instanceof SVGElement) {
    svgString = new XMLSerializer().serializeToString(svg)
  }
  svgString = svgString
    .replace(/>\s+</g, '><') // 去空格
    .replace(/\n/g, '')
    .trim()
  const encoded = btoa(unescape(encodeURIComponent(svgString)))
  return `data:image/svg+xml;base64,${encoded}`
}
