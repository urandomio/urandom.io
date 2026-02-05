#!/usr/bin/env bash
set -euo pipefail

AGENT=${1:-bender}
REPO="/Users/jamesbrink/Projects/urandom.io/urandom.io"
GEN="/Users/jamesbrink/.openclaw/workspace/skills/comfyui/scripts/generate.py"
WIDTH=1024
HEIGHT=1024
STEPS=1

if [[ ! -x "$(command -v python3)" ]]; then
  echo "python3 not found" >&2
  exit 1
fi

if [[ ! -f "$GEN" ]]; then
  echo "generator not found: $GEN" >&2
  exit 1
fi

# prompt pools (slug|prompt)
if [[ "$AGENT" == "bender" ]]; then
  OPTIONS=(
    "liminal-hospital|abandoned hospital corridor, flickering fluorescent lights, fog, dark ambient horror, cinematic, 35mm, high detail"
    "dead-mall|abandoned shopping mall escalators, wet floor reflections, neon glow, eerie, liminal horror, cinematic"
    "flooded-basement|flooded basement, hanging bulb, black water, claustrophobic, dark horror, cinematic"
  )
elif [[ "$AGENT" == "calculon" ]]; then
  OPTIONS=(
    "backrooms-arcade|abandoned arcade in the backrooms, flickering CRTs, damp carpet, liminal horror, cinematic"
    "server-crypt|subterranean server vault, red LEDs, fog, cables like roots, dark horror, cinematic"
    "noir-subway|noir subway platform at 3am, rain mist, flickering lights, eerie, liminal horror"
  )
else
  OPTIONS=(
    "liminal-void|endless concrete corridor, dim emergency lights, heavy fog, liminal horror, cinematic"
  )
fi

PICK=${OPTIONS[$RANDOM % ${#OPTIONS[@]}]}
SLUG=${PICK%%|*}
PROMPT=${PICK#*|}
TS=$(date +"%Y%m%d-%H%M")
OUTFILE="$REPO/public/gallery/${AGENT}-flux-${SLUG}-${TS}.png"
THUMB="$REPO/public/gallery/thumbs/${AGENT}-flux-${SLUG}-${TS}.webp"

# Generate image
python3 "$GEN" "$PROMPT" --output "$OUTFILE" --width "$WIDTH" --height "$HEIGHT" --steps "$STEPS"

cd "$REPO"

# Update gallery index + thumbs
bun scripts/generate-gallery-index.ts
bun scripts/validate-gallery-index.ts

# Commit + push
if [[ ! -f "$OUTFILE" ]]; then
  echo "output image missing: $OUTFILE" >&2
  exit 1
fi

if [[ ! -f "$THUMB" ]]; then
  echo "thumb missing: $THUMB" >&2
  exit 1
fi

git pull --rebase

git add "$OUTFILE" "$THUMB" public/gallery/index.json

git commit -m "gallery: add ${AGENT} ${SLUG} (${TS})"

git push

printf "OK: %s\n" "$OUTFILE"
