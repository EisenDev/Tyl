<template>
  <Transition name="ae-fade">
    <div
      v-if="phase !== 'idle'"
      class="ae-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="An apology"
      @click.self="close"
    >
      <!-- Soft warm glow -->
      <div class="ae-bg-glow" aria-hidden="true"/>

      <!-- Tulips -->
      <div class="ae-tulip ae-tl" aria-hidden="true"><TulipSvg :size="85"  :opacity="0.08" color="#e8a0b0" /></div>
      <div class="ae-tulip ae-tr" aria-hidden="true"><TulipSvg :size="70"  :opacity="0.07" color="#86A789" /></div>
      <div class="ae-tulip ae-bl" aria-hidden="true"><TulipSvg :size="60"  :opacity="0.06" color="#d4a0a8" /></div>
      <div class="ae-tulip ae-br" aria-hidden="true"><TulipSvg :size="75"  :opacity="0.07" color="#b8a8d0" /></div>

      <button class="ae-close" aria-label="Close" @click="close">✕</button>

      <!-- ═══ SCENE ═══ -->
      <div class="ae-scene" :class="`is-${phase}`">

        <!-- LEFT: Wilting / blooming tulip visual -->
        <div class="tulip-col">
          <Transition name="ae-eyebrow-fade">
            <p v-if="phase === 'apology'" class="ae-eyebrow">from the bottom of my heart</p>
          </Transition>

          <!-- Tulip vase assembly -->
          <div class="tulip-vase-assy" :class="{ bloomed: phase === 'opening' || phase === 'revealed' }">
            <!-- Stem + drooping / straightening flower -->
            <div class="tulip-stem-wrap">
              <svg
                class="sorry-tulip"
                viewBox="0 0 80 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :class="{ bloom: phase === 'opening' || phase === 'revealed' }"
              >
                <!-- Stem -->
                <path
                  class="stem-path"
                  d="M40 175 C40 155 42 130 38 100 C35 70 28 50 35 20"
                  stroke="#6b8a6d" stroke-width="2.5" stroke-linecap="round"
                />
                <!-- Leaf -->
                <path
                  d="M38 110 C28 100 20 85 26 75 C32 88 36 98 38 110Z"
                  fill="#86A789" opacity="0.65"
                />
                <!-- Wilted/bloomed flower head -->
                <g class="flower-head">
                  <!-- Petals — droop when sad, upright when bloomed -->
                  <path class="petal p1" d="M35 20 C30 5 22 0 23 8 C24 14 32 18 35 20Z" fill="#e8a0b0" opacity="0.85"/>
                  <path class="petal p2" d="M35 20 C25 12 16 14 20 21 C24 26 32 22 35 20Z" fill="#f0b8c4" opacity="0.8"/>
                  <path class="petal p3" d="M35 20 C33 8 38 0 40 8 C41 14 37 18 35 20Z" fill="#e8a0b0" opacity="0.85"/>
                  <path class="petal p4" d="M35 20 C45 12 54 14 50 21 C46 26 38 22 35 20Z" fill="#f0b8c4" opacity="0.8"/>
                  <path class="petal p5" d="M35 20 C40 5 48 0 47 8 C46 14 38 18 35 20Z" fill="#e8a0b0" opacity="0.85"/>
                  <!-- Center -->
                  <circle cx="35" cy="19" r="5" fill="#FAF9F6" opacity="0.9"/>
                  <circle cx="35" cy="19" r="2.5" fill="#e8c06a" opacity="0.7"/>
                </g>
              </svg>
            </div>
            <!-- Small glass vase -->
            <div class="vase">
              <div class="vase-body">
                <div class="vase-highlight"/>
                <div class="vase-water"/>
              </div>
            </div>

            <!-- Inner glow (blooms when correct) -->
            <div class="bloom-glow" :class="{ show: phase !== 'apology' }" aria-hidden="true"/>
          </div>
        </div><!-- /tulip-col -->

        <!-- RIGHT: Letter or Riddle -->
        <div class="text-col">
          <!-- Revealed letter -->
          <Transition name="ae-letter-reveal">
            <div v-if="phase === 'revealed'" class="ae-letter">
              <p class="ael-salutation">My Beloved,</p>
              <p class="ael-para ael-p1">
                You clicked on "I am still learning," and the hardest truth I've had to face in that
                learning process is realizing the pain I've caused the woman I love most in this world.
              </p>
              <!-- I am deeply sorry - slightly bolder -->
              <p class="ael-para ael-p2">
                <strong>I am so deeply sorry.</strong>
              </p>
              <p class="ael-para ael-p3">
                I am sorry for the times my forgetfulness made you feel like an afterthought. I am sorry
                for the moments my irresponsibility left you carrying the heavy weight of us all on your
                own. You deserved a strong, steady anchor, and instead, I let you drift in uncertainty.
                It completely breaks my heart to know that the very person who is supposed to be your
                sanctuary has sometimes been the reason you felt anxious or unseen.
              </p>
              <p class="ael-para ael-p4">
                You have loved me with so much grace. You poured your patience into my empty spaces,
                even when I was careless with your fragile heart. I hate that I am the reason your
                smile has ever faded. I hate that my actions — or lack of them — ever made you doubt
                for even a single second how intensely and completely I am in love with you.
              </p>
              <p class="ael-para ael-p5">
                I never want you to go to sleep again wondering if you are my priority. I never want you
                to feel alone when I am right there next to you. I am so sorry for every tear I've
                caused and every time I let you down.
              </p>
              <p class="ael-para ael-p6">
                I am still learning. But my greatest wake-up call is knowing I hold a masterpiece in my
                hands, and I need to treat you like one. I promise to be better. I promise to unlearn
                the habits that hurt you, and to become the man who fiercely protects your peace.
              </p>
              <p class="ael-para ael-p7">
                Thank you for not giving up on me while I learn how to love you the way you have always
                deserved.
              </p>
              <p class="ael-closing">I love you, unconditionally.</p>

              <!-- Hint for EE#5 -->
              <p class="ael-hint">
                ✦ v. do you notice the one who has always been watching over us?<br>
                she sways with the breeze in the upper corner — reach for her.
              </p>
            </div>
          </Transition>

          <!-- Riddle card (apology phase) -->
          <Transition name="ae-riddle-fade">
            <div v-if="phase === 'apology'" class="ae-riddle-card">

              <!-- Drooping petal accent -->
              <div class="ar-petal-accent" aria-hidden="true">
                <svg viewBox="0 0 50 30" width="50" height="30" fill="none">
                  <path d="M10 5 Q25 0 40 5 Q30 18 25 25 Q20 18 10 5Z" fill="#e8a0b0" opacity="0.3"/>
                  <circle cx="25" cy="24" r="2.5" fill="#e8a0b0" opacity="0.4"/>
                </svg>
              </div>

              <p class="ar-eyebrow">the words that weigh the most</p>
              <div class="ar-divider"/>

              <p class="ar-riddle">
                Every time I have failed you — every careless moment, every forgotten promise,
                every night you went to sleep with a heavy heart because of something I did or
                didn't do — there was something I always came back to.
                <br/><br/>
                <em>
                  Not an excuse. Not a long explanation. Just two words — sometimes said softly,
                  sometimes with tears, always with my whole heart.
                </em>
                <br/><br/>
                <em>
                  The first word acknowledges the hurt.<br/>
                  The second word means it again, because once was never enough.
                </em>
                <br/><br/>
                <span class="ar-q">What do I always say when I've hurt you?</span>
              </p>

              <div class="ar-input-wrap">
                <input
                  ref="riddleInput"
                  v-model="answer"
                  class="ar-input"
                  type="text"
                  placeholder="what I always say…"
                  :class="{ shake: shaking, correct: answerCorrect }"
                  autocomplete="off"
                  spellcheck="false"
                  @input="onAnswerInput"
                />
                <p class="ar-hint" :class="{ visible: shaking }">that's not quite what I say…</p>
              </div>

            </div>
          </Transition>
        </div><!-- /text-col -->

      </div><!-- /ae-scene -->
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import TulipSvg from './TulipSvg.vue'

