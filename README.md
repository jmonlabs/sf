# sf

SoundFont banks for jmon, served from GitHub so that a piece plays them without anything to install.

- `MuseScore_General.sf3`: the MuseScore General bank, 309 presets (General MIDI instruments and drum kits). Licence MIT, see `MuseScore_General_License.md`.
- `drums.sf3`: the drum kits of `MuseScore_General.sf3` alone, 1.9 MB: Standard (0), Room (8), Power (16), Electronic (24), TR-808 (25), Jazz (32), Brush (40), Orchestra (48). Every General MIDI drum sound from 35 to 81. Made by `make-drums.mjs`:

      deno run -A make-drums.mjs

jmon/sound plays `drums.sf3` for `synth: "drumkit"`.
