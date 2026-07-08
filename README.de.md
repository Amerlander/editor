<p style="text-align: center; margin: 2rem 0;">
<a href="https://www.umodoc.com/en" target="_blank"><img src="https://unpkg.com/@umoteam/editor-external@latest/static/logo.svg" alt="umodoc.com" width="280" /></a>
</p>

<p style="text-align: center;">
<a href="https://github.com/umodoc/editor/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/@umoteam/editor" /></a>
<a href="https://www.npmjs.com/package/@umoteam/editor" target="_blank"><img src="https://img.shields.io/npm/v/@umoteam/editor" /></a>
<a href="https://www.npmjs.com/package/@umoteam/editor" target="_blank"><img src="https://img.shields.io/npm/dm/@umoteam/editor" /></a>
<a href="https://www.npmjs.com/package/@umoteam/editor" target="_blank"><img src="https://img.shields.io/npm/unpacked-size/@umoteam/editor" /></a>
<a href="https://github.com/umodoc/editor/commits" target="_blank"><img src="https://img.shields.io/github/commit-activity/m/umodoc/editor" /></a>
</p>

<p style="text-align: center;"><a href="./README.md">English</a> | Deutsch</p>

## Einführung

Umo Editor ist ein quelloffener Dokumenteneditor auf Basis von Vue3 und Tiptap3, der ein Online-Bearbeitungserlebnis ähnlich wie Microsoft Word bietet. Er stellt leistungsstarke Funktionen zur Dokumentenbearbeitung sowie KI-gestützte Erstellungsfunktionen bereit. Umo Editor unterstützt den Seitenumbruch- und den normalen Web-Modus, Markdown-Syntax, Rich-Text-Bearbeitung, das Einfügen verschiedenster Knotentypen, Seitenstil-Einstellungen, Dokumentenexport und Drucken. Darüber hinaus unterstützt er benutzerdefinierte Erweiterungen, mehrsprachige Einstellungen und ein dunkles Design. Umo Editor unterstützt außerdem das Web-Layout, sodass Sie ihn als gewöhnlichen Rich-Text-Editor verwenden können.