type Phase = 'idle' | 'apology' | 'opening' | 'revealed'
const phase        = ref<Phase>('idle')
const answer       = ref('')
const shaking      = ref(false)
const answerCorrect= ref(false)
const riddleInput  = ref<HTMLInputElement | null>(null)

// What I say when I make a mistake
const APOLOGY_ANSWERS = [
  'sorry', 'im sorry', 'sorry im sorry', 'sorryimsorry',
  'sorry i am sorry', 'i am sorry', 'i am so sorry',
  'im so sorry', 'imsorry',
]

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z]/g, '')
}

/* ── Open ──────────────────────────────────────────────── */
function open() {
  phase.value  = 'apology'
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
  if (APOLOGY_ANSWERS.some(s => normalize(s) === val)) {
    answerCorrect.value = true
    setTimeout(bloom, 500)
  }
}

function bloom() {
  phase.value = 'opening'
  setTimeout(() => { phase.value = 'revealed' }, 2000)
}

/* ── Key handler ───────────────────────────────────────── */
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && phase.value !== 'idle') { close(); return }
  if (e.key === 'Enter' && phase.value === 'apology' && !answerCorrect.value && answer.value.length > 0) {
    shaking.value = true
    setTimeout(() => { shaking.value = false }, 600)
  }
}
onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════
   OVERLAY — soft warm cream
