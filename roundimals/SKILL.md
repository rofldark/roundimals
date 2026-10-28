---
name: roundimals
description: Draws upright cartoon animals (dog, cat, lion, tiger, bear, hamster, rabbit, panda, monkey, capybara) in a flat, rounded mascot style for apps - quiz hosts, game guides and chat avatars. Three rounded shapes, pill eyes without eyebrows, thick capsule arms with round paws, flat color with at most one shade, on one shared animal body, with a fixed set of poses (neutral, asking, explaining, paw up, cheering, sad, waving, surprised) and avatar expressions, natural or fantasy colors from one hex value, and optional clothes. Use when asked to draw, generate, review or fix a cute flat animal mascot, animal avatar or animal character (SVG, React Native SVG, Skia, canvas, Figma specs), when someone mentions roundimals, or when an animal in this style looks off.
---

# Roundimals

Draw original animal characters in a flat, rounded mascot style: three rounded shapes, flat color, big expressive eyes, thick arms and round paws. The proportions are tested in `reference/kit.mjs`.

**Never imitate an existing brand's mascot or logo.** This skill has no birds and no owl on purpose: do not draw one in this style. The animals here are new characters, nothing more.

## The frame

Draw every animal in one frame: **the head is 100 units wide and its center is (0, 0)**, with y growing downward. All numbers below use that unit. To place an animal in a scene, translate and scale the whole group.

## 1. Shape language (always)

- **Three shapes only:** the rounded rectangle (the most used), the circle and the rounded triangle. Every corner is rounded; pointy shapes are off-brand. A capsule is a fully rounded rectangle.
- **Few shapes:** the fewest shapes that tell the story. An animal is told by one or two big shapes (ears, mane, stripes), not by detail.
- **Rhythm:** big and small side by side (big head, small nose, round paws).
- **No outlines.** Parts are separated by flat color only.
- **One shade step at most per color.** No gradients, no textures, no transparency to fake a darker tone.
- **Flat perspective:** a floor shadow is a pill, never an oval.
- **Few colors**, and **never gray** for fur or clothes. A "gray" animal (cat, rabbit) becomes a cool pastel (lilac-blue).

## 2. The shared body (head width = 100)

All ten animals use the same body. Only the ears, the head markings, the tail and sometimes the torso width (and for the capybara the head outline) change.

