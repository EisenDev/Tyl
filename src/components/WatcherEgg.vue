<template>
  <Transition name="we-fade">
    <div
      v-if="phase !== 'idle'"
      class="we-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="The Watcher"
      @click.self="close"
    >
      <!-- Soft green glow -->
      <div class="we-bg-glow" aria-hidden="true"/>

      <!-- Floating hearts & tulips in the background -->
      <div class="we-floaters" aria-hidden="true">
        <div class="we-floater f1"><TulipSvg :size="60" color="#86A789" :opacity="0.15" /></div>
        <div class="we-floater f2"><TulipSvg :size="45" color="#86A789" :opacity="0.1" /></div>
        <div class="we-floater f3"><TulipSvg :size="80" color="#86A789" :opacity="0.12" /></div>
        <div class="we-floater f4">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="#86A789" opacity="0.15">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div class="we-floater f5">
          <svg viewBox="0 0 24 24" width="60" height="60" fill="#86A789" opacity="0.1">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </div>

      <button class="we-close" aria-label="Close" @click="close">✕</button>

      <!-- ═══ SCENE ═══ -->
      <div class="we-scene" :class="`is-${phase}`">

        <!-- LEFT: Letter or Riddle -->
        <div class="text-col">
          <!-- Revealed letter -->
          <Transition name="we-letter-reveal">
            <div v-if="phase === 'revealed'" class="we-letter">
              <p class="wel-salutation">You found our watcher.</p>
              
              <p class="wel-para wel-p1">
                This green tulip and heart has been with us through everything, hasn't it? It has lived in our messages and quietly watched over our story. It has been the silent witness to our late night talks, our endless laughter, the moments I stumbled, and the moments we held onto each other tighter than ever. It has seen every version of us, acting as our eyes when we couldn't be in the same room.
              </p>
              <p class="wel-para wel-p2">
                The watcher has seen how much I love you, and it has seen how much I've grown because of you. It knows every secret I've hidden in this space—my deep devotion, my truest apologies, and my unwavering promises to you.
              </p>
              <p class="wel-para wel-p3">
                You have uncovered almost all the pieces of my heart that I hid here for you. But our watcher knows there is one final chapter left to open.
              </p>
              <p class="wel-para wel-p4">
                Take everything you've found—every answer, every key, every piece of this journey we've built because the final door is waiting. And what is waiting behind it is the most important thing I will ever ask you.
              </p>
              <p class="wel-para wel-p5">
                I love you. Now, let's finish this.
              </p>
              <p class="wel-closing">Forever yours,</p>

              <!-- Hint for EE#6 -->
              <p class="wel-hint">
                ✦ vi. tap 3 times to my beloved<br>
                where this all began.
              </p>
            </div>
          </Transition>

          <!-- Riddle card (watcher phase) -->
          <Transition name="we-riddle-fade">
            <div v-if="phase === 'watcher'" class="we-riddle-card">

              <!-- Top ornament -->
              <div class="wr-ornament" aria-hidden="true">
                <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
                  <!-- Heart -->
                  <path d="M20 32.5l-2.45-2.22C11.4 24.62 8 20.88 8 16.5 8 12.82 10.82 10 14.5 10c2.09 0 4.09.97 5.5 2.5 1.41-1.53 3.41-2.5 5.5-2.5 3.68 0 6.5 2.82 6.5 6.5 0 4.38-3.4 8.12-9.55 13.78L20 32.5z" fill="#a8c4aa" opacity="0.3"/>
                </svg>
              </div>

              <p class="wr-eyebrow">The Silent Witness</p>
              <div class="wr-divider"/>

              <p class="wr-riddle">
                I am not a word, yet I speak of our love every day.<br/><br/>
                <em>
                  I stand silent in the corner of your screen, swaying with the breeze.
                  I have lived in our messages, a quiet guardian of our late-night talks
                  and endless laughter.
                </em>
                <br/><br/>
                <em>
                  I wear the color of life, and I am paired with the symbol of devotion.
                </em>
                <br/><br/>
                <span class="wr-q">What am I?</span>
              </p>

              <div class="wr-input-wrap">
                <input
                  ref="riddleInput"
                  v-model="answer"
                  class="wr-input"
                  type="text"
                  placeholder="name the watcher…"
                  :class="{ shake: shaking, correct: answerCorrect }"
                  autocomplete="off"
                  spellcheck="false"
                  @input="onAnswerInput"
                />
                <p class="wr-hint" :class="{ visible: shaking }">the watcher remains hidden…</p>
              </div>

            </div>
          </Transition>
        </div><!-- /text-col -->

        <!-- RIGHT: Large visual representation -->
        <div class="icon-col">
          <Transition name="we-eyebrow-fade">
            <p v-if="phase === 'watcher'" class="we-eyebrow">an observer of our story</p>
          </Transition>

          <div class="giant-icon-wrap" :class="{ revealed: phase === 'opening' || phase === 'revealed' }">
            <div class="giant-glow" :class="{ show: phase !== 'watcher' }"/>
            <!-- A beautiful composition of a green tulip and a green heart -->
            <div class="giant-icon">
              <!-- Heart -->
              <svg class="gi-heart" viewBox="0 0 24 24" fill="#a8c4aa">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <!-- Tulip overlapping slightly -->
              <div class="gi-tulip">
                <TulipSvg :size="80" color="#86A789" :opacity="0.9" />
              </div>
            </div>
          </div>
        </div><!-- /icon-col -->

      </div><!-- /we-scene -->
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import TulipSvg from './TulipSvg.vue'

