<template>
  <Transition name="cb-fade">
    <div
      v-if="phase !== 'idle'"
      class="cb-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Ancient box"
      @click.self="close"
    >
      <!-- Ambient gold/red lantern glow -->
      <div class="cb-glow" aria-hidden="true"/>

      <!-- Tulips in gold tones -->
      <div class="cb-tulip cb-tl" aria-hidden="true"><TulipSvg :size="90"  :opacity="0.08" color="#C8A84B" /></div>
      <div class="cb-tulip cb-tr" aria-hidden="true"><TulipSvg :size="70"  :opacity="0.07" color="#C8A84B" /></div>
      <div class="cb-tulip cb-bl" aria-hidden="true"><TulipSvg :size="60"  :opacity="0.06" color="#86A789" /></div>
      <div class="cb-tulip cb-br" aria-hidden="true"><TulipSvg :size="80"  :opacity="0.07" color="#C8A84B" /></div>

      <button class="cb-close" aria-label="Close" @click="close">✕</button>

      <!-- ═══ SCENE ═══ -->
      <div class="cb-scene" :class="`is-${phase}`">

        <!-- LEFT: Letter or Riddle -->
        <div class="text-col">
          <!-- Revealed letter card -->
          <Transition name="cb-letter-reveal">
            <div v-if="phase === 'revealed'" class="cb-letter">
              <p class="cbl-salutation">for the keeper of our soundtrack,</p>
              <p class="cbl-para cbl-p1">
                Of all the melodies that exist in the world, two of them somehow found their way to
                the very center of what we are. I didn't choose them — they chose us. They played
                at the exact right moment, and suddenly they weren't just songs anymore.
                They were ours.
              </p>
              <p class="cbl-para cbl-p2">
                You are the reason music feels different now. Every quiet moment, every car ride,
                every soft morning — there's a melody underneath it all, and it sounds like you.
              </p>
              <p class="cbl-para cbl-p3">
                Thank you for being my favorite song. The one I never get tired of.
              </p>
              <p class="cbl-closing">— always on repeat,</p>

              <!-- Hint for EE#4: The Narrative → "I am still learning" -->
              <p class="cbl-hint">
                ♡ and if your heart leads you back to the letter—<br>
                pause at the words <em>"i am still learning."</em> look around.
              </p>
            </div>
          </Transition>

          <!-- Riddle card -->
          <Transition name="cb-riddle-fade">
            <div v-if="phase === 'box'" class="cb-riddle-card">
              <!-- Top ornament -->
              <div class="cr-ornament" aria-hidden="true">
                <svg viewBox="0 0 60 20" width="60" height="20" fill="none">
                  <path d="M5 10 Q30 0 55 10" stroke="#C8A84B" stroke-width="1" opacity="0.6"/>
                  <circle cx="30" cy="5" r="3" fill="#C8A84B" opacity="0.5"/>
                  <circle cx="10" cy="10" r="2" fill="#C8A84B" opacity="0.35"/>
                  <circle cx="50" cy="10" r="2" fill="#C8A84B" opacity="0.35"/>
                </svg>
              </div>

              <p class="cr-eyebrow">a cipher for those who truly listen</p>
              <div class="cr-divider"/>

              <p class="cr-riddle">
                In the silence between us, two songs have always known our secret.<br/><br/>
                <em>
                  The first: a single word — what the world becomes when you are beside me,
                  when reason dissolves and everything grows soft and luminous.
                </em>
                <br/><br/>
                <em>
                  The second: a question asked without words — the one I've asked you a thousand
                  times with just a look, a reach, a hand in the dark.
                </em>
                <br/><br/>
                <span class="cr-q">What is either one of these songs called?</span>
              </p>

              <div class="cr-input-wrap">
                <input
                  ref="riddleInput"
                  v-model="answer"
                  class="cr-input"
                  type="text"
                  placeholder="name the melody…"
                  :class="{ shake: shaking, correct: answerCorrect }"
                  autocomplete="off"
                  spellcheck="false"
                  @input="onAnswerInput"
                />
                <p class="cr-hint" :class="{ visible: shaking }">that's not quite our song…</p>
              </div>
            </div>
          </Transition>
        </div><!-- /text-col -->

        <!-- RIGHT: The Chinese Box -->
        <div class="box-col">
          <Transition name="cb-eyebrow-fade">
            <p v-if="phase === 'box'" class="cb-eyebrow">封 · sealed for the empress · 封</p>
          </Transition>

          <!-- ═══ CHINA BOX ═══ -->
          <div class="china-box" :class="{ 'box-open': phase === 'opening' || phase === 'revealed' }">

            <!-- Inner glow (when open) -->
            <div class="box-glow-inner" :class="{ show: phase !== 'box' }" aria-hidden="true"/>

            <!-- Inner letter stub (rises from box) -->
            <div class="box-inner-letter" :class="{ rise: phase !== 'box' }">
              <div class="inner-stub-lines"><span/><span/><span/><span/><span/></div>
            </div>

            <!-- LID -->
            <div class="china-lid" :class="{ open: phase === 'opening' || phase === 'revealed' }">
              <!-- Top ridge -->
              <div class="lid-ridge"/>
              <!-- Lid face with ornaments -->
              <div class="lid-face">
                <!-- Outer border frame -->
                <div class="lid-frame">
                  <!-- Corner knots -->
                  <div class="knot k-tl"/><div class="knot k-tr"/>
                  <div class="knot k-bl"/><div class="knot k-br"/>
                  <!-- Center medallion -->
                  <div class="lid-medallion">
                    <div class="med-ring med-r1"/>
                    <div class="med-ring med-r2"/>
                    <div class="med-ring med-r3"/>
                    <span class="med-char" aria-hidden="true">鳳</span>
                  </div>
                  <!-- Side ornamental lines -->
                  <div class="lid-line lid-line-top"/>
                  <div class="lid-line lid-line-bot"/>
                </div>
              </div>
              <!-- Bottom ridge -->
              <div class="lid-ridge lid-ridge-bot"/>
            </div>

            <!-- BOX BODY -->
            <div class="china-body">
              <div class="body-face">
                <div class="body-frame">
                  <div class="knot k-tl"/><div class="knot k-tr"/>
                  <div class="knot k-bl"/><div class="knot k-br"/>
                  <!-- Clasp -->
                  <div class="body-clasp" :class="{ open: phase !== 'box' }">
                    <div class="clasp-ring"/>
                  </div>
                </div>
              </div>
            </div>

          </div><!-- /china-box -->
        </div><!-- /box-col -->

      </div><!-- /cb-scene -->
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import TulipSvg from './TulipSvg.vue'

