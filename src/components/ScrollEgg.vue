<template>
  <Transition name="scroll-egg-fade">
    <div
      v-if="phase !== 'idle'"
      class="se-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="A secret scroll"
      @click.self="close"
    >
      <!-- Ambient tulips -->
      <div class="se-tulip se-tl" aria-hidden="true"><TulipSvg :size="100" :opacity="0.09" color="#86A789" /></div>
      <div class="se-tulip se-tr" aria-hidden="true"><TulipSvg :size="80"  :opacity="0.08" color="#e8a0b0" /></div>
      <div class="se-tulip se-bl" aria-hidden="true"><TulipSvg :size="65"  :opacity="0.07" color="#b8a8d0" /></div>
      <div class="se-tulip se-br" aria-hidden="true"><TulipSvg :size="75"  :opacity="0.08" color="#d4a0a8" /></div>

      <button class="se-close" aria-label="Close" @click="close">✕</button>

      <!-- ═══ SCENE ═══ -->
      <div class="se-scene" :class="`is-${phase}`">

        <!-- LEFT: SCROLL (always in scene, transforms based on phase) -->
        <div class="scroll-wrap" :class="scrollWrapClass">

          <!-- Ribbon (slides off during unrolling) -->
          <div class="ribbon-wrap" :class="{ 'ribbon-slide': phase === 'unrolling' || phase === 'revealed' }">
            <svg class="ribbon-svg" viewBox="0 0 90 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Ribbon body across scroll -->
              <path d="M10 40 Q45 30 80 40" stroke="#86A789" stroke-width="4" stroke-linecap="round"/>
              <path d="M10 48 Q45 58 80 48" stroke="#86A789" stroke-width="3.5" stroke-linecap="round"/>
              <!-- Bow on center left -->
              <path d="M45 40 C35 28 18 25 15 32 C12 39 28 40 45 44Z" fill="#86A789" opacity="0.7"/>
              <path d="M45 44 C35 56 18 55 15 48 C12 41 28 42 45 40Z" fill="#86A789" opacity="0.7"/>
              <path d="M45 40 C55 28 72 25 75 32 C78 39 62 40 45 44Z" fill="#a8c4aa" opacity="0.7"/>
              <path d="M45 44 C55 56 72 55 75 48 C78 41 62 42 45 40Z" fill="#a8c4aa" opacity="0.7"/>
              <circle cx="45" cy="42" r="5" fill="#86A789" opacity="0.85"/>
            </svg>
          </div>

          <!-- Scroll cylinder -->
          <div class="scroll-cylinder" :class="{ unroll: phase === 'unrolling' || phase === 'revealed' }">
            <!-- End caps -->
            <div class="scroll-cap scroll-cap-top"/>
            <div class="scroll-cap scroll-cap-bot"/>
            <!-- Paper texture -->
            <div class="scroll-paper-lines">
              <span/><span/><span/><span/><span/><span/><span/><span/>
            </div>
          </div>

          <!-- The full letter (revealed after unroll) -->
          <Transition name="letter-unfurl">
            <div v-if="phase === 'revealed'" class="scroll-letter">
              <div class="sl-body">
                <p class="sl-salutation">To my favorite secret,</p>
                <p class="sl-para sl-p1">
                  If you are reading this, it means you know me better than anyone else in the world.
                  You found this hidden space, just like you found the hidden parts of my heart that
                  I didn't even know were there.
                </p>
                <p class="sl-para sl-p2">
                  I know the main letter on this site talks about my flaws and my promises to grow,
                  but I wanted a separate, secret place just to tell you how incredibly perfect you
                  are to me. When I look at you, I don't just see the woman I love; I see my entire
                  future. I see quiet Sunday mornings, loud laughter in the kitchen, and a lifetime
                  of inside jokes that only we understand.
                </p>
                <p class="sl-para sl-p3">
                  You are the most beautiful thing that has ever happened to me. Thank you for your
                  patience, your grace, and your endless love. I am so lucky to be yours, and I will
                  spend the rest of my life making sure you know that.
                </p>
                <p class="sl-para sl-p4">
                  I love you, more than all the hidden words in the world could ever say.
                </p>
                <p class="sl-closing">Forever,</p>

                <!-- Hint for EE#3: music player → Hidden Mystery -->
                <p class="sl-hint">
                  ✦ iii. not every song on the list is what it seems.<br>
                  one of them is not a song at all.
                </p>
              </div>
            </div>
          </Transition>
        </div><!-- /scroll-wrap -->

        <!-- RIGHT: RIDDLE NOTE (shown in 'riddle' phase only) -->
        <Transition name="riddle-fade">
          <div v-if="phase === 'riddle'" class="riddle-card">
            <!-- Decorative wax seal top -->
            <div class="riddle-seal" aria-hidden="true">
              <svg viewBox="0 0 36 36" width="30" height="30">
                <circle cx="18" cy="18" r="16" fill="#86A789" opacity="0.14"/>
                <circle cx="18" cy="18" r="10" fill="#86A789" opacity="0.22"/>
                <circle cx="18" cy="18" r="5"  fill="#86A789" opacity="0.4"/>
              </svg>
            </div>

            <p class="riddle-eyebrow">a riddle, to prove it's you</p>
            <div class="riddle-divider"/>

            <p class="riddle-text">
              There was a day the seasons didn't matter and the clock didn't either.
              It wasn't famous, no one wrote it in books — but for two hearts,
              it was the beginning of everything.
              <br/><br/>
              <em>The day "you and I" stopped being strangers<br/>
              and became something more beautiful.</em>
              <br/><br/>
              You know it by heart, beloved.<br/>
              <span class="riddle-q">When did we begin?</span>
            </p>

            <div class="riddle-input-wrap">
              <input
                ref="riddleInput"
                v-model="riddleAnswer"
                class="riddle-input"
                type="text"
                placeholder="our beginning…"
                :class="{ shake: shaking, correct: answerCorrect }"
                autocomplete="off"
                spellcheck="false"
                @input="onRiddleInput"
              />
              <p class="riddle-hint" :class="{ visible: shaking }">that's not quite it…</p>
            </div>
          </div>
        </Transition>

      </div><!-- /se-scene -->
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import TulipSvg from './TulipSvg.vue'

