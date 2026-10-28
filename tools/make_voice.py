"""Generate the game's voice clips with Kokoro, a local neural text-to-speech model.

    ~/.venvs/kokoro/bin/python tools/make_voice.py              # only new or changed phrases
    ~/.venvs/kokoro/bin/python tools/make_voice.py --force      # redo everything
    ~/.venvs/kokoro/bin/python tools/make_voice.py --voice af_heart  # American voice

Reads every phrase from phrases.js (via tools/export_phrases.js), writes audio/<id>.m4a,
and lists the finished clips in audio/manifest.json, which the game reads at start-up. Each clip
is listed with a short fingerprint of its wording and voice; the game adds it to the clip's
address (cat.m4a?v=1a2b3c4d), so a regenerated clip never comes from an old saved copy.
Voices starting with "a" are American English, "b" British English.
"""
import argparse
import hashlib
import json
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / 'audio'
CACHE = Path(__file__).resolve().parent / 'voice-cache.json'  # what each clip was made from
SAMPLE_RATE = 24000


def load_phrases():
    result = subprocess.run(
        ['node', str(ROOT / 'tools' / 'export_phrases.js')],
        check=True, capture_output=True, text=True,
    )
    return json.loads(result.stdout)


def number_aliases():
    """'7' -> 'seven', '25' -> 'twenty five', '100' -> 'one hundred'."""
    ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
            'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
    tens = {2: 'twenty', 3: 'thirty', 4: 'forty', 5: 'fifty', 6: 'sixty', 7: 'seventy', 8: 'eighty', 9: 'ninety'}
    words = {n: ones[n] for n in range(20)}
    words.update({n: tens[n // 10] + (f' {ones[n % 10]}' if n % 10 else '') for n in range(20, 100)})
    words[100] = 'one hundred'
    return {str(n): w for n, w in words.items()}


class Checker:
    """Listens to a clip with Whisper speech recognition and says whether it matches the text.

    Kokoro varies a little from run to run, so a clip that comes out unclear
    (e.g. "froggy" for "frog") is simply generated again.
    """

    # Things Whisper writes differently that sound right: digits, homophones, British vowels.
    ALIASES = {'6': 'six', '10': 'ten', 'pair': 'pear', 'pairs': 'pears', 'for': 'four', 'hutt': 'hut', 'daw': 'door', 'kai': 'car',
               'intent': 'in tent', 'matt': 'mat', 'matte': 'mat', 'finn': 'fin', 'bibb': 'bib',
               'cobb': 'cob', 'penn': 'pen', 'plumb': 'plum', 'caught': 'cot', 'sale': 'sail',
               'male': 'mail', 'sync': 'sink', 'tale': 'tail'}
    # Whisper writes numbers as digits ("How many? 7").
    ALIASES.update(number_aliases())

    def __init__(self):
        from faster_whisper import WhisperModel
        from scipy.signal import resample_poly
        self.model = WhisperModel('small.en', device='cpu', compute_type='int8')
        self.resample = resample_poly

    def words(self, text):
        out = []
        for word in re.sub(r'[^a-z0-9 ]', ' ', text.lower().replace('-', ' ')).split():
            out += self.ALIASES.get(word, word).split()
        return out

    def hear(self, audio):
        audio16 = self.resample(audio, 2, 3).astype(np.float32)  # 24 kHz -> 16 kHz
        segments, _ = self.model.transcribe(audio16, beam_size=5, language='en')
        return ' '.join(s.text.strip() for s in segments)

    def matches(self, audio, text):
        heard = self.hear(audio)
        return self.words(heard) == self.words(text), heard


def synthesize(pipeline, text, voice, speed):
    audio = np.concatenate([np.asarray(chunk) for _, _, chunk in pipeline(text, voice=voice, speed=speed)])
    # Trim silence at both ends. The tail is cut tight because Kokoro tends to add a soft
    # "uh" after a final consonant ("frog-uh"), which makes the last sound unclear.
    loud = np.flatnonzero(np.abs(audio) > 0.03)
    if loud.size:
        audio = audio[max(loud[0] - 600, 0):loud[-1] + 240]
    pad = np.zeros(int(SAMPLE_RATE * 0.05), dtype=np.float32)
    return np.concatenate([pad, audio, pad])


STRETCH_CARRIERS = ['Can you spell {w}?', 'The word {w} is here.', 'I can see a {w} today.', 'Can you make the word {w}?']
# Counting words (num-3 = "three") are cut from a sentence and only slightly slowed. Commas on
# both sides make the voice pause around the number, so the cut lands in silence; without them
# the clip caught bits of the next word ("twenty-six t…", "three to").
NUMBER_CARRIERS = ['Ready, {w}, go!', 'Okay, {w}, nice.', 'Look, {w}, wow!', 'Listen, {w}, good.']


def stretched_word(pipeline, word, voice, speed, factor, carrier=STRETCH_CARRIERS[0]):
    """A single word said slowly ("caaat"), for Blend Robot.

    Asking Kokoro for slow speech garbles single words ("pig" -> "peggies"), so instead the
    word is cut out of a sentence it says cleanly, using Kokoro's word timestamps, and then
    time-stretched by ffmpeg, which slows the sound down without changing its pitch. Mid-
    sentence carriers avoid the soft "uh" Kokoro adds after a sentence-final consonant.
    """
    chunks, span, offset = [], None, 0.0
    target = re.sub(r'[^a-z]', '', word.lower())  # "twenty-five" -> "twentyfive", matched across tokens
    for result in pipeline(carrier.format(w=word), voice=voice, speed=speed):
        chunk = np.asarray(result.audio)
        tokens = [t for t in result.tokens or [] if re.sub(r'[^a-z]', '', t.text.lower())]
        for i in range(len(tokens)):
            joined = ''
            for j in range(i, min(i + 4, len(tokens))):
                joined += re.sub(r'[^a-z]', '', tokens[j].text.lower())
                if joined == target and tokens[i].start_ts is not None and tokens[j].end_ts is not None:
                    span = (offset + tokens[i].start_ts, offset + tokens[j].end_ts)
                if not target.startswith(joined):
                    break
        chunks.append(chunk)
        offset += len(chunk) / SAMPLE_RATE
    audio = np.concatenate(chunks)
    if span:
        audio = audio[int(max(span[0] - 0.03, 0) * SAMPLE_RATE):int((span[1] + 0.06) * SAMPLE_RATE)]
        # drop quiet edges, then fade the last 15 ms so the cut doesn't click
        loud = np.flatnonzero(np.abs(audio) > 0.02)
        if loud.size:
            audio = audio[max(loud[0] - 240, 0):loud[-1] + 480]
        fade = min(len(audio), int(SAMPLE_RATE * 0.015))
        audio[-fade:] *= np.linspace(1, 0, fade)

    with tempfile.TemporaryDirectory() as tmp:
        src, dst = Path(tmp) / 'in.wav', Path(tmp) / 'out.wav'
        sf.write(src, audio, SAMPLE_RATE)
        subprocess.run(['ffmpeg', '-v', 'quiet', '-y', '-i', str(src), '-af', f'atempo={factor}', str(dst)], check=True)
        stretched = sf.read(dst, dtype='float32')[0]
    pad = np.zeros(int(SAMPLE_RATE * 0.05), dtype=np.float32)
    return np.concatenate([pad, stretched, pad])


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    # bf_isabella scored best in speech-recognition tests: clear "in", clean final consonants,
    # and British short vowels that match the Letters and Sounds order the game follows.
    parser.add_argument('--voice', default='bf_isabella')
    parser.add_argument('--speed', type=float, default=0.85, help='below 1 is slower')
    parser.add_argument('--force', action='store_true', help='regenerate every clip')
    parser.add_argument('--attempts', type=int, default=8, help='tries per clip until speech recognition hears it right')
    parser.add_argument('--no-check', action='store_true', help='skip the speech-recognition check')
    args = parser.parse_args()

    phrases = load_phrases()
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    settings = f'{args.voice}@{args.speed}'
    AUDIO.mkdir(exist_ok=True)

    # Redo clips that are missing, out of date, or failed the check last time.
    def up_to_date(clip_id, text):
        entry = cache.get(clip_id)
        return (isinstance(entry, dict) and entry['made'] == f'{settings}|{text}'
                and (entry['ok'] or args.no_check) and (AUDIO / f'{clip_id}.m4a').exists())

    todo = {clip_id: text for clip_id, text in phrases.items() if args.force or not up_to_date(clip_id, text)}
    print(f'{len(phrases)} phrases, {len(todo)} to generate with {args.voice}')

    if todo:
        pipeline = KPipeline(lang_code=args.voice[0], repo_id='hexgrad/Kokoro-82M')
        checker = None if args.no_check else Checker()
        with tempfile.TemporaryDirectory() as tmp:
            wav = Path(tmp) / 'clip.wav'
            for n, (clip_id, text) in enumerate(todo.items(), 1):
                ok, heard = True, ''
                for attempt in range(1 if checker is None else args.attempts):
                    # Kokoro gives the same output for the same input, so each retry nudges the
                    # speed and end punctuation; the words stay exactly the same.
                    speed = args.speed + (0, -0.04, 0.04, -0.07, 0.07)[attempt % 5]
                    if clip_id.startswith('stretch-'):
                        # Half speed was clearest in tests; slower blurs words (hen -> "hand").
                        factor = (0.5, 0.55, 0.6)[attempt % 3]
                        carrier = STRETCH_CARRIERS[attempt % len(STRETCH_CARRIERS)]
                        audio = stretched_word(pipeline, text, args.voice, speed, factor, carrier)
                    elif clip_id.startswith('num-'):
                        carrier = NUMBER_CARRIERS[attempt % len(NUMBER_CARRIERS)]
                        audio = stretched_word(pipeline, text, args.voice, speed, (0.9, 0.95, 0.85)[attempt % 3], carrier)
                    else:
                        ending = ('', '!', '...', ';')[attempt % 4]
                        if text.endswith('?'):
                            ending = ''  # keep the question's rising tone
                        audio = synthesize(pipeline, text.rstrip('.!') + (ending or text[-1]), args.voice, speed)
                    if checker is None:
                        break
                    ok, heard = checker.matches(audio, text)
                    if clip_id.startswith('stretch-'):
                        # a slowed word may come with an "oh"/"uh"
                        ok = text in checker.words(heard)
                    elif clip_id.startswith('num-'):
                        # exactly the number: any extra word means the cut caught a neighbour
                        ok = checker.words(heard) == checker.words(text)  # a stretched word may come with an "oh"/"uh"
                    if ok:
                        break
                if not ok:
                    print(f'  ! {clip_id}: still heard as {heard!r} after {args.attempts} tries')

                sf.write(wav, audio, SAMPLE_RATE)
                subprocess.run(
                    ['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '64000', str(wav), str(AUDIO / f'{clip_id}.m4a')],
                    check=True,
                )
                cache[clip_id] = {'made': f'{settings}|{text}', 'ok': ok, 'heard': heard}
                if n % 25 == 0 or n == len(todo):
                    print(f'  {n}/{len(todo)}')
                    CACHE.write_text(json.dumps(cache, indent=1))

    # Remove clips for phrases that no longer exist.
    for stale in AUDIO.glob('*.m4a'):
        if stale.stem not in phrases:
            stale.unlink()
            cache.pop(stale.stem, None)

    CACHE.write_text(json.dumps(cache, indent=1))
    ready = sorted(p.stem for p in AUDIO.glob('*.m4a'))
    fingerprint = lambda clip_id: hashlib.sha1(cache.get(clip_id, {}).get('made', clip_id).encode()).hexdigest()[:8]
    (AUDIO / 'manifest.json').write_text(json.dumps({clip_id: fingerprint(clip_id) for clip_id in ready}))
    print(f'manifest: {len(ready)} clips')


if __name__ == '__main__':
    main()