type Phase = 'idle' | 'box' | 'opening' | 'revealed'
const phase        = ref<Phase>('idle')
const answer       = ref('')
const shaking      = ref(false)
const answerCorrect= ref(false)
const riddleInput  = ref<HTMLInputElement | null>(null)

// Theme songs — either accepted
const THEME_SONGS = [
  'surreal', 'surrealjustin', 'surreal justin',
  'canihavethedance', 'can i have this dance', 'canihavethisdance',
  'can i have a dance',
]

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z]/g, '')
}

/* ── Open ──────────────────────────────────────────────── */
function open() {
  phase.value  = 'box'
  answer.value = ''
  answerCorrect.value = false
  nextTick(() => riddleInput.value?.focus())
}

function close() {
  phase.value  = 'idle'
  answer.value = ''
}

defineExpose({ open })

/* ── Answer check ──────────────────────────────────────── */
function onAnswerInput() {
  const val = normalize(answer.value)
  if (THEME_SONGS.some(s => normalize(s) === val)) {
    answerCorrect.value = true
    setTimeout(openBox, 500)
  }
}

function openBox() {
  phase.value = 'opening'
  setTimeout(() => { phase.value = 'revealed' }, 2200)
}

/* ── Key handler ───────────────────────────────────────── */
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && phase.value !== 'idle') { close(); return }
  if (e.key === 'Enter' && phase.value === 'box' && !answerCorrect.value && answer.value.length > 0) {
    shaking.value = true
    setTimeout(() => { shaking.value = false }, 600)
  }
}
onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════
   OVERLAY  — warm parchment backdrop + red lantern glow
══════════════════════════════════════════════════════════ */
.cb-overlay {
  position: fixed;
  inset: 0;
  background: rgba(245, 240, 232, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  z-index: 10003;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}

/* Centered warm glow behind box */
.cb-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px; height: 400px;
  background: radial-gradient(ellipse, rgba(180,60,40,0.06) 0%, transparent 65%);
  pointer-events: none;
}

