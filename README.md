# sf

SoundFont banks for jmon, served from GitHub so that a piece plays them without anything to install. One folder per source, each with its licence.

## musescore

The MuseScore General bank, licence MIT (`musescore/MuseScore_General_License.md`).

- `MuseScore_General.sf3`: the whole bank, 309 presets (General MIDI instruments and drum kits), 40 MB.
- `drums.sf3`: its drum kits alone, 1.9 MB: Standard (0), Room (8), Power (16), Electronic (24), TR-808 (25), Jazz (32), Brush (40), Orchestra (48). Every General MIDI drum sound from 35 to 81. jmon/sound plays it for `synth: "drumkit"`. Made by `make-drums.mjs`, from inside `musescore/`:

      deno run -A make-drums.mjs

## Adding a source

A new folder named after the source (lower case, hyphens), the bank files as published, and the licence file beside them. Only banks whose licence allows redistribution.