| Part | Shape | Size | Value in the kit |
|---|---|---|---|
| Head | Rounded rectangle, nearly a capsule | 100 x 112, corner radius 46 | y -58 to 54 |
| Torso | Tombstone: half-circle top (round shoulders), straight sides, rounded bottom | 1.28 x the head (1.4 for bear, hamster and panda, 1.44 for capybara) | top 44 (hidden behind the chin), bottom 160 |
| Belly | Light pill on the torso | 0.56 x the torso width | center y 120 |
| Neck | None: the head sits on the torso | n/a | n/a |
| Feet | Two pills in front of the torso bottom | 50 x 30 | centers (±30, 166) |
| Arm | Capsule, same thickness from shoulder to paw | 36: about a third of the head | 36 |
| Shoulder (the arm's round end) | Fully inside the torso outline | n/a | (±38, 98) |
| Paw | Circle | Diameter about half the head (46) | radius 23 |
| Hanging arm | One straight capsule, angled out | about 65 from shoulder to paw center | paw at (±74, 150) |
| Bent arm | Two capsules sharing one round elbow | 60 to 90 each, within 25 % of each other | n/a |
| Raised straight arm | One capsule | up to about 1.5 x the head | 144 in the cheer |
| Thumb, index finger | Capsule | width 15 (1/3 of the paw) | n/a |
| Floor shadow | Pill | 150 x 10 | y 186 |

## 3. The ten animals

Each animal is told by its signature shapes. Keep them big and few.

| Animal | Ears | Head markings | Tail | Torso |
|---|---|---|---|---|
| Dog | Floppy: two capsules (34 thick) hanging at the head's sides, in front of the head, in the pattern color | Light muzzle | Short capsule, up and out | 128 |
| Cat | Pointed: rounded triangles behind the head, light or pink inner triangle | Light muzzle, pink nose | Two-segment capsule curling up | 128 |
| Lion | Small round ears (r 14) inside the mane | Mane: one circle (r 66) plus a ring of 12 circles in two sizes (rhythm), behind the head | Thin capsule with a mane-colored tuft circle | 128 |
| Tiger | Round ears (r 17), light inner circle | Stripes: rounded triangles that start at the head's edge (3 on the forehead, 2 per cheek) | Curling capsule, dark tip | 128 |
| Bear | Big round ears (r 20), light inner circle | Light muzzle | None (from the front) | 140 |
| Hamster | Small round ears (r 15), pink inner | Big light cheek circles (r 19) that break the head outline | None | 140 |
| Rabbit | Long capsule ears (30 thick, about 0.9 x the head long), pink inner capsule | Light muzzle, pink nose | Light cotton circle | 128 |
| Panda | Round dark ears (r 19), no inner | White head without a muzzle; two dark eye patches: tilted pills (37 x 52) whose bottoms point outward, with a gap between them. Body, arms and feet are dark, the belly white | None | 140 |
| Monkey | Round ears on the sides of the head (r 20, at eye height), light inner | Light face mask: two circles around the eyes plus a wide muzzle pill, one shape in one color | Long thin capsule curling up | 128 |
| Capybara | Tiny round ears (r 11) at the top corners | Its own head: wider, flatter, boxier (112 x 106, corner radius 32). A blunt, boxy snout (84 x 46, radius 21) one step **darker** than the fur, two flat nostril pills, and a split lip: a short line down from the nose that every mouth hangs from; the smile is a "ω" | None | 144 |

- **Ears behind, except floppy ones.** Upright ears, the mane and the inner ears are drawn before the head. Floppy dog ears hang in front of the head, at its sides, and must not touch the eyes.
- **The tail goes on the side opposite the gesturing arm** (the kit puts it on the left of the image). A tail next to a raised or crossing arm turns into a tangle.
- **No whiskers, no claws, no toe beans, no fur tufts.** They are detail the style does not have.
- **Dark parts take the dark color all the way:** a panda's arms and paws are the pattern color with no shade step, and a closed eye on a dark eye patch is a light stroke.
- **Eye cuts take the color around the eye:** fur, the monkey's light mask or the panda's dark patch. Keep the cut inside the eye's box, or it paints over the face.
- **Do not add more animals by mixing**: a new animal gets one or two signature shapes on the same body, chosen the same way as above.

## 4. Arms and paws

- **An arm is a thick capsule** (36), the same thickness all the way. A thin "stick" arm breaks the style.
- **The shoulder is always hidden.** The arm's round end sits fully inside the torso; draw arms that go behind before the torso.
- **Straight, or one bend.** A bent arm is two capsules sharing one round elbow (a polyline with round caps and joins). Never a continuous curve, never an extra ball at the elbow.
- **Bare arm:** the arm is fur-colored and the paw circle sits on top of its end. **Sleeve:** the paw is drawn first and the sleeve end covers its top a little (paw center 30 past the sleeve end).
- **Same-color overlap:** an arm in front of the fur body merges with it. The pose reads from the elbow sticking out of the silhouette and from where the paw lands.
- **Where the paw lands:** on the face or chin, at the silhouette's edge, on an object, or in the air. A lone paw in the middle of the belly reads as a stray dot.
- **Paw over the face:** one shade darker (`furShade`).
- **Digits only for the gesture** (each a capsule 1/3 of the paw wide, never a thin line):

  | Gesture | Paw |
  |---|---|
  | Fist, holding, cheering, hanging, paw at the chin | Circle only |
  | Paw up (thumbs up, "right answer") | Circle plus a thumb capsule sticking 15 past the top, shifted toward the body |
  | Pointing (explaining) | Circle plus an index capsule along the top edge, its tip about 1.6 x the paw radius from the paw center |
  | Waving | Four short capsules fanned out from the arm's end, no extra palm (each 0.46 x the arm thick, 1.1 x the arm long) |

## 5. Face (inside the 100-wide head)

- **Eyes:** white pills standing up, 28 x 38, centers 38 apart, at y -10. Never ovals.
- **Pupil:** a dark pill (12 x 19) in the upper part of the eye, plus a small white shine dot on the same side in both eyes.
- **Muzzle:** a light pill (60 x 38) centered at y 30, drawn after the eyes. It carries the nose and the mouth.
- **Nose:** a rounded triangle pointing down, at the top of the muzzle, in the nose color.
- **No eyebrows.** Emotion comes from cutting the white of the eye (a fur-colored lid or cheek shape) and from the pupil size.

  | Expression | Eyes | Mouth |
  |---|---|---|
  | neutral | Open | Smile stroke, pulled to one side |
  | happy | Open, cheek cut pushing up from below | Open mouth with tongue |
  | laugh | Closed: upward arcs in the feature color | Open mouth with tongue |
  | thinking | Pupils up and to the side | Short flat stroke |
  | surprised | Smaller pupils | Small dark "o" pill |
  | sad | Lid slanting down toward the outside, pupils down, a tear | Downturned stroke |
  | talking | Open | Small open mouth |

- **A big smile is an open mouth.** People in this style smile with a white tooth shape; on an animal it sits on the light muzzle and disappears.
- **Closed eyes and mouth strokes** use the feature color (a dark tone of the fur), never black.
- **Tear:** a light-blue rounded triangle plus a circle under the outer corner of one eye.

## 6. Poses

The kit's eight poses cover the usual app moments:

| Pose | App moment | How |
|---|---|---|
| neutral | Idle, a list entry | Arms hanging, smile |
| asking | Quiz question | Paw under the chin (shade color), pupils up to the side |
| explaining | Guide, tip, next to a speech bubble | One straight arm pointing to the side, talking |
| pawUp | Right answer | Bent arm, forearm standing, thumb up, happy |
| cheering | Level done, streak | Both arms up in a V, laughing |
| sad | Wrong answer | Arms close to the body, sad eyes, tear |
| waving | Hello, onboarding | Bent arm up, four toes fanned |
| surprised | Unexpected result | Both paws beside the face at the silhouette edge, wide eyes, "o" |

- **Silhouette test:** fill the animal in one color; the gesture must still read.
- **Size test:** check at the smallest size the image ships at (for example 48 px for a chat avatar). The eyes and the gesture must still read.
- **Avatar:** head and shoulders, no arms, no tail. In a round crop, keep the face centered and let the torso run off the bottom.
- **Speech bubble:** put it on the side the explaining arm points to.

## 7. Layer order (back to front)

1. Floor shadow
2. Tail
3. Arms that go behind the torso
4. Torso, belly (or clothes)
5. Feet
6. Mane, upright ears, inner ears
7. Head, eye patches or face mask, eyes and eye cuts, markings, cheeks, muzzle, nose, mouth, tear
8. Floppy ears
9. Arms in front (bare arm, then paw on top)

## 8. Color

**Natural palettes** (in the kit) use flat, bright tones:

| Animal | fur | light | pattern / ears | nose |
|---|---|---|---|---|
| Dog | #E5A259 | #FFF1DC | #A56644 | #4B2A1A |
| Cat ("gray", cool pastel) | #A9A5DE | #ECEBFF | inner ear #FFB2B2 | #F5A4A4 |
| Lion | #FFC24A | #FFF3CF | mane #E0761F | #6B3410 |
| Tiger | #FF9600 | #FFF6E8 | stripes #5A2E14 | #4B2A1A |
| Bear | #A56644 | #E8BC8E | n/a | #3C1F12 |
| Hamster | #FFB863 | #FFF6EA | inner ear #FFB2B2 | #F57F86 |
| Rabbit | #F2D3B6 | #FFFFFF | inner ear #FFB2B2 | #F57F86 |
| Panda | #FFFFFF (head, belly) | #FFFFFF | body, ears, patches #3D3B4F | #3D3B4F |
| Monkey | #7A4B33 | face mask #F4CDA5 | #5A3220 | #5A3220 |
| Capybara | #C0824F | belly #E9C29A | snout #9C6237 | #4A2812 |

**Each animal has:** fur, furShade (one step darker), light (muzzle, belly, inner ear), feature (closed eyes, mouth strokes), nose, pattern (mane, stripes, floppy ears), inner (inner ear). Face colors are fixed: eye white #FFFFFF, pupil #3C3C3C, open mouth #B03A3A, tongue #F15A5A, tear #7FD4FF.

**Fantasy colors from one value** ("a blue lion"): derive the whole palette from the one color, as `paletteFromColor()` does:
- fur = the color (lightness kept between 42 % and 80 %);
- furShade = 7 points darker;
- light = the same hue at 93 % lightness or more;
- feature = the same hue, more saturated, at 45 % of the fur's lightness; nose a bit darker still;
- pattern = 20 points darker than the fur;
- a color with almost no saturation becomes a cool pastel (hue 245). Never gray.

Tested fantasy starting points (the kit's `FANTASY` names): blue #1CB0F6, purple #CE82FF, pink #FFAADE, green #58CC02, red #FF4B4B, yellow #FFC800.

**Clothes (optional, off by default):** a shirt or hoodie replaces the belly with one flat color covering the torso; sleeves take the clothes color and cover the top of the paws; a hoodie adds a hood pill behind the chin (one shade darker) and two white strings. Paws, feet, head and ears stay fur.

## 9. Workflow

1. **Read the request:** which animal, the app moment (pose or avatar expression), the size it ships at, natural or fantasy color, clothes, output format.
2. **Start from the kit** when code is wanted: `animal(species, pose, { color, clothes })` or `avatar(species, expression, opts)`, then `toSvg(parts, { frame: frameFor(species, kind) })`. From the command line: `node reference/render.mjs lion cheering --color blue > lion.svg`.
3. **New pose:** place the shoulder (inside the torso), the elbow (breaking the silhouette when the forearm crosses the body) and the paw center; keep the two segments similar in length. Put the tail on the other side. In code, `custom(species, expression, arms, opts)` draws it; the expression can be an object such as `{ eyes: 'blink', mouth: 'smile' }`. For animation frames, keep the shoulders fixed, turn the forearm around the elbow, and lift everything but the first part (the floor shadow) for a hop.
4. **New animal:** one or two signature shapes on the shared body (section 3), a natural palette with the same keys.
5. **Render and check:** run the checklist and view the result at its final size. After changing the kit, run `node reference/render-sheet.mjs out` and look at `out/sheet.svg`.
6. **Fix what reads poorly** by changing the pose before adding shapes.

## 10. Checklist before showing anything

- [ ] Only rounded rectangles, circles and rounded triangles. No outlines, gradients, transparency or gray.
- [ ] The animal reads from its one or two signature shapes; no whiskers, claws or fur detail.
- [ ] Arms are 36 thick, the shoulder is hidden inside the torso, each arm is straight or has one bend.
- [ ] Paws are circles about half the head wide; digits only for the gesture, as thick capsules.
- [ ] Eyes are white pills with the pupil in the upper half; no eyebrows; the muzzle sits below the eyes.
- [ ] A big smile is an open mouth, not white teeth.
- [ ] The tail does not cross a gesturing arm.
- [ ] Nothing is cut off by the frame (pointing finger, rabbit ears).
- [ ] It reads at the final size, and the silhouette alone tells the pose.
- [ ] It is not an owl, not a bird, and not an imitation of any brand's mascot.

## 11. Mistakes already made, and the fix

| What it looked like | Why | Fix |
|---|---|---|
| Teeth vanished, the animal looked mouthless | A white tooth shape on the light muzzle | Open mouth: dark shape with a tongue |
| An arm tangled with the tail | Tail on the same side as the arm asking or explaining | Tail on the other side |
| A square-headed cat | Pointed ears starting at the head's outer edge, continuing the straight side | Ear bases further in and lower, the outer corner tucked behind the head |
| A pointing paw with no finger | The paw and index ran past the image frame | Shorter reach, wider frame (x -160 to 160) |
| Eyes nibbled from below | Hamster cheeks placed too high | Cheeks lower (center y 33), only touching the eye's bottom edge |
| A panda in glasses | Upright eye patches touching in the middle | Patches tilted (bottoms outward) with a gap between them |
| A white panda vanished on a light app background | White body, only arms dark | Dark body with a white belly, like a real panda |
| A capybara that read as a bear | Same round head and light muzzle as the bear | Wider, boxier head, a darker blunt snout, split lip with a "ω" smile, tiny ears |
| A capybara that read as a pig | Two round nostril dots on a light muzzle | Flat nostril pills on a darker snout |
| An angry capybara | Nostrils slanted like a "\ /" | Flat, horizontal nostrils |
| A gray cat looked lifeless and off-style | Gray fur | Cool pastel (lilac-blue) fur, pink inner ear and nose |
| A ball on the shoulder | The arm's round end at the torso's top corner | Shoulder lower and further in, fully inside the torso |

## Reference files

- `reference/measurements.md`: every number of the shared body and the reasoning behind it.
- `reference/kit.mjs`: a dependency-free JavaScript kit (Node 18+). It draws all ten animals in eight poses and seven avatar expressions, poses of your own (`custom()`), natural or fantasy colors and optional clothes, following every rule above. Each function returns plain shape data, and `toSvg()` turns it into SVG. Port the geometry unchanged to React Native SVG, Skia or canvas.
- `reference/render.mjs`: writes one animal as an SVG file (`node reference/render.mjs <animal> <pose|avatar:expression> [--color] [--clothes] [--size] [--background] [--round]`).
- `reference/render-sheet.mjs`: writes a contact sheet of everything. Run it after any change to the kit and look at the result before showing anyone.