.cb-tulip { position: absolute; pointer-events: none; animation: cbFloat 9s ease-in-out infinite; }
.cb-tl { top: -1rem; left: -1rem;   transform: rotate(-14deg); animation-duration: 8s; }
.cb-tr { top: -1rem; right: -1rem;  transform: rotate(11deg);  animation-duration: 10s; animation-delay: 1.2s; }
.cb-bl { bottom: -1rem; left: -1rem;transform: rotate(19deg);  animation-duration: 7.5s; animation-delay:3s; }
.cb-br { bottom: -1rem; right:-1rem;transform: rotate(-7deg);  animation-duration: 11s; animation-delay: 0.8s; }
@keyframes cbFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-13px); }
}

.cb-close {
  position: absolute; top: 1.4rem; right: 1.8rem;
  background: none; border: none; font-size: 1.1rem;
  color: var(--ink-muted); cursor: pointer;
  padding: 0.35rem 0.45rem; border-radius: 4px;
  transition: color 0.2s; z-index: 10;
}
.cb-close:hover { color: var(--ink); }

.cb-fade-enter-active { transition: opacity 0.4s ease; }
.cb-fade-leave-active { transition: opacity 0.3s ease; }
.cb-fade-enter-from, .cb-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════════════════════════
   SCENE
══════════════════════════════════════════════════════════ */
.cb-scene {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3.5rem;
  width: 100%;
  max-width: 820px;
}
.cb-scene.is-opening,
.cb-scene.is-revealed { gap: 1rem; justify-content: center; }

.text-col {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 340px;
  flex-shrink: 0;
  position: relative;
}

.box-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.4rem;
  flex-shrink: 0;
}

.cb-eyebrow {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.68rem;
  letter-spacing: 0.26em;
  color: #b8892a;
  opacity: 0.75;
  margin: 0;
  text-transform: uppercase;
}

.cb-eyebrow-fade-enter-active { transition: opacity 0.3s; }
.cb-eyebrow-fade-leave-active { transition: opacity 0.2s; }
.cb-eyebrow-fade-enter-from, .cb-eyebrow-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════════════════════════
   CHINA BOX ASSEMBLY
