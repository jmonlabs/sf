// Rend chaque caisse d'un kit de drums.sf3 en un fichier WAV, un par numéro
// General MIDI (35 à 81), pour qu'un Tone.Sampler les joue.
//
//   deno run -A make-drum-samples.mjs            (le kit standard, 0)
//   deno run -A make-drum-samples.mjs 32 jazz    (un autre kit : numéro, nom du dossier)
//
// Mono, 44,1 kHz, vélocité 100, sans réverbération ni chorus ; chaque son est
// rendu jusqu'à ce qu'il s'éteigne (-70 dB), au plus 4 secondes. Tout le kit
// est monté du même gain (`gain`), pour que la grosse caisse arrive vers -3 dB
// comme les autres échantillons : l'équilibre entre les caisses ne change pas.
import * as core from "npm:spessasynth_core@4.3.22";

const program = Number(Deno.args[0] ?? 0);
const folder = Deno.args[1] ?? "standard";
const rate = 44100;
const maxSeconds = 4;
const block = 128;
const gain = 3; // +9,5 dB, pour tout le kit

const bytes = await Deno.readFile(new URL("./drums.sf3", import.meta.url));
await Deno.mkdir(new URL(`./drums/${folder}/`, import.meta.url), { recursive: true });

for (let note = 35; note <= 81; note++) {
  const synth = new core.SpessaSynthProcessor(rate, { effectsEnabled: false });
  await synth.processorInitialized;
  synth.soundBankManager.addSoundBank(core.SoundBankLoader.fromArrayBuffer(bytes.buffer), "main");
  synth.programChange(9, program); // le canal 10 de General MIDI, celui de la batterie
  synth.noteOn(9, note, 100);
  const length = rate * maxSeconds;
  const left = new Float32Array(length);
  const right = new Float32Array(length);
  for (let i = 0; i < length; i += block) {
    if (i === Math.floor(rate * 0.5)) synth.noteOff(9, note); // relâchée après une demi-seconde
    synth.process(left, right, i, Math.min(block, length - i));
  }
  const mono = left.map((v, i) => gain * (v + right[i]) / 2);
  // jusqu'à ce que le son s'éteigne
  let end = mono.length;
  const floor = 10 ** (-70 / 20);
  while (end > rate * 0.05 && Math.abs(mono[end - 1]) < floor) end--;
  const trimmed = mono.slice(0, Math.min(mono.length, end + Math.floor(rate * 0.02)));
  const peak = trimmed.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const wav = core.audioToWav([trimmed], rate, { normalizeAudio: false });
  await Deno.writeFile(new URL(`./drums/${folder}/${note}.wav`, import.meta.url), new Uint8Array(wav));
  console.log(note, `${(trimmed.length / rate).toFixed(2)} s`, peak > 0 ? `${(20 * Math.log10(peak)).toFixed(1)} dB` : "silence");
}