type Phase = 'idle' | 'riddle' | 'unrolling' | 'revealed'
const phase         = ref<Phase>('idle')
const riddleAnswer  = ref('')
const shaking       = ref(false)
const answerCorrect = ref(false)
const riddleInput   = ref<HTMLInputElement | null>(null)

// Dating anniversary — November 18, 2024
const DATING_START_ANSWERS = [
  'november 18', 'november 18 2024', 'november 18, 2024',
  'nov 18', 'nov 18 2024', 'nov 18, 2024',
  '11/18/2024', '11-18-2024', '11182024', '111824',
  '2024-11-18', 'november182024', 'nov182024',
]

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/* ── Open ────────────────────────────────────────────────── */
function open() {
  phase.value       = 'riddle'
  riddleAnswer.value = ''
  answerCorrect.value = false
  nextTick(() => riddleInput.value?.focus())
}

function close() {
  phase.value = 'idle'
  riddleAnswer.value = ''
}

defineExpose({ open })

/* ── Riddle check ────────────────────────────────────────── */
function onRiddleInput() {
  const val = normalize(riddleAnswer.value)
  const match = DATING_START_ANSWERS.some(a => normalize(a) === val)
  if (match) {
    answerCorrect.value = true
    setTimeout(beginUnroll, 500)
  }
}

function beginUnroll() {
  phase.value = 'unrolling'
  setTimeout(() => { phase.value = 'revealed' }, 1800)
}

/* ── Computed classes ────────────────────────────────────── */
const scrollWrapClass = computed(() => ({
  'center': phase.value === 'riddle',
  'expand': phase.value === 'unrolling' || phase.value === 'revealed',
}))

/* ── Keyboard ────────────────────────────────────────────── */
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && phase.value !== 'idle') { close(); return }
  if (e.key === 'Enter'
      && phase.value === 'riddle'
      && !answerCorrect.value
      && riddleAnswer.value.length > 0) {
    shaking.value = true
    setTimeout(() => { shaking.value = false }, 600)
  }
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════
   OVERLAY
══════════════════════════════════════════════════════════ */
.se-overlay {
  position: fixed;
  inset: 0;
  background: rgba(247, 245, 240, 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  z-index: 10002;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 3rem 1.5rem;
  overflow-y: auto;
}

.se-tulip { position: absolute; pointer-events: none; animation: seTulipFloat 9s ease-in-out infinite; }
.se-tl { top: -1rem;    left: -1rem;  transform: rotate(-15deg); animation-duration: 8s; }
.se-tr { top: -1rem;    right: -1rem; transform: rotate(12deg);  animation-duration: 10.5s; animation-delay: 1.5s; }
.se-bl { bottom: -1rem; left: -1rem;  transform: rotate(18deg);  animation-duration: 7.5s; animation-delay: 3s; }
.se-br { bottom: -1rem; right: -1rem; transform: rotate(-9deg);  animation-duration: 11s;  animation-delay: 0.8s; }
@keyframes seTulipFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-14px); }
}