type Phase = 'idle' | 'watcher' | 'opening' | 'revealed'
const phase        = ref<Phase>('idle')
const answer       = ref('')
const shaking      = ref(false)
const answerCorrect= ref(false)
const riddleInput  = ref<HTMLInputElement | null>(null)

// The answer is "green tulip and heart" or its permutations
const ANSWERS = [
  'green tulip and heart',
  'greentulipandheart',
  'green tulip & heart',
  'a green tulip and heart',
  'green heart and tulip',
  'green heart & tulip',
  'green heart and green tulip',
  'green tulip and green heart'
]

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z]/g, '')
}

function open() {
  phase.value  = 'watcher'
  answer.value = ''
  answerCorrect.value = false
  nextTick(() => riddleInput.value?.focus())
}

function close() {
  phase.value  = 'idle'
  answer.value = ''
}

defineExpose({ open })

function onAnswerInput() {
  const val = normalize(answer.value)
  if (ANSWERS.some(s => normalize(s) === val)) {
    answerCorrect.value = true
    setTimeout(reveal, 500)
  }
}

function reveal() {
  phase.value = 'opening'
  setTimeout(() => { phase.value = 'revealed' }, 1800)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && phase.value !== 'idle') { close(); return }
  if (e.key === 'Enter' && phase.value === 'watcher' && !answerCorrect.value && answer.value.length > 0) {
    shaking.value = true
    setTimeout(() => { shaking.value = false }, 600)
  }
}
onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
/* OVERLAY (Soft green/cream) */
.we-overlay {
  position: fixed; inset: 0;
  background: rgba(245, 248, 245, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  z-index: 10005;
  display: flex; align-items: flex-start; justify-content: center;
  padding: 3rem 1.5rem; overflow-y: auto;
}

.we-bg-glow {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 600px; height: 500px;
  background: radial-gradient(ellipse, rgba(134,167,137,0.08) 0%, transparent 65%);
  pointer-events: none;
}

/* Floating decor */
.we-floaters { position: absolute; inset: 0; pointer-events: none; }
.we-floater { position: absolute; animation: floatAnim 10s ease-in-out infinite; }
.f1 { top: 10%; left: 15%; animation-duration: 9s; }
.f2 { top: 20%; right: 10%; animation-duration: 12s; animation-delay: 1s; }
.f3 { bottom: 15%; left: 10%; animation-duration: 11s; animation-delay: 2s; }
.f4 { bottom: 20%; right: 20%; animation-duration: 8s; animation-delay: 0.5s; }
.f5 { top: 40%; left: 5%; animation-duration: 14s; animation-delay: 3s; }
@keyframes floatAnim {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.we-close {
  position: absolute; top: 1.4rem; right: 1.8rem;
  background: none; border: none; font-size: 1.1rem;
  color: var(--sage); cursor: pointer;
  padding: 0.35rem 0.45rem; border-radius: 4px;
  transition: color 0.2s; z-index: 10;
}
.we-close:hover { color: var(--sage-dark); }

.we-fade-enter-active { transition: opacity 0.4s ease; }
.we-fade-leave-active { transition: opacity 0.3s ease; }
.we-fade-enter-from, .we-fade-leave-to { opacity: 0; }

/* SCENE */
.we-scene {
  display: flex; align-items: center; justify-content: center;
  gap: 3.5rem; width: 100%; max-width: 820px;
}
.we-scene.is-opening, .we-scene.is-revealed { gap: 2rem; }

/* LEFT: TEXT COL */
.text-col {
  display: flex; align-items: center; justify-content: center;
  width: 400px; flex-shrink: 0; position: relative;
}

/* RIGHT: ICON COL */
.icon-col {
  display: flex; flex-direction: column; align-items: center; gap: 1.5rem; flex-shrink: 0;
}
.we-eyebrow {
  font-family: 'Cormorant Garamond', serif; font-size: 0.7rem;
  letter-spacing: 0.22em; color: var(--sage); opacity: 0.75;
  margin: 0; text-transform: uppercase;
}
.we-eyebrow-fade-enter-active { transition: opacity 0.3s; }
.we-eyebrow-fade-leave-active { transition: opacity 0.2s; }
.we-eyebrow-fade-enter-from, .we-eyebrow-fade-leave-to { opacity: 0; }

.giant-icon-wrap {
  position: relative; width: 140px; height: 140px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%; border: 1.5px solid rgba(134,167,137,0.2);
  background: rgba(255,255,255,0.4);
  box-shadow: 0 8px 30px rgba(134,167,137,0.1);
  transition: transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 1.5s;
}
.giant-icon-wrap.revealed {
  transform: scale(1.1);
  box-shadow: 0 12px 40px rgba(134,167,137,0.25); border-color: rgba(134,167,137,0.5);
}
.giant-glow {
  position: absolute; inset: -30px; border-radius: 50%;
  background: radial-gradient(circle, rgba(134,167,137,0.2) 0%, transparent 70%);
  opacity: 0; transition: opacity 1.5s ease;
}
.giant-glow.show { opacity: 1; }
.giant-icon { position: relative; width: 80px; height: 80px; }
.gi-heart { position: absolute; top: 10px; left: -10px; width: 70px; height: 70px; opacity: 0.8; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); }
.gi-tulip { position: absolute; bottom: -5px; right: -5px; transform: rotate(15deg); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.06)); }