══════════════════════════════════════════════════════════ */
.ae-overlay {
  position: fixed;
  inset: 0;
  background: rgba(248, 244, 240, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  z-index: 10004;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}

.ae-bg-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 500px; height: 400px;
  background: radial-gradient(ellipse, rgba(232,160,176,0.07) 0%, transparent 65%);
  pointer-events: none;
}

.ae-tulip { position: absolute; pointer-events: none; animation: aeFloat 9s ease-in-out infinite; }
.ae-tl { top: -1rem; left: -1rem;   transform: rotate(-15deg); animation-duration: 8s; }
.ae-tr { top: -1rem; right: -1rem;  transform: rotate(12deg);  animation-duration: 10.5s; animation-delay: 1.3s; }
.ae-bl { bottom: -1rem; left: -1rem;transform: rotate(20deg);  animation-duration: 7.5s; animation-delay: 3.2s; }
.ae-br { bottom: -1rem; right:-1rem;transform: rotate(-8deg);  animation-duration: 11s;  animation-delay: 0.9s; }
@keyframes aeFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-13px); }
}

.ae-close {
  position: absolute; top: 1.4rem; right: 1.8rem;
  background: none; border: none; font-size: 1.1rem;
  color: var(--ink-muted); cursor: pointer;
  padding: 0.35rem 0.45rem; border-radius: 4px;
  transition: color 0.2s; z-index: 10;
}
.ae-close:hover { color: var(--ink); }

.ae-fade-enter-active { transition: opacity 0.4s ease; }
.ae-fade-leave-active { transition: opacity 0.3s ease; }
.ae-fade-enter-from, .ae-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════════════════════════
   SCENE
══════════════════════════════════════════════════════════ */
.ae-scene {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3.5rem;
  width: 100%;
  max-width: 820px;
}
.ae-scene.is-opening,
.ae-scene.is-revealed { gap: 1.5rem; justify-content: center; }

.text-col {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 390px;
  flex-shrink: 0;
  position: relative;
}

.tulip-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.4rem;
  flex-shrink: 0;
}

.ae-eyebrow {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  color: #c0708a;
  opacity: 0.75;
  margin: 0;
  text-transform: uppercase;
}

.ae-eyebrow-fade-enter-active { transition: opacity 0.3s; }
.ae-eyebrow-fade-leave-active { transition: opacity 0.2s; }
.ae-eyebrow-fade-enter-from, .ae-eyebrow-fade-leave-to { opacity: 0; }

