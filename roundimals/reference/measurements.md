# Measurements and the reasoning behind them

All numbers use a head 100 units wide. They were chosen for the shared animal body and checked by rendering every animal in every pose (`reference/render-sheet.mjs`).

## Style constants

| What | Value |
|---|---|
| Arm thickness | 36 (about a third of the head) |
| Paw (circle) diameter | 46 (a bit under half the head) |
| Bent arm segments | 60 to 90 each, within 25 % of each other |
| Raised straight arm | up to about 1.5 x the head |
| Shoulder (center of the arm's round end) | fully inside the torso outline |
| Finger or thumb width | 1/3 of the paw diameter (15) |
| Thumb of a paw up | sticks out 15 past the paw, shifted toward the body |
| Pointing index | tip about 1.6 x the paw radius from the paw center, along the top edge |
| Waving paw | four toe capsules, no palm, each 0.46 x the arm thick and 1.1 x the arm long |
| Eyes | white pills 28 x 38, pupils (12 x 19) in the upper part, no eyebrows |

Rules that hold everywhere:
- three shapes (rounded rectangle, circle, rounded triangle), all corners rounded;
- no outlines, flat color, at most one shade step, never gray;
- the arm socket is always hidden inside the torso;
- paws stay circles, digits only as the gesture needs;
- floor shadows are pills, not ovals;
- few colors, so the image reads at small sizes;
- a same-color part behind another can go one step darker.

## The shared animal body

| What | Value | Reasoning |
|---|---|---|
| Head | 100 x 112, corner radius 46 | Nearly a capsule: reads as an animal, leaves room for ears on top |
| Neck | none | Animals read cuter with the head sitting on the body; the torso top hides behind the chin |
| Torso | 128 wide (140 for bear and hamster), tombstone, y 44 to 160 | A short, chubby body (about 1.3 x the head) keeps the head dominant, like a mascot |
| Arm | 36 | Thick enough to never read as a stick |
| Paw | radius 23 (diameter 46) | At 50 the paws next to the short torso looked swollen |
| Shoulder | (±38, 98) | Fully inside the torso: half width there is 63, the arm's end reaches 56 |
| Hanging arm | paw at (±74, 150) | Short body, short arm; angled out so the paw lands at the silhouette edge |
| Eyes | centers 38 apart, y -10 | Leaves room for the muzzle below |
| Muzzle | pill 60 x 38 at y 30 | Holds the nose and every mouth shape; the light color carries the "animal" read |
| Feet | pills 50 x 30 at (±30, 166) | Two bumps under the torso: enough to stand, no legs needed |
| Floor shadow | pill 150 x 10 at y 186 | A pill keeps the flat perspective |