══════════════════════════════════════════════════════════ */
.china-box {
  position: relative;
  width: 280px;
  height: 210px;
  animation: boxAppear 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes boxAppear {
  from { opacity: 0; transform: scale(0.78) translateY(16px) rotate(-3deg); }
  to   { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
}

/* Inner glow (amber gold, appears when lid opens) */
.box-glow-inner {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 60%, rgba(200,168,75,0.35) 0%, rgba(180,100,40,0.1) 50%, transparent 70%);
  border-radius: 4px;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.8s ease 0.6s;
  pointer-events: none;
}
.box-glow-inner.show { opacity: 1; }

/* Inner letter stub */
.box-inner-letter {
  position: absolute;
  left: 12%; width: 76%; height: 140px;
  bottom: 8px; z-index: 4;
  background: linear-gradient(180deg, #faf7f0 0%, #f0ead8 100%);
  border: 1px solid rgba(200,168,75,0.3);
  border-radius: 1px;
  transform: translateY(56px);
  transition: transform 1.3s cubic-bezier(0.4, 0, 0.2, 1) 0.9s;
  display: flex; align-items: center; justify-content: center; padding: 0.5rem 0.8rem;
}
.box-inner-letter.rise { transform: translateY(-96px); }
.inner-stub-lines { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.inner-stub-lines span {
  display: block; height: 1px; border-radius: 1px;
  background: linear-gradient(90deg, transparent, rgba(180,140,60,0.4) 25%, rgba(180,140,60,0.4) 75%, transparent);
}

/* ══════════════════════════════════════════════════════════
   LID — ancient lacquered crimson with gold inlay
══════════════════════════════════════════════════════════ */
.china-lid {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 108px;
  transform-origin: top center;
  transform-style: preserve-3d;
  transition: transform 1.1s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 9;
}
.china-lid.open {
  transform: perspective(900px) rotateX(-170deg);
}

.lid-ridge {
  height: 8px;
  background: linear-gradient(180deg, #C8A84B 0%, #a8883b 60%, #8a6e2a 100%);
  border-radius: 2px 2px 0 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.lid-ridge-bot { border-radius: 0 0 2px 2px; }

.lid-face {
  height: 92px;
  background: linear-gradient(145deg, #7A1520 0%, #921C28 35%, #841820 65%, #7A1520 100%);
  /* Lacquer highlight */
  position: relative;
  overflow: hidden;
}
.lid-face::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 40%;
  background: linear-gradient(180deg, rgba(255,220,180,0.09) 0%, transparent 100%);
  pointer-events: none;
}

.lid-frame {
  position: absolute;
  inset: 6px;
  border: 1.5px solid rgba(200,168,75,0.7);
  /* Double border via box-shadow */
  box-shadow:
    inset 0 0 0 1px rgba(200,168,75,0.2),
    0 0 0 1px rgba(200,168,75,0.15);
}

/* Corner knots — gold diamond shapes */
.knot {
  position: absolute;
  width: 9px; height: 9px;
  background: #C8A84B;
  transform: rotate(45deg);
  opacity: 0.85;
}
.k-tl { top: -5px; left: -5px; }
.k-tr { top: -5px; right: -5px; }
.k-bl { bottom: -5px; left: -5px; }
.k-br { bottom: -5px; right: -5px; }

/* Central Phoenix medallion */
.lid-medallion {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  display: flex; align-items: center; justify-content: center;
}
.med-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(200,168,75,0.5);
}
.med-r1 { width: 56px; height: 56px; }
.med-r2 { width: 40px; height: 40px; border-color: rgba(200,168,75,0.7); }
.med-r3 { width: 28px; height: 28px; background: rgba(200,168,75,0.1); border-color: rgba(200,168,75,0.9); }

.med-char {
  font-size: 1.15rem;
  color: #C8A84B;
  font-family: serif;
  line-height: 1;
  text-shadow: 0 0 8px rgba(200,168,75,0.4);
  z-index: 2;
}

/* Horizontal ornamental lines */
.lid-line {
  position: absolute;
  left: 16px; right: 16px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,168,75,0.45) 30%, rgba(200,168,75,0.45) 70%, transparent);
}
.lid-line-top { top: 14px; }
.lid-line-bot { bottom: 14px; }

/* ══════════════════════════════════════════════════════════
   BODY — same lacquer, lower half
══════════════════════════════════════════════════════════ */
.china-body {
  position: absolute;
  bottom: 0; left: 0;
  width: 100%; height: 102px;
  z-index: 3;
}

.body-face {
  height: 100%;
  background: linear-gradient(160deg, #6B1218 0%, #821820 40%, #751420 70%, #6B1218 100%);
  border-top: 2px solid #C8A84B;
  position: relative; overflow: hidden;
}
.body-face::before {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 35%;
  background: linear-gradient(0deg, rgba(0,0,0,0.18) 0%, transparent 100%);
}

.body-frame {
  position: absolute;
  inset: 6px;
  border: 1.5px solid rgba(200,168,75,0.6);
  box-shadow: inset 0 0 0 1px rgba(200,168,75,0.18);
}

/* Clasp */
.body-clasp {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 28px; height: 20px;
  background: linear-gradient(180deg, #D4B050 0%, #A8882C 100%);
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,220,100,0.3);
  transition: opacity 0.5s ease;
}
.body-clasp.open { opacity: 0; }
.clasp-ring {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 10px; height: 10px;
  border-radius: 50%;
  border: 2px solid #8a6e20;
}

/* Box shadow */
.china-box {
  filter: drop-shadow(0 20px 40px rgba(80,10,15,0.22)) drop-shadow(0 6px 14px rgba(0,0,0,0.14));
}

/* ══════════════════════════════════════════════════════════
   REVEALED LETTER (below box)
══════════════════════════════════════════════════════════ */
.cb-letter {
  position: absolute; /* So it overlaps cleanly with riddle during transitions */
  background: rgba(252, 248, 240, 0.98);
  border: 1px solid rgba(200,168,75,0.22);
  border-radius: 8px;
  padding: 2rem 2rem 1.8rem;
  max-width: 340px;
  width: 100%;
  box-shadow: 0 12px 36px rgba(100,30,20,0.08), 0 4px 10px rgba(0,0,0,0.05);
}


.cbl-salutation {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.98rem; font-style: italic;
  color: #a07828; margin: 0 0 1rem;
  letter-spacing: 0.04em;
}
.cbl-para {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(0.85rem, 1.5vw, 0.98rem);
  line-height: 1.88; color: var(--ink);
  margin: 0 0 0.9rem;
  opacity: 0; transform: translateY(6px);
}
.cbl-p1 { animation: cblFade 0.5s ease 0.1s forwards; }
.cbl-p2 { animation: cblFade 0.5s ease 0.35s forwards; }
.cbl-p3 { animation: cblFade 0.5s ease 0.6s forwards; }
.cbl-closing {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.9rem; font-style: italic;
  color: #a07828; margin: 0.4rem 0 0;
  letter-spacing: 0.04em;
  opacity: 0; animation: cblFade 0.5s ease 0.85s forwards;
}
.cbl-hint {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.68rem; font-style: italic;
  color: var(--sage-light);
  margin: 1.6rem 0 0; text-align: left;
  line-height: 1.7; letter-spacing: 0.05em;
  opacity: 0; animation: cblFade 0.6s ease 1.5s forwards;
}
.cbl-hint em { font-style: normal; text-decoration: underline; text-decoration-style: dotted; }

@keyframes cblFade { to { opacity: 1; transform: translateY(0); } }

.cb-letter-reveal-enter-active { transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s; }
.cb-letter-reveal-leave-active { transition: opacity 0.3s ease; }
.cb-letter-reveal-enter-from   { opacity: 0; transform: translateY(16px); }
.cb-letter-reveal-leave-to     { opacity: 0; }

/* ══════════════════════════════════════════════════════════
   RIDDLE CARD (right side)
══════════════════════════════════════════════════════════ */
.cb-riddle-card {
  background: linear-gradient(160deg, rgba(255,252,244,0.98) 0%, rgba(250,244,228,0.98) 100%);
  border: 1px solid rgba(200,168,75,0.25);
  border-radius: 14px;
  padding: 1.8rem 1.8rem 1.6rem;
  max-width: 330px;
  width: 100%;
  box-shadow:
    0 12px 40px rgba(100,30,20,0.08),
    0 4px 12px rgba(200,168,75,0.06),
    inset 0 1px 0 rgba(255,220,100,0.08);
  position: relative;
  animation: crSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes crSlideIn {
  from { opacity: 0; transform: translateX(20px) scale(0.95); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}

.cr-ornament { display: flex; justify-content: center; margin-bottom: 0.8rem; }

.cr-eyebrow {
  font-size: 0.58rem; letter-spacing: 0.22em;
  text-transform: uppercase; color: #b8892a;
  margin: 0 0 0.7rem; text-align: center; opacity: 0.75;
}

.cr-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200,168,75,0.35) 30%, rgba(200,168,75,0.35) 70%, transparent);
  margin-bottom: 1rem;
}

.cr-riddle {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(0.88rem, 1.6vw, 0.98rem);
  line-height: 1.85; color: var(--ink);
  margin: 0 0 1.4rem; text-align: center;
}
.cr-riddle em { color: #8a6e20; font-style: italic; }
.cr-q {
  display: block; margin-top: 0.8rem;
  font-size: 1.02rem; font-weight: 500;
  letter-spacing: 0.02em; color: var(--ink);
}

.cr-input-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; }

.cr-input {
  width: 100%;
  padding: 0.78rem 1.2rem;
  border: 1.5px solid rgba(200,168,75,0.3);
  border-radius: 40px;
  background: rgba(255, 251, 240, 0.92);
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem; color: var(--ink);
  letter-spacing: 0.05em; text-align: center; outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.cr-input::placeholder { color: var(--ink-muted); opacity: 0.5; font-style: italic; }
.cr-input:focus { border-color: #C8A84B; box-shadow: 0 0 0 3px rgba(200,168,75,0.14); }
.cr-input.correct { border-color: #C8A84B; box-shadow: 0 0 0 3px rgba(200,168,75,0.25); color: #8a6e20; }
.cr-input.shake { animation: crShake 0.5s ease; }
@keyframes crShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

.cr-hint {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.74rem; font-style: italic;
  color: #b08888; height: 1rem; margin: 0;
  opacity: 0; transition: opacity 0.25s;
}
.cr-hint.visible { opacity: 1; }

.cb-riddle-fade-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.cb-riddle-fade-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.cb-riddle-fade-enter-from   { opacity: 0; transform: translateX(16px); }
.cb-riddle-fade-leave-to     { opacity: 0; transform: translateX(-16px) scale(0.95); }

/* ══════════════════════════════════════════════════════════
   MOBILE
══════════════════════════════════════════════════════════ */
@media (max-width: 680px) {
  .cb-scene { flex-direction: column-reverse; gap: 2rem; }
  .cb-scene.is-revealed { flex-direction: column; }
  .text-col { width: 100%; position: static; display: block; }
  .cb-letter { position: static; }
  .china-box { width: 240px; height: 180px; }
  .china-lid { height: 90px; }
  .china-body { height: 90px; }
  .cb-riddle-card { max-width: 100%; }
  .cb-letter { max-width: 100%; }
  .cb-tulip { display: none; }
  .cb-tl, .cb-tr { display: block; }
}
</style>