.se-close {
  position: absolute; top: 1.4rem; right: 1.8rem;
  background: none; border: none; font-size: 1.1rem;
  color: var(--ink-muted); cursor: pointer;
  padding: 0.35rem 0.45rem; border-radius: 4px;
  transition: color 0.2s; z-index: 10;
}
.se-close:hover { color: var(--ink); }

.scroll-egg-fade-enter-active { transition: opacity 0.4s ease; }
.scroll-egg-fade-leave-active { transition: opacity 0.3s ease; }
.scroll-egg-fade-enter-from, .scroll-egg-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════════════════════════
   SCENE — row: scroll LEFT, riddle card RIGHT
══════════════════════════════════════════════════════════ */
.se-scene {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3.5rem;
  width: 100%;
  max-width: 820px;
}
.se-scene.is-unrolling,
.se-scene.is-revealed {
  gap: 0;
  justify-content: center;
}

/* ══════════════════════════════════════════════════════════
   SCROLL WRAP
══════════════════════════════════════════════════════════ */
.scroll-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
  transition: all 0.6s ease;
}

/* Ribbon slides off to the right */
.ribbon-wrap {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 120px;
  transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.7s ease;
}
.ribbon-wrap.ribbon-slide {
  transform: translateX(200%);
  opacity: 0;
}
.ribbon-svg { width: 100%; height: auto; }

/* ══════════════════════════════════════════════════════════
   SCROLL CYLINDER (rolled paper)
══════════════════════════════════════════════════════════ */
.scroll-cylinder {
  position: relative;
  width: 130px;
  height: 210px;
  /* Gradient simulates the rounded 3D cylinder: dark edges, light center */
  background: linear-gradient(90deg,
    #b5ae9f 0%,
    #e8e2d6 12%,
    #f5f0e8 35%,
    #faf7f2 50%,
    #f5f0e8 65%,
    #e4ddd0 88%,
    #b5ae9f 100%
  );
  border-radius: 65px / 14px;
  box-shadow:
    -10px 0 20px rgba(0,0,0,0.12),
    10px 0 20px rgba(0,0,0,0.12),
    0 8px 24px rgba(0,0,0,0.09);
  transition: border-radius 1.4s cubic-bezier(0.4, 0, 0.2, 1),
              width 1.4s cubic-bezier(0.4, 0, 0.2, 1),
              height 1.4s cubic-bezier(0.4, 0, 0.2, 1),
              background 1.4s ease,
              box-shadow 1.4s ease;
  overflow: hidden;
  animation: cylinderAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes cylinderAppear {
  from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
  to   { opacity: 1; transform: scale(1) rotate(0deg); }
}

/* Unrolled state → flat paper */
.scroll-cylinder.unroll {
  width: 380px;
  height: 480px;
  border-radius: 6px;
  background: linear-gradient(160deg, #faf9f6 0%, #f2efe8 100%);
  box-shadow: 0 16px 48px rgba(0,0,0,0.09), 0 4px 12px rgba(0,0,0,0.05);
}

/* End caps (circles at top and bottom of scroll) */
.scroll-cap {
  position: absolute;
  left: 0; right: 0;
  height: 24px;
  background: linear-gradient(90deg,
    #a8a196 0%,
    #d8d2c5 15%,
    #e8e2d5 50%,
    #d8d2c5 85%,
    #a8a196 100%
  );
  border-radius: 50%;
  transition: opacity 1s ease;
}
.scroll-cap-top { top: -3px; }
.scroll-cap-bot { bottom: -3px; }
.scroll-cylinder.unroll .scroll-cap { opacity: 0; }

/* Decorative horizontal lines on scroll */
.scroll-paper-lines {
  position: absolute;
  inset: 20px 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  transition: opacity 0.5s ease;
}
.scroll-cylinder.unroll .scroll-paper-lines { opacity: 0; }
.scroll-paper-lines span {
  display: block;
  height: 1px;
  border-radius: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(180,172,158,0.5) 25%,
    rgba(180,172,158,0.5) 75%,
    transparent
  );
}

/* ══════════════════════════════════════════════════════════
   SCROLL LETTER (inside unrolled cylinder)
══════════════════════════════════════════════════════════ */
.scroll-letter {
  position: absolute;
  inset: 0;
  padding: 2rem 1.8rem 1.6rem;
  overflow-y: auto;
}



.sl-salutation {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem; font-style: italic;
  color: var(--ink-muted); margin: 0 0 0.9rem;
  letter-spacing: 0.04em;
}

.sl-para {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(0.82rem, 1.4vw, 0.95rem);
  line-height: 1.88; color: var(--ink);
  margin: 0 0 0.9rem;
  opacity: 0; transform: translateY(6px);
}

.sl-p1 { animation: slFade 0.5s ease 0.1s forwards; }
.sl-p2 { animation: slFade 0.5s ease 0.35s forwards; }
.sl-p3 { animation: slFade 0.5s ease 0.6s forwards; }
.sl-p4 { animation: slFade 0.5s ease 0.85s forwards; }

.sl-closing {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.92rem; font-style: italic;
  color: var(--sage); margin: 0.4rem 0 0;
  letter-spacing: 0.04em;
  opacity: 0; animation: slFade 0.5s ease 1.1s forwards;
}

.sl-hint {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.68rem; font-style: italic;
  color: var(--sage-light);
  text-align: right;
  margin: 1.6rem 0 0;
  line-height: 1.7; letter-spacing: 0.05em;
  opacity: 0; animation: slFade 0.6s ease 1.8s forwards;
}
.sl-hint em { font-style: normal; text-decoration: underline; text-decoration-style: dotted; }

@keyframes slFade { to { opacity: 1; transform: translateY(0); } }

.letter-unfurl-enter-active { transition: opacity 0.4s ease 0.2s; }
.letter-unfurl-leave-active { transition: opacity 0.2s ease; }
.letter-unfurl-enter-from, .letter-unfurl-leave-to { opacity: 0; }

/* ══════════════════════════════════════════════════════════
   RIDDLE CARD (right side)
══════════════════════════════════════════════════════════ */
.riddle-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--parchment);
  border-radius: 16px;
  padding: 2rem 2rem 1.8rem;
  max-width: 340px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(134,167,137,0.07);
  position: relative;
  overflow: hidden;
  animation: riddleSlideIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes riddleSlideIn {
  from { opacity: 0; transform: translateX(20px) scale(0.96); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}

.riddle-seal { display: flex; justify-content: center; margin-bottom: 0.9rem; }

.riddle-eyebrow {
  font-size: 0.6rem; letter-spacing: 0.24em;
  text-transform: uppercase; color: var(--sage);
  margin: 0 0 0.7rem; text-align: center; font-weight: 400;
}

.riddle-divider { height: 1px; background: var(--parchment); margin-bottom: 1rem; }

.riddle-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  line-height: 1.85; color: var(--ink);
  margin: 0 0 1.4rem; text-align: center;
}
.riddle-text em { color: var(--sage-dark); }
.riddle-q {
  display: block; margin-top: 0.8rem;
  font-size: 1.05rem; color: var(--ink);
  font-weight: 500; letter-spacing: 0.02em;
}

