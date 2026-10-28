<div align="center">

# Roundimals

**A Claude skill for cute, consistent SVG animal mascots: the same ten characters in every pose and expression, for apps, games, chat avatars and playful interfaces.**

![Release](https://img.shields.io/github/v/release/rofldark/roundimals) ![Dependencies](https://img.shields.io/badge/dependencies-none-blue) ![License](https://img.shields.io/badge/license-MIT-lightgrey)

<img width="100%" alt="A dog, cat, lion, tiger, bear, hamster, rabbit, panda, monkey and capybara waving, cheering, hopping and blinking" src="example.gif" />

**[Try it in your browser](https://rofldark.github.io/roundimals/)** — pick an animal, a pose and a color, download SVG or PNG. No install.

</div>

## Install

```bash
npx skills@latest add rofldark/roundimals
```

Then ask Claude for a mascot. Other ways to install are [further down](#other-ways-to-install).

## Example

> "Draw a blue lion cheering for my language app's level-complete screen."
>
> "Make a round chat avatar of a happy hamster."

<p>
<img height="200" alt="A blue lion cheering with both arms up" src="docs/img/example-blue-lion.svg" />
&nbsp;&nbsp;
<img height="120" alt="A round chat avatar of a laughing hamster on light blue" src="docs/img/example-hamster-avatar.svg" />
</p>

Both images are plain SVG, made by the skill's own drawing kit.

## Features

- **10 animals on one shared body:** dog, cat, lion, tiger, bear, hamster, rabbit, panda, monkey and capybara
- **8 poses** for app moments: neutral, asking, explaining, paw up, cheering, sad, waving, surprised
- **7 avatar expressions** for chats: neutral, happy, laugh, thinking, surprised, sad, talking
- **Any color** from a single value ("a blue lion"), natural colors by default, never gray
- **Optional clothes:** shirt or hoodie
- **Plain SVG output** from a dependency-free renderer, easy to port to React Native SVG, Skia, SwiftUI or canvas

> **Early release** — feedback and contributions are welcome! Shapes and rules may still change between releases.

## Preview

**Eight poses for app moments** (here: the tiger)

<img width="100%" alt="The tiger in eight poses: neutral, asking, explaining, paw up, cheering, sad, waving, surprised" src="docs/img/poses.png" />

**Chat avatars** with different expressions

<img width="100%" alt="Round chat avatars of all ten animals with different expressions" src="docs/img/avatars.png" />

**Fantasy colors and optional clothes**

<img width="100%" alt="A blue lion, pink cat, purple hamster, green dog, a bear in a hoodie and a rabbit in a shirt" src="docs/img/colors.png" />

The preview images are made with `node scripts/make-gallery.mjs <folder>`.

## Why use it?

Agents draw cartoon animals inconsistently: each one in a different style, with stick arms, whiskers and outlines, and teeth that vanish on a light muzzle. This skill gives Claude one shared body with fixed proportions, a short list of signature shapes for each animal, and a table of mistakes already made with the fix for each. The result is ten animals that look drawn by the same hand.

## Requirements

- Claude Code, or the Claude apps (web or desktop) with Skills enabled
- Optional: Node.js 18+ to run the drawing kit locally (no dependencies)

## Other ways to install

- **Claude Code:** copy the `roundimals` folder into `~/.claude/skills/` (every project) or into `.claude/skills/` inside one project.
- **Claude apps (web or desktop):** zip the `roundimals` folder (or download `roundimals.zip` from a release) and upload it in Settings, under Capabilities, Skills.

Claude loads the skill on its own when you ask for a flat animal mascot. You can also name it: "use the roundimals skill".

## Usage

Ask Claude, for example:

- "Draw an SVG of a tiger asking a quiz question, roundimals style."
- "Make a round chat avatar of a happy hamster on a light blue background."
- "I need a blue lion cheering for my language app's level-complete screen, as React Native SVG."
- "Give me the rabbit in all eight poses in a green hoodie."
- "Review this mascot and tell me what breaks the roundimals style."

Or render directly with the kit:

```bash
cd roundimals
node reference/render.mjs lion cheering > lion.svg
node reference/render.mjs cat waving --color pink > cat.svg
node reference/render.mjs bear explaining --clothes hoodie:#1CB0F6 > bear.svg
node reference/render.mjs hamster avatar:happy --round --background "#DDF4FF" --size 128 > avatar.svg
node reference/render-sheet.mjs out   # contact sheet of everything: out/sheet.svg
```

## Configuration

| Option (render.mjs) | Meaning | Example |
|---|---|---|
| `<animal>` | dog, cat, lion, tiger, bear, hamster, rabbit, panda, monkey, capybara | `lion` |
| `<pose>` or `avatar:<expression>` | one of the poses, or an avatar expression | `asking`, `avatar:talking` |
| `--color` | fantasy color: blue, purple, pink, green, red, yellow or any hex | `--color "#1CB0F6"` |
| `--clothes` | `shirt` or `hoodie`, then a color | `--clothes shirt:#FF4B4B` |
| `--size` | output width in px (default 400) | `--size 128` |
| `--background` | fill behind the animal | `--background "#F7F7F7"` |
| `--round` | clip to a circle (chat avatars) | `--round` |

## Reference

- **[SKILL.md](./roundimals/SKILL.md)**: the rules, proportions, the ten animals, poses, colors, a checklist and the mistakes to avoid.
- **[reference/measurements.md](./roundimals/reference/measurements.md)**: every number of the shared body and the reasoning behind it.
- **[reference/kit.mjs](./roundimals/reference/kit.mjs)**: the drawing kit (Node 18+, no dependencies). Port the geometry to React Native SVG, Skia or canvas unchanged.

## Note

The animals are original characters. The skill tells Claude never to imitate an existing brand's mascot or logo, and it deliberately has no birds.

## License

[MIT](./LICENSE)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md)
