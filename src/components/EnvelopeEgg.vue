<template>
  <!-- Egg Overlay -->
  <Transition name="egg-fade">
    <div
      v-if="phase !== 'idle'"
      class="egg-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="A secret letter"
      @click.self="close"
    >
      <!-- Close -->
      <button class="egg-close" aria-label="Close" @click="close">✕</button>

      <!-- Main scene — shifts to flex-row when revealed -->
      <div class="egg-scene" :class="`is-${phase}`">

        <!-- ═══ LEFT: Full letter panel (appears only when revealed) ═══ -->
        <Transition name="letter-reveal">
          <div v-if="phase === 'revealed'" class="letter-panel">
            <div class="letter-paper" :class="{ animate: phase === 'revealed' }">
              <div class="letter-wax" aria-hidden="true">
                <svg viewBox="0 0 40 40" width="36" height="36">
                  <circle cx="20" cy="20" r="18" fill="#86A789" opacity="0.15"/>
                  <circle cx="20" cy="20" r="12" fill="#86A789" opacity="0.22"/>
                  <circle cx="20" cy="20" r="6"  fill="#86A789" opacity="0.4"/>
                </svg>
              </div>

              <div class="letter-body">
                <p class="lp-salutation">My Beloved,</p>

                <p class="lp-para lp-p1">
                  If you are reading this, it means you hold the key to this little sanctuary
                  I built just for us. I wanted to create a quiet space, away from the noise
                  of the world, where I could simply tell you how much I love you.
                </p>
                <p class="lp-para lp-p2">
                  Words often fall short when I try to explain what you mean to me, but I have
                  to try. From the moment you walked into my life, everything shifted. The colors
                  became brighter, the days felt warmer, and my heart finally felt like it was
                  exactly where it was supposed to be. You are my calm in the chaos and without
                  a doubt, the very best part of my every day.
                </p>
                <p class="lp-para lp-p3">
                  I am constantly in awe of you. I love the beauty of your mind, the kindness
                  in your heart, and the way your smile has the power to instantly make everything
                  right in my world. You inspire me to be a better person just by being exactly
                  who you are.
                </p>
                <p class="lp-para lp-p4">
                  This letter, and this space, is just a small reflection of my endless love for
                  you. No matter where life takes us, I promise to keep choosing you, to keep
                  cherishing you, and to stand by your side through all of our tomorrows. You are
                  my greatest adventure, my safest place, and my truest home.
                </p>
                <p class="lp-closing">Forever and always yours,</p>
              </div>
            </div>
          </div>
        </Transition>

        <!-- ═══ RIGHT / CENTER: Envelope ═══ -->
        <div class="env-panel">

          <!-- Envelope assembly -->
          <div class="env-wrap" :class="envClass">

            <!-- Letter peeking out (rises during 'opening') -->
            <div class="env-inner-letter" :class="innerLetterClass">
              <div class="inner-lines">
                <span/><span/><span/><span/><span/><span/>
              </div>
            </div>

            <!-- Envelope body layers (back → clip → front) -->
            <div class="env-back">
              <!-- Clipping layer for the internal folds -->
              <div class="env-folds">
                <div class="fold fold-left"/>
                <div class="fold fold-right"/>
                <div class="fold fold-bottom"/>
              </div>
              <!-- Wax seal visible when envelope is closed -->
              <div class="env-seal" :class="{ hide: phase === 'revealed' }" aria-hidden="true">
                <svg viewBox="0 0 44 44" width="44" height="44">
                  <circle cx="22" cy="22" r="20" fill="#86A789" opacity="0.13"/>
                  <circle cx="22" cy="22" r="13" fill="#86A789" opacity="0.2"/>
                  <circle cx="22" cy="22" r="7"  fill="#86A789" opacity="0.35"/>
                </svg>
                <span class="seal-letter">T</span>
              </div>
            </div>

            <!-- Flap — 3D rotates backward to open -->
            <div class="env-flap" :class="{ open: phase === 'opening' || phase === 'revealed' }"/>

          </div><!-- /env-wrap -->

          <!-- Passphrase input — REMOVED: egg opens immediately on click -->

        </div><!-- /env-panel -->
      </div><!-- /egg-scene -->
    </div><!-- /egg-overlay -->
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const phase = ref<'idle' | 'opening' | 'revealed'>('idle')

/* ── Open / close ─────────────────────────────────────────── */
function open() {
  // Go directly to opening animation — no passphrase needed
  startOpenAnimation()
}
function close() {
  phase.value = 'idle'
}
defineExpose({ open })

/* ── Animation sequence ───────────────────────────────────── */
function startOpenAnimation() {
  phase.value = 'opening'
  setTimeout(() => { phase.value = 'revealed' }, 2000)
}

