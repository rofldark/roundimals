# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]
### Added
- Install with `npx skills@latest add rofldark/roundimals`.
- Animated README title (`example.gif`): all ten animals waving, cheering, hopping and blinking; frames from `scripts/make-gif.mjs`, joined with `scripts/assemble-gif.py`.
- `custom()` in the kit for poses of your own, and a `blink` eye state for animation frames.

### Changed
- README starts with the install command and a concrete example (prompt plus result) right under the animated title; features as a short list.

## [0.2.0] – 2026-10-28
### Added
- Three more animals: panda (dark body, eye patches), monkey (face mask, side ears, long tail) and capybara (its own boxy head, a darker blunt snout, flat nostrils and a split "ω" smile). Ten animals in total.
- README preview images (poses, chat avatars, fantasy colors and clothes) and `scripts/make-gallery.mjs` to rebuild them.

## [0.1.0] – 2026-10-28
### Added
- Skill `roundimals` with rules, proportions, checklist and mistakes table for upright animals in a flat, rounded mascot style.
- Seven animals on one shared body: dog, cat, lion, tiger, bear, hamster, rabbit.
- Eight poses (neutral, asking, explaining, pawUp, cheering, sad, waving, surprised) and seven avatar expressions.
- Natural palettes plus fantasy colors derived from a single value, never gray.
- Optional clothes (shirt, hoodie).
- Dependency-free drawing kit `reference/kit.mjs`, single-image CLI `reference/render.mjs`, contact sheet `reference/render-sheet.mjs`.
- `scripts/make-example.mjs` for the README title image.