/* REVEALED LETTER */
.we-letter {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(134,167,137,0.25);
  border-radius: 8px;
  padding: 2.2rem;
  width: 100%;
  max-height: 85vh; overflow-y: auto;
  box-shadow: 0 14px 40px rgba(134,167,137,0.1), 0 4px 10px rgba(0,0,0,0.03);
}
.wel-salutation {
  font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-style: italic; color: var(--sage-dark);
  margin: 0 0 1rem; letter-spacing: 0.04em;
}
.wel-para {
  font-family: 'Cormorant Garamond', serif; font-size: clamp(0.9rem, 1.4vw, 1rem);
  line-height: 1.9; color: var(--ink); margin: 0 0 0.9rem;
  opacity: 0; transform: translateY(6px);
}
.wel-p1 { animation: welFade 0.5s ease 0.1s forwards; }
.wel-p2 { animation: welFade 0.5s ease 0.3s forwards; }
.wel-p3 { animation: welFade 0.5s ease 0.5s forwards; }
.wel-p4 { animation: welFade 0.5s ease 0.7s forwards; }
.wel-p5 { animation: welFade 0.5s ease 0.9s forwards; font-weight: 500; font-style: italic; color: var(--sage-dark); }
.wel-closing {
  font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-style: italic;
  color: var(--sage); margin: 1rem 0 0; letter-spacing: 0.04em;
  opacity: 0; animation: welFade 0.5s ease 1.1s forwards;
}
.wel-hint {
  font-family: 'Cormorant Garamond', serif; font-size: 0.74rem; font-style: italic;
  color: #a8a8a8; text-align: right; margin: 1.8rem 0 0;
  line-height: 1.7; letter-spacing: 0.05em;
  opacity: 0; animation: welFade 0.6s ease 1.5s forwards;
}
@keyframes welFade { to { opacity: 1; transform: translateY(0); } }