/* Tulip vase assembly */
.tulip-vase-assy {
  position: relative;
  width: 120px;
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  animation: vaseAppear 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes vaseAppear {
  from { opacity: 0; transform: scale(0.8) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* SVG tulip */
.sorry-tulip {
  position: absolute;
  bottom: 60px;
  width: 80px;
  height: 180px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08));
}

/* Wilted state — flower head droops */
.sorry-tulip .flower-head {
  transform-origin: 35px 25px;
  transform: rotate(30deg) translateX(10px) translateY(8px);
  transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sorry-tulip.bloom .flower-head {
  transform: rotate(0deg) translateX(0) translateY(0);
}

.sorry-tulip .stem-path {
  transition: d 1.2s ease;
}

/* Petal drooping animation */
.sorry-tulip .petal {
  transform-origin: 35px 20px;
  transition: transform 1.2s ease;
}

/* Glass vase */
.vase {
  width: 70px;
  height: 70px;
  position: relative;
  z-index: 2;
}
.vase-body {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
    rgba(200,220,255,0.15) 0%,
    rgba(180,200,240,0.25) 40%,
    rgba(200,220,255,0.1) 70%,
    rgba(220,235,255,0.2) 100%
  );
  border: 1.5px solid rgba(180,200,240,0.35);
  border-radius: 6px 6px 14px 14px;
  position: relative;
  overflow: hidden;
  box-shadow:
    inset 2px 0 6px rgba(255,255,255,0.25),
    0 8px 24px rgba(0,0,0,0.08);
}
.vase-highlight {
  position: absolute;
  top: 8px; left: 10px;
  width: 12px; height: 40px;
  background: rgba(255,255,255,0.22);
  border-radius: 8px;
  transform: rotate(-8deg);
}
.vase-water {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 40%;
  background: linear-gradient(180deg, rgba(180,210,240,0.15) 0%, rgba(160,195,235,0.3) 100%);
}

/* Bloom glow that appears on success */
.bloom-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(ellipse at 50% 60%, rgba(232,160,176,0.28) 0%, transparent 65%);
  opacity: 0;
  transition: opacity 1s ease 0.4s;
  pointer-events: none;
  border-radius: 50%;
}
.bloom-glow.show { opacity: 1; }

/* ══════════════════════════════════════════════════════════
   REVEALED APOLOGY LETTER
══════════════════════════════════════════════════════════ */
.ae-letter {
  position: absolute;
  background: rgba(255, 252, 249, 0.98);
  border: 1px solid rgba(232,160,176,0.2);
  border-radius: 8px;
  padding: 2rem 2rem 1.8rem;
  max-width: 390px;
  width: 100%;
  max-height: 78vh;
  overflow-y: auto;
  box-shadow: 0 14px 40px rgba(180,80,100,0.07), 0 4px 10px rgba(0,0,0,0.05);
}

.ael-salutation {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem; font-style: italic;
  color: var(--ink-muted); margin: 0 0 1rem;
  letter-spacing: 0.04em;
}
.ael-para {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(0.84rem, 1.4vw, 0.96rem);
  line-height: 1.9; color: var(--ink);
  margin: 0 0 0.9rem;
  opacity: 0; transform: translateY(6px);
}
.ael-p1  { animation: aelFade 0.5s ease 0.1s  forwards; }
.ael-p2  { animation: aelFade 0.5s ease 0.3s  forwards; }
.ael-p3  { animation: aelFade 0.5s ease 0.5s  forwards; }
.ael-p4  { animation: aelFade 0.5s ease 0.7s  forwards; }
.ael-p5  { animation: aelFade 0.5s ease 0.9s  forwards; }
.ael-p6  { animation: aelFade 0.5s ease 1.1s  forwards; }
.ael-p7  { animation: aelFade 0.5s ease 1.3s  forwards; }
.ael-closing {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem; font-style: italic;
  color: #c08090; margin: 0.6rem 0 0;
  letter-spacing: 0.04em;
  opacity: 0; animation: aelFade 0.5s ease 1.5s forwards;
}
/* Hint for EE#5 */
.ael-hint {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.68rem; font-style: italic;
  color: var(--sage-light);
  text-align: right;
  margin: 1.6rem 0 0;
  line-height: 1.7; letter-spacing: 0.05em;
  opacity: 0; animation: aelFade 0.6s ease 2s forwards;
}
@keyframes aelFade { to { opacity: 1; transform: translateY(0); } }