Wir stellen zudem eine eigenständige Vorschaukomponente [Umo Viewer](https://github.com/umodoc/viewer) bereit, die Nutzer in ihre Projekte einbinden können, um Dokumente anzuzeigen.

Das größte Merkmal von Umo Editor ist, dass sein Code vollständig quelloffen und selbstbestimmt kontrollierbar ist. Er unterstützt die private Bereitstellung (Private Deployment), sodass Sie ihn in einer Intranet-Umgebung nutzen können, ohne sich um die Datensicherheit sorgen zu müssen. Gleichzeitig basiert Umo Editor auf Vue3 und Tiptap3, die beide über ein reichhaltiges Ökosystem und eine große Community verfügen, wodurch sich auftretende Probleme schnell lösen lassen.

Als eigenständiges Vue3-Plugin lässt sich Umo Editor mit null Konfiguration problemlos in verschiedene Vue3-Projekte integrieren. Für Nicht-Vue3-Projekte können Sie Umo Editor über ein Iframe in Ihr Projekt einbetten. Siehe [Verwendung in Nicht-Vue3-Projekten](https://dev.umodoc.com/en/docs/editor/getting-started#use-in-non-vue3-projects).

[Website](https://www.umodoc.com/en) | [Dokumentation](https://dev.umodoc.com/en/docs/editor) | [Playground](https://www.umodoc.com/en/demo) | [GitHub](https://github.com/umodoc/editor) | [NPM](https://www.npmjs.com/package/@umoteam/editor)

## Umo Editor Mobile

Umo Editor Mobile ist ein mobiler Dokumenteneditor, der mit Vue3 und Tiptap3 entwickelt wurde. Er unterstützt den vollständigen Ablauf aus „Vorschau + Bearbeiten + Speichern“ und kann direkt als eigenständiger Editor in Geschäftssysteme integriert werden. Anstatt eine einfach abgespeckte Version von Umo Editor zu sein, handelt es sich um ein eigenständiges Produkt, das für Touch-orientierte Szenarien neu konzipiert wurde – mit eigenem Speicher-Zustandsautomaten, automatischem Speichern, Schutzmechanismen bei der Zurück-Navigation, Verlauf, Internationalisierung, Theming und Erweiterbarkeit. Gleichzeitig hält es Konfiguration, Ereignisse und Methodenbenennung so weit wie möglich mit Umo Editor konsistent und hilft Teams so, eine einheitlichere plattformübergreifende Integration bei geringeren Kosten zu erreichen.

Wenn Sie sowohl die Desktop- als auch die mobile Nutzung unterstützen möchten, empfehlen wir, zunächst eine einheitliche Editor-Adapterschicht in Ihrer Geschäftsanwendung zu abstrahieren. So können Sie das Dokumentenmodell, die Konfigurationssemantik und den Speicherablauf wiederverwenden und die langfristigen Wartungskosten senken.

- Website: [https://mobile.umodoc.com](https://mobile.umodoc.com)
- Mobiler Playground: Öffnen Sie [https://em.umodoc.com](https://em.umodoc.com) in einem mobilen Browser
- Dokumentation: [https://dev.umodoc.com/en/docs/mobile](https://dev.umodoc.com/en/docs/mobile)

## Screenshots

![umo editor](https://s2.umodoc.com/images/umo-editor1-en@2x.png)

![umo editor](https://s2.umodoc.com/images/umo-editor2-en@2x.png)

![umo editor](https://s2.umodoc.com/images/umo-editor3-en@2x.png)

## Online-Demo

Besuchen Sie den [Playground](https://www.umodoc.com/en/demo?pane=hide), um Umo Editor auszuprobieren.

## Beispielprojekt

Um Ihnen einen schnellen Einstieg zu ermöglichen, stellen wir ein Demo-Projekt bereit: https://github.com/umodoc/demo. In diesem Projekt können Sie den Beispielcode von Umo Editor ansehen und ausführen.

Sie können es auch online mit StackBlitz, CodeSandbox oder Github Pages ansehen und ausführen:

- Ansehen und ausführen auf [StackBlitz](https://stackblitz.com/~/github.com/umodoc/demo?file=src/app.vue)
- Ansehen und ausführen auf [CodeSandbox](https://codesandbox.io/p/github/umodoc/demo/main?import=true)
- Ansehen und ausführen auf [Github Pages](https://umodoc.github.io/demo/)

## Dokumentation

Ausführliche Anleitungen finden Sie in der [Dokumentation](https://dev.umodoc.com/en/docs/editor).

## Designphilosophie

Umo Editor hat zum Ziel, die Dokumentenbearbeitung in Webanwendungen zu vereinfachen, indem er leistungsstarke, an Microsoft Word angelehnte Bearbeitungsfunktionen und einen Seitenumbruch-Modus bietet und dabei den Komfort von Webanwendungen bewahrt. Ob für Informationsmanagementsysteme in Behörden und Unternehmen, wissenschaftliches Schreiben, die Zusammenarbeit an Teamdokumenten, die Verwaltung von Wissensdatenbanken oder das Organisieren persönlicher Notizen – Umo Editor ist Ihr zuverlässiger Helfer.

## Vorteile von Open Source

- **Kostenlose Nutzung**: Umo Editor ist unter der [MIT-Lizenz](https://github.com/umo-editor/umo-editor/blob/main/LICENSE) für alle Entwickler kostenlos nutzbar, ohne urheberrechtliche Bedenken.
- **Kontinuierliche Updates**: Umo Editor wird kontinuierlich weiterentwickelt, um Funktionen zu optimieren und die Benutzererfahrung zu verbessern.
- **Individuelle Entwicklung**: Der offene Quellcode ermöglicht es Entwicklern, Umo Editor an projektspezifische Anforderungen anzupassen.

## Hauptfunktionen

- Unterstützung für die Intranet-Bereitstellung
- Null Konfiguration, sofort einsatzbereit
- Seitenumbruch-Modus ähnlich wie Microsoft Word
- Leichtgewichtig
- Vollständige WYSIWYG-Bearbeitung
- Rich-Text-Bearbeitung
- Unterstützung der Markdown-Syntax
- Integrierte praktische Werkzeuge
- Präsentationsmodus
- Dokumentenexport und -freigabe
- Seiteneinstellungen
- Unterstützung für Drucken und Druckvorschau
- Unterstützung benutzerdefinierter Erweiterungen
- Unterstützung von Tastenkürzeln
- Anpassbares Design (Theming)
- Mehrsprachige Einstellungen
- Dunkler Modus
- Unterstützung für das Web-Layout
- Eigenständige Dokumenten-Vorschaukomponente [Umo Viewer](https://github.com/umodoc/viewer)

Weitere Details finden Sie unter [Funktionen](https://dev.umodoc.com/en/docs/editor/features).

## Browser-Unterstützung

| Browser                | Version | Unterstützung |
| ---------------------- | ------- | :-----------: |
| Google Chrome          | Aktuell |      ✅       |
| Firefox                | Aktuell |      ✅       |
| Safari                 | Aktuell |      ✅       |
| Microsoft Edge         | Aktuell |      ✅       |
| Internet Explorer (IE) | Alle    |      ❌       |

## Systemvoraussetzungen

- **Node.js** (>=v18.x)
- **Vue** (>=v3.x)
- **Tiptap** (>=v3.x)

## Der Community beitreten

Wir ermutigen Nutzer, der Open-Source-Community von Umo Editor beizutreten und sich an der Entwicklung und Verbesserung des Produkts zu beteiligen. Ob Fehlerberichte, Funktionswünsche oder Code-Beiträge – Ihr Engagement ist für unsere Community von unschätzbarem Wert.

Reichen Sie Probleme oder Vorschläge über [GitHub Discussions](https://github.com/umodoc/editor/discussions) ein.

Melden Sie Fehler über [GitHub Issues](https://github.com/umodoc/editor/issues).

## Code beitragen

Die Entwicklung von Umo Editor ist auf die Unterstützung der Community angewiesen. Nachfolgend finden Sie eine Liste der Mitwirkenden, die Code zu Umo Editor beigetragen haben. Wir danken ihnen für ihren Einsatz:

- [Umo Team](https://github.com/umodoc): 👨‍💻 Kernentwickler
- [china-wangxu](https://github.com/china-wangxu): 💪🏻 Hat viele wichtige Funktionen hinzugefügt
- [Cassielxd](https://github.com/Cassielxd): 💪🏻 Hat viele wichtige Funktionen hinzugefügt
- [Na'aman Hirschfeld](https://github.com/Goldziher): 🛠️ Code beigetragen
- [SevenDreamYang](https://github.com/SevenDreamYang):🛠️ Code beigetragen
- [ChenErik](https://github.com/ChenErik): 🛠️ Code beigetragen
- [SerRashin](https://github.com/SerRashin): 🛠️ Russische Sprachunterstützung hinzugefügt
- [Sunny Wisozk](https://github.com/SunnyWisozk): 🛠️ Code beigetragen
- [Sherman Xu](https://github.com/xuzhenjun130): 🛠️ Code beigetragen
- [vace](https://github.com/vace)：🛠️ Code beigetragen
- [Mikasa33](https://github.com/Mikasa33)：🛠️ Code beigetragen

Wir freuen uns über alle Formen von Beiträgen, einschließlich – aber nicht beschränkt auf – Fehlerberichte, Funktionswünsche und Code-Beiträge.

## Kontakt

Wenn Sie Fragen oder Anregungen haben, kontaktieren Sie uns bitte über die folgenden Kanäle. Zuvor empfehlen wir Ihnen, diese Dokumentation gründlich zu lesen, um zu verstehen, wie Sie Umo Editor verwenden.

- Feedback: [GitHub Issues](https://github.com/umodoc/editor/issues)
- Community: [GitHub Discussions](https://github.com/umodoc/editor/discussions)
- E-Mail: [contact@umodoc.com](mailto:contact@umodoc.com)

## Technischer Austausch

- Discord：[Umo Editor](https://discord.gg/k8GjuBBhXD)

## Unterstützen Sie uns

Wenn Sie Umo Editor nützlich finden, erwägen Sie bitte, uns auf folgende Weise zu unterstützen:

- ⭐ Vergeben Sie einen Stern für das [Umo-Editor-Repository](https://github.com/umodoc/editor), um Ihre Unterstützung zu zeigen.
- 🔗 Wenn Sie Umo Editor in Ihrem Projekt verwenden, fügen Sie einen Link zu https://github.com/umodoc/editor hinzu.

## Produkte des Umo Teams

- [Umo Editor](https://dev.umodoc.com/en/docs/editor): Ein lokalisierter, quelloffener Dokumenteneditor auf Basis von Vue3 und Tiptap3.
- [Umo Viewer](https://dev.umodoc.com/en/docs/viewer): Ein quelloffener, leichtgewichtiger Dokumentenbetrachter für Umo Editor.
- [Umo Editor Mobile](https://mobile.umodoc.com): Ein mobiler Dokumenteneditor für geschäftliche Anwendungsszenarien in Unternehmen, konzipiert für die eigenständige Integration sowie für die Zusammenarbeit mit Umo Editor und Umo Editor Next.
- [Umo Editor Next](https://dev.umodoc.com/en/docs/next): Eine erweiterte Version von Umo Editor, die alle Funktionen der neuesten Umo-Editor-Version enthält und zusätzlich Unterstützung für mehrbenutzerfähige Echtzeit-Zusammenarbeit, Dokumentanmerkungen (Kommentare), Dokumentversionsverlauf, KI-gestützte Erstellung, Dokumentimport/-export, Tabellen und mehr hinzufügt oder verbessert. Außerdem erweitert sie die Anpassbarkeit von Symbolleisten und Seitenleisten.
- [Umo Editor Server](https://dev.umodoc.com/en/docs/server): Eine begleitende serverseitige Software, die entwickelt wurde, um die Fähigkeiten von Umo Editor zu erweitern, etwa mehrbenutzerfähige kollaborative Bearbeitung, Dokumentanmerkungen und Dokumentimport/-export.
- [Umo Office Viewer](https://dev.umodoc.com/en/docs/office-viewer): Ein Office-Dokumentenbetrachter, der die Vorschau von über 40 gängigen Office-Dokumenten in Webseiten unterstützt.
- [Umo Office Convert](https://dev.umodoc.com/en/docs/office-convert): Konvertiert über 40 Office-Formate in web-taugliche Formate und lässt sich mit Umo Office Viewer kombinieren, um eine nahtlose Online-Dokumentenvorschau zu ermöglichen.

## Open-Source-Lizenz

Umo Editor ist unter der [MIT-Lizenz](https://github.com/umodoc/editor/raw/main/LICENSE) lizenziert. Sie dürfen diese Software frei verwenden, ändern und weitergeben. Dies bedeutet jedoch **nicht**, dass Sie die Urheberrechtsinformationen nach Belieben entfernen dürfen. Bitte behalten Sie den Umo-Editor-Copyright-Hinweis sowie den in der Oberfläche angezeigten Link bei. Das Entfernen dieser Angaben wird als Rechtsverletzung betrachtet. Wir ermutigen Sie, Open-Source-Projekte zu unterstützen.

Wenn Sie die Urheberrechtsinformationen nicht beibehalten möchten, kontaktieren Sie uns bitte oder erwägen Sie den Kauf der kommerziellen Version: [Umo Editor Next](https://dev.umodoc.com/en/docs/next).

Diese Dokumentation wird unter der [CC BY-NC-SA 4.0 DEED-Lizenz](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de) veröffentlicht.