.riddle-input-wrap {
  display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
}

.riddle-input {
  width: 100%;
  padding: 0.75rem 1.2rem;
  border: 1px solid var(--parchment);
  border-radius: 40px;
  background: rgba(252, 250, 247, 0.9);
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem; color: var(--ink);
  letter-spacing: 0.05em; text-align: center;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.riddle-input::placeholder { color: var(--ink-muted); opacity: 0.5; font-style: italic; }
.riddle-input:focus { border-color: var(--sage-light); box-shadow: 0 0 0 3px rgba(134,167,137,0.13); }
.riddle-input.correct { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(134,167,137,0.22); color: var(--sage-dark); }
.riddle-input.shake { animation: shakeRiddle 0.5s ease; }
@keyframes shakeRiddle {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

.riddle-hint {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.75rem; font-style: italic;
  color: #b08888; height: 1rem; margin: 0;
  opacity: 0; transition: opacity 0.25s;
}
.riddle-hint.visible { opacity: 1; }

.riddle-fade-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.riddle-fade-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.riddle-fade-enter-from   { opacity: 0; transform: translateX(16px); }
.riddle-fade-leave-to     { opacity: 0; transform: translateX(-16px) scale(0.95); }

/* Mobile */
@media (max-width: 680px) {
  .se-scene { flex-direction: column; gap: 1.5rem; }
  .se-scene.is-riddle { flex-direction: column; }
  .se-scene.is-unrolling, .se-scene.is-revealed { flex-direction: column-reverse; }
  .scroll-cylinder { width: 80px; height: 140px; }
  .scroll-cylinder.unroll { width: 240px; height: 340px; }
  .riddle-card { max-width: 100%; padding: 1.4rem 1rem; }
  .riddle-text { font-size: 0.9rem; }
  .scroll-letter { max-height: none; }
  .sl-body { padding: 1.4rem 1.2rem; }
  .se-tulip { display: none; }
  .se-tl, .se-tr { display: block; }
}
</style>