.we-letter-reveal-enter-active { transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s; }
.we-letter-reveal-leave-active { transition: opacity 0.25s ease; }
.we-letter-reveal-enter-from   { opacity: 0; transform: translateY(16px); }
.we-letter-reveal-leave-to     { opacity: 0; }

/* RIDDLE CARD */
.we-riddle-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(134,167,137,0.25); border-radius: 16px;
  padding: 2rem; width: 100%;
  box-shadow: 0 12px 40px rgba(134,167,137,0.08), 0 4px 12px rgba(134,167,137,0.04);
  position: relative; animation: wrSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes wrSlideIn {
  from { opacity: 0; transform: translateX(-20px) scale(0.95); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}
.wr-ornament { display: flex; justify-content: center; margin-bottom: 0.8rem; }
.wr-eyebrow {
  font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--sage);
  margin: 0 0 0.8rem; text-align: center; opacity: 0.75;
}
.wr-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(134,167,137,0.3) 30%, rgba(134,167,137,0.3) 70%, transparent); margin-bottom: 1.2rem; }
.wr-riddle {
  font-family: 'Cormorant Garamond', serif; font-size: clamp(0.9rem, 1.6vw, 1.05rem);
  line-height: 1.85; color: var(--ink); margin: 0 0 1.4rem; text-align: center;
}
.wr-riddle em { color: var(--sage-dark); font-style: italic; }
.wr-q { display: block; margin-top: 1rem; font-size: 1.05rem; font-weight: 500; letter-spacing: 0.02em; color: var(--ink); }

.wr-input-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; }
.wr-input {
  width: 100%; padding: 0.85rem 1.2rem;
  border: 1.5px solid rgba(134,167,137,0.3); border-radius: 40px;
  background: rgba(250, 252, 250, 0.95);
  font-family: 'Cormorant Garamond', serif; font-size: 1rem; color: var(--ink);
  letter-spacing: 0.05em; text-align: center; outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.wr-input::placeholder { color: var(--ink-muted); opacity: 0.5; font-style: italic; }
.wr-input:focus { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(134,167,137,0.15); }
.wr-input.correct { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(134,167,137,0.25); color: var(--sage-dark); }
.wr-input.shake { animation: wrShake 0.5s ease; }
@keyframes wrShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
.wr-hint {
  font-family: 'Cormorant Garamond', serif; font-size: 0.78rem; font-style: italic;
  color: #b08888; height: 1rem; margin: 0; opacity: 0; transition: opacity 0.25s;
}
.wr-hint.visible { opacity: 1; }

.we-riddle-fade-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.we-riddle-fade-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.we-riddle-fade-enter-from   { opacity: 0; transform: translateX(-16px); }
.we-riddle-fade-leave-to     { opacity: 0; transform: translateX(16px) scale(0.95); }

@media (max-width: 680px) {
  .we-scene { flex-direction: column; gap: 1.5rem; }
  .we-scene.is-revealed { flex-direction: column; }
  .text-col { width: 100%; position: static; display: block; }
  .we-letter { position: static; max-height: none; }
  .we-riddle-card { max-width: 100%; padding: 1.4rem 1rem; }
  .wr-riddle { font-size: 0.9rem; }
  /* Shrink the icon so it doesn't take up all vertical space */
  .giant-icon-wrap { width: 100px; height: 100px; }
  .giant-icon { width: 60px; height: 60px; }
  .gi-heart { width: 54px; height: 54px; }
  .we-floater { display: none; }
  .f1, .f2 { display: block; }
}
</style>
