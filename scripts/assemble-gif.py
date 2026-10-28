# scripts/assemble-gif.py
# Joins the PNG screenshots of the frames from make-gif.mjs into example.gif.
# Needs Pillow (pip install pillow).
# Usage: python scripts/assemble-gif.py <frames folder> example.gif [width]
import glob
import sys

from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
width = int(sys.argv[3]) if len(sys.argv) > 3 else 1500

frames = []
for f in sorted(glob.glob(src + '/frame-*.png')):
    im = Image.open(f).convert('RGB')
    frames.append(im.resize((width, round(im.height * width / im.width)), Image.LANCZOS))

# one shared palette from all frames keeps the colors stable from frame to frame
strip = Image.new('RGB', (width, frames[0].height * len(frames)))
for i, im in enumerate(frames):
    strip.paste(im, (0, i * im.height))
palette = strip.quantize(colors=128, method=Image.Quantize.MEDIANCUT)
q = [im.quantize(palette=palette, dither=Image.Dither.NONE) for im in frames]
q[0].save(dst, save_all=True, append_images=q[1:], duration=50, loop=0, optimize=True, disposal=1)
print(dst, len(q), q[0].size)