/* ── Computed classes ─────────────────────────────────────── */
const envClass = computed(() => ({
  'is-opening':  phase.value === 'opening',
  'is-revealed': phase.value === 'revealed',
}))

const innerLetterClass = computed(() => ({
  'rise': phase.value === 'opening' || phase.value === 'revealed',
}))

/* ── Keyboard close ───────────────────────────────────────── */
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && phase.value !== 'idle') close()
}
onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
/* ════════════════════════════════════════════
   OVERLAY
════════════════════════════════════════════ */
.egg-overlay {
  position: fixed;
  inset: 0;
  background: rgba(245, 243, 238, 0.93);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  z-index: 10001;  /* above security gate (9999) */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.egg-close {
  position: absolute; top: 1.4rem; right: 1.8rem;
  background: none; border: none; font-size: 1.1rem;
  color: var(--ink-muted); cursor: pointer;
  padding: 0.3rem 0.4rem; border-radius: 4px;
  transition: color 0.2s; z-index: 10;
}
.egg-close:hover { color: var(--ink); }

/* Overlay transition */
.egg-fade-enter-active { transition: opacity 0.4s ease; }
.egg-fade-leave-active { transition: opacity 0.3s ease; }
.egg-fade-enter-from, .egg-fade-leave-to { opacity: 0; }

/* ════════════════════════════════════════════
   SCENE — default: centered column
   is-revealed: flex row, gap
════════════════════════════════════════════ */
.egg-scene {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2.5rem;
  width: 100%;
  max-width: 860px;
  transition: all 0.6s ease;
}
.egg-scene.is-revealed {
  flex-direction: row;
  align-items: center;
  gap: 4rem;
}
@media (max-width: 640px) {
  .egg-scene.is-revealed { flex-direction: column; gap: 2rem; }
}

/* ════════════════════════════════════════════
   LETTER PANEL (left)
════════════════════════════════════════════ */
.letter-panel {
  flex: 1;
  max-width: 420px;
}

.letter-paper {
  background: #faf9f6;
  border: 1px solid #d4cfc6;
  border-radius: 4px;
  padding: 2.4rem 2.2rem 2rem;
  box-shadow:
    0 2px 6px rgba(0,0,0,0.04),
    0 12px 36px rgba(0,0,0,0.06),
    4px 0 0 0 rgba(134,167,137,0.08) inset;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.letter-wax {
  display: flex;
  justify-content: center;
  margin-bottom: 1.2rem;
}



.lp-salutation {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  font-style: italic;
  color: var(--ink-muted);
  margin: 0 0 1rem;
  letter-spacing: 0.04em;
}

.lp-para {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(0.88rem, 1.6vw, 1.02rem);
  line-height: 1.88;
  color: var(--ink);
  margin: 0 0 1rem;
  opacity: 0;
  transform: translateY(8px);
}

/* Staggered fade-in for each paragraph */
.letter-paper.animate .lp-p1 { animation: paraFadeIn 0.6s ease 0.2s forwards; }
.letter-paper.animate .lp-p2 { animation: paraFadeIn 0.6s ease 0.5s forwards; }
.letter-paper.animate .lp-p3 { animation: paraFadeIn 0.6s ease 0.8s forwards; }
.letter-paper.animate .lp-p4 { animation: paraFadeIn 0.6s ease 1.1s forwards; }
.lp-closing {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem;
  font-style: italic;
  color: var(--sage);
  margin: 1rem 0 0;
  letter-spacing: 0.04em;
  opacity: 0;
  animation: paraFadeIn 0.6s ease 1.4s forwards;
}

@keyframes paraFadeIn {
  to { opacity: 1; transform: translateY(0); }
}

/* Letter reveal transition */
.letter-reveal-enter-active { transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s; }
.letter-reveal-leave-active { transition: opacity 0.3s ease; }
.letter-reveal-enter-from   { opacity: 0; transform: translateX(-24px); }
.letter-reveal-leave-to     { opacity: 0; }

/* ════════════════════════════════════════════
   ENVELOPE PANEL (right / center)
════════════════════════════════════════════ */
.env-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.8rem;
  flex-shrink: 0;
}

/* Envelope assembly wrapper */
.env-wrap {
  position: relative;
  width: 300px;
  height: 196px;
  perspective: 900px;
  /* Scale in animation */
  animation: envAppear 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes envAppear {
  from { opacity: 0; transform: scale(0.82) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Inner letter (rises out of envelope during opening) */
.env-inner-letter {
  position: absolute;
  left: 8%;
  width: 84%;
  height: 170px;
  background: linear-gradient(180deg, #faf9f6 0%, #f2efe9 100%);
  border: 1px solid #d4cfc6;
  border-radius: 2px;
  bottom: 14px;
  z-index: 4;
  transform: translateY(60px);      /* hidden inside */
  transition: transform 1.1s cubic-bezier(0.4, 0, 0.2, 1) 0.7s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1rem;
}
.env-inner-letter.rise {
  transform: translateY(-110px);   /* pops out above envelope */
}

.inner-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding-top: 10px;
}
.inner-lines span {
  display: block;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d4cfc6 20%, #d4cfc6 80%, transparent);
  border-radius: 1px;
}
.inner-lines span:nth-child(1) { width: 60%; align-self: center; margin-bottom: 4px; }
.inner-lines span:nth-child(2) { width: 90%; }
.inner-lines span:nth-child(3) { width: 100%; }
.inner-lines span:nth-child(4) { width: 95%; }
.inner-lines span:nth-child(5) { width: 85%; }
.inner-lines span:nth-child(6) { width: 50%; }

/* Envelope back / body */
.env-back {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #f8f5ef 0%, #f0ece4 100%);
  border: 1.5px solid #c8c0b0;
  border-radius: 2px;
  box-shadow: 0 14px 42px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.06);
  z-index: 3;
  overflow: hidden;
}

/* Folds clipped inside body */
.env-folds {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.fold {
  position: absolute;
}
.fold-bottom {
  bottom: 0; left: 0; right: 0;
  border-bottom: 98px solid rgba(180, 172, 160, 0.35);
  border-left:   150px solid transparent;
  border-right:  150px solid transparent;
}
.fold-left {
  top: 0; left: 0; bottom: 0;
  border-left:   150px solid rgba(180, 172, 160, 0.28);
  border-top:    98px solid transparent;
  border-bottom: 98px solid transparent;
}
.fold-right {
  top: 0; right: 0; bottom: 0;
  border-right:  150px solid rgba(180, 172, 160, 0.28);
  border-top:    98px solid transparent;
  border-bottom: 98px solid transparent;
}

/* Wax seal on envelope */
.env-seal {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.4s;
}
.env-seal.hide { opacity: 0; pointer-events: none; }
.seal-letter {
  position: absolute;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  color: #4a6b4d;
  font-style: italic;
  font-weight: 600;
}

/* ═══ FLAP (3D opening) ═══ */
.env-flap {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100px;
  /* Triangle pointing DOWN — closed flap */
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  background: linear-gradient(180deg, #d0cbc0 0%, #c6c0b5 100%);
  transform-origin: top center;
  transform-style: preserve-3d;
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 8;
}
.env-flap.open {
  /* Rotates backward — flap opens */
  transform: perspective(900px) rotateX(-180deg);
}

/* Shadow line where flap meets body */
.env-back::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: rgba(0,0,0,0.08);
}

/* ════════════════════════════════════════════
   PASSPHRASE INPUT
════════════════════════════════════════════ */
.env-input-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.env-input {
  width: 260px;
  padding: 0.75rem 1.2rem;
  border: 1px solid var(--parchment);
  border-radius: 8px;
  background: rgba(250, 249, 246, 0.9);
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  color: var(--ink);
  letter-spacing: 0.06em;
  text-align: center;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.env-input::placeholder { color: var(--ink-muted); opacity: 0.6; font-style: italic; }
.env-input:focus { border-color: var(--sage-light); box-shadow: 0 0 0 3px rgba(134,167,137,0.12); }
.env-input.correct { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(134,167,137,0.22); color: var(--sage-dark); }

.env-input.shake {
  animation: shakeInput 0.5s ease;
}
@keyframes shakeInput {
  0%, 100% { transform: translateX(0); }
  20%  { transform: translateX(-8px); }
  40%  { transform: translateX(8px); }
  60%  { transform: translateX(-5px); }
  80%  { transform: translateX(5px); }
}

.env-hint {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.78rem;
  font-style: italic;
  color: #b08888;
  letter-spacing: 0.08em;
  height: 1rem;
  opacity: 0;
  transition: opacity 0.25s;
  margin: 0;
}
.env-hint.visible { opacity: 1; }

/* Input zone transition */
.input-fade-enter-active { transition: opacity 0.3s ease; }
.input-fade-leave-active { transition: opacity 0.25s ease; }
.input-fade-enter-from, .input-fade-leave-to { opacity: 0; }

/* ════════════════════════════════════════════
   MOBILE
════════════════════════════════════════════ */
@media (max-width: 640px) {
  .env-wrap   { width: 260px; height: 170px; }
  .env-flap   { height: 86px; }
  .fold-bottom{ border-bottom-width: 85px; border-left-width: 130px; border-right-width: 130px; }
  .fold-left  { border-left-width: 130px; border-top-width: 85px; border-bottom-width: 85px; }
  .fold-right { border-right-width: 130px; border-top-width: 85px; border-bottom-width: 85px; }
  .env-input  { width: 220px; }
  .letter-paper { padding: 1.8rem 1.4rem 1.6rem; max-height: 55vh; }
}
</style>