.ae-letter-reveal-enter-active { transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s; }
.ae-letter-reveal-leave-active { transition: opacity 0.25s ease; }
.ae-letter-reveal-enter-from   { opacity: 0; transform: translateY(16px); }
.ae-letter-reveal-leave-to     { opacity: 0; }

/* ══════════════════════════════════════════════════════════
   RIDDLE CARD (right side)
══════════════════════════════════════════════════════════ */
.ae-riddle-card {
  background: rgba(255, 252, 249, 0.98);
  border: 1px solid rgba(232,160,176,0.2);
  border-radius: 16px;
  padding: 1.8rem 1.8rem 1.6rem;
  max-width: 340px;
  width: 100%;
  box-shadow:
    0 12px 40px rgba(180,80,100,0.07),
    0 4px 12px rgba(232,160,176,0.06),
    inset 0 1px 0 rgba(255,255,255,0.7);
  position: relative;
  animation: arSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes arSlideIn {
  from { opacity: 0; transform: translateX(20px) scale(0.95); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}

.ar-petal-accent { display: flex; justify-content: center; margin-bottom: 0.6rem; }

.ar-eyebrow {
  font-size: 0.58rem; letter-spacing: 0.22em;
  text-transform: uppercase; color: #c0708a;
  margin: 0 0 0.7rem; text-align: center; opacity: 0.75;
}

.ar-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(232,160,176,0.35) 30%, rgba(232,160,176,0.35) 70%, transparent);
  margin-bottom: 1rem;
}

.ar-riddle {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(0.88rem, 1.6vw, 0.98rem);
  line-height: 1.85; color: var(--ink);
  margin: 0 0 1.3rem; text-align: center;
}
.ar-riddle em { color: #b06080; font-style: italic; }
.ar-q {
  display: block; margin-top: 0.8rem;
  font-size: 1rem; font-weight: 500;
  letter-spacing: 0.02em; color: var(--ink);
}

.ar-input-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; }

.ar-input {
  width: 100%;
  padding: 0.78rem 1.2rem;
  border: 1.5px solid rgba(232,160,176,0.3);
  border-radius: 40px;
  background: rgba(255, 252, 249, 0.95);
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem; color: var(--ink);
  letter-spacing: 0.05em; text-align: center; outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.ar-input::placeholder { color: var(--ink-muted); opacity: 0.5; font-style: italic; }
.ar-input:focus { border-color: #e8a0b0; box-shadow: 0 0 0 3px rgba(232,160,176,0.14); }
.ar-input.correct { border-color: #e8a0b0; box-shadow: 0 0 0 3px rgba(232,160,176,0.24); color: #b06080; }
.ar-input.shake { animation: arShake 0.5s ease; }
@keyframes arShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

.ar-hint {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.74rem; font-style: italic;
  color: #b08888; height: 1rem; margin: 0;
  opacity: 0; transition: opacity 0.25s;
}
.ar-hint.visible { opacity: 1; }

.ae-riddle-fade-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.ae-riddle-fade-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.ae-riddle-fade-enter-from   { opacity: 0; transform: translateX(16px); }
.ae-riddle-fade-leave-to     { opacity: 0; transform: translateX(-16px) scale(0.95); }


/* Mobile */
@media (max-width: 680px) {
  /* Overlay scrollable on mobile only */
  .ae-overlay { align-items: flex-start; overflow-y: auto; padding: 2rem 1rem 4rem; }
  /* Vase on TOP, riddle/letter on BOTTOM */
  .ae-scene { flex-direction: column; gap: 1.5rem; }
  .ae-scene.is-revealed, .ae-scene.is-opening { flex-direction: column; }
  .text-col { width: 100%; position: static; display: block; }
  .ae-letter { position: static; max-width: 100%; max-height: none; }
  .ae-riddle-card { max-width: 100%; padding: 1.4rem 1rem; }
  /* Compact the tulip vase so it doesn't eat vertical space */
  .tulip-vase-assy { width: 80px; height: 150px; }
  .sorry-tulip { width: 60px; height: 130px; bottom: 45px; }
  .vase { width: 55px; height: 55px; }
  .ae-tulip { display: none; }
  .ae-tl, .ae-tr { display: block; }
}
</style>

