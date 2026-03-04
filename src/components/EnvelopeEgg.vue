<template>
  <Transition name="egg-fade">
    <div
      v-if="phase !== 'idle'"
      class="egg-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="A secret letter"
      @click.self="close"
    >
      <!-- ── Ambient tulip decorations ────────────────────── -->
      <div class="egg-tulip egg-tl" aria-hidden="true">
        <TulipSvg :size="110" :opacity="0.1" color="#86A789" />
      </div>
      <div class="egg-tulip egg-tr" aria-hidden="true">
        <TulipSvg :size="85"  :opacity="0.09" color="#e8a0b0" />
      </div>
      <div class="egg-tulip egg-bl" aria-hidden="true">
        <TulipSvg :size="70"  :opacity="0.08" color="#b8a8d0" />
      </div>
      <div class="egg-tulip egg-br" aria-hidden="true">
        <TulipSvg :size="90"  :opacity="0.09" color="#d4a0a8" />
      </div>
      <div class="egg-tulip egg-ml" aria-hidden="true">
        <TulipSvg :size="55"  :opacity="0.07" color="#86A789" />
      </div>

      <!-- ── Close button ─────────────────────────────────── -->
      <button class="egg-close" aria-label="Close" @click="close">✕</button>

      <!-- ── Scene ────────────────────────────────────────── -->
      <div class="egg-scene" :class="`is-${phase}`">

        <!-- LEFT: Letter panel (only in 'revealed') -->
        <Transition name="letter-reveal">
          <div v-if="phase === 'revealed'" class="letter-panel">
            <div class="letter-paper animate">

              <!-- Wax top accent -->
              <div class="letter-wax" aria-hidden="true">
                <svg viewBox="0 0 40 40" width="32" height="32">
                  <circle cx="20" cy="20" r="18" fill="#86A789" opacity="0.13"/>
                  <circle cx="20" cy="20" r="12" fill="#86A789" opacity="0.2"/>
                  <circle cx="20" cy="20" r="6"  fill="#86A789" opacity="0.38"/>
                </svg>
              </div>

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

              <!-- Hint for Easter Egg #2 -->
              <p class="lp-hint">
                ✨ ps. flowers hold more secrets than they let on.
                the one you water every day… hold it a little longer.
              </p>
            </div>
          </div>
        </Transition>

        <!-- CENTER → RIGHT: Envelope -->
        <div class="env-panel">

          <!-- Eyebrow label (only when envelope is closed) -->
          <Transition name="label-fade">
            <p v-if="phase === 'envelope'" class="env-eyebrow">a letter, sealed with love</p>
          </Transition>

          <!-- Envelope + tulip corners -->
          <div class="env-stage">

            <!-- Tiny tulip corner accents on envelope -->
            <div class="etulip etl" aria-hidden="true">
              <TulipSvg :size="38" :opacity="0.18" color="#86A789" />
            </div>
            <div class="etulip etr" aria-hidden="true">
              <TulipSvg :size="32" :opacity="0.15" color="#e8a0b0" />
            </div>

            <!-- Envelope body -->
            <div class="env-wrap" :class="envClass">

              <!-- Inner letter stub (rises on opening) -->
              <div class="env-inner-letter" :class="{ rise: phase !== 'envelope' }">
                <div class="inner-lines">
                  <span/><span/><span/><span/><span/><span/>
                </div>
              </div>

              <!-- Body + folds -->
              <div class="env-back">
                <div class="env-folds">
                  <div class="fold fold-left"/>
                  <div class="fold fold-right"/>
                  <div class="fold fold-bottom"/>
                </div>

                <!-- Wax seal (visible when closed) -->
                <div class="env-seal" :class="{ hide: phase !== 'envelope' }" aria-hidden="true">
                  <svg viewBox="0 0 52 52" width="52" height="52">
                    <circle cx="26" cy="26" r="24" fill="#86A789" opacity="0.12"/>
                    <circle cx="26" cy="26" r="16" fill="#86A789" opacity="0.2"/>
                    <circle cx="26" cy="26" r="8"  fill="#86A789" opacity="0.38"/>
                  </svg>
                  <span class="seal-t">T</span>
                </div>
              </div>

              <!-- Flap — rotates backward when opening/revealed -->
              <div class="env-flap" :class="{ open: phase === 'opening' || phase === 'revealed' }"/>

            </div><!-- /env-wrap -->
          </div><!-- /env-stage -->

          <!-- Passphrase input (only when envelope is closed) -->
          <Transition name="input-fade">
            <div v-if="phase === 'envelope'" class="env-input-zone">
              <p class="env-input-label">enter the passphrase to unseal</p>
              <input
                ref="inputRef"
                v-model="eggPhrase"
                class="env-input"
                type="text"
                placeholder="enter passphrase"
                :class="{ shake: shaking, correct: phraseCorrect }"
                autocomplete="off"
                spellcheck="false"
                @input="onEggInput"
              />
              <p class="env-hint" :class="{ visible: shaking }">hmm, not quite…</p>
            </div>
          </Transition>

        </div><!-- /env-panel -->
      </div><!-- /egg-scene -->
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import TulipSvg from './TulipSvg.vue'

type Phase = 'idle' | 'envelope' | 'opening' | 'revealed'
const phase         = ref<Phase>('idle')
const eggPhrase     = ref('')
const shaking       = ref(false)
const phraseCorrect = ref(false)
const inputRef      = ref<HTMLInputElement | null>(null)

const SECRET = 'trust yearning love'

/* ── Open: show closed envelope + input ─────────────────── */
function open() {
  phase.value    = 'envelope'
  eggPhrase.value = ''
  phraseCorrect.value = false
  nextTick(() => inputRef.value?.focus())
}

function close() {
  phase.value = 'idle'
  eggPhrase.value = ''
}

defineExpose({ open })

/* ── Passphrase check ────────────────────────────────────── */
function onEggInput() {
  if (eggPhrase.value.toLowerCase().trim() === SECRET) {
    phraseCorrect.value = true
    setTimeout(beginOpen, 400)
  }
}

function beginOpen() {
  phase.value = 'opening'
  setTimeout(() => { phase.value = 'revealed' }, 2100)
}

/* ── Computed classes ────────────────────────────────────── */
const envClass = computed(() => ({
  'is-opening':  phase.value === 'opening',
  'is-revealed': phase.value === 'revealed',
}))

/* ── Shake on wrong (optional Enter key) ─────────────────── */
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && phase.value !== 'idle') { close(); return }
  if (e.key === 'Enter'
      && phase.value === 'envelope'
      && !phraseCorrect.value
      && eggPhrase.value.length > 0) {
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
.egg-overlay {
  position: fixed;
  inset: 0;
  background: rgba(247, 245, 240, 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  z-index: 10001;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 3rem 1.5rem;
  overflow-y: auto;
}

/* Tulip background accents */
.egg-tulip {
  position: absolute;
  pointer-events: none;
  user-select: none;
  animation: eggTulipFloat 9s ease-in-out infinite;
}
.egg-tl { top: -1rem;  left: -1rem;   transform: rotate(-15deg); animation-duration: 8s; }
.egg-tr { top: -1rem;  right: -1rem;  transform: rotate(12deg);  animation-duration: 10s; animation-delay: 1.2s; }
.egg-bl { bottom: -1rem; left: -1rem; transform: rotate(20deg);  animation-duration: 7.5s; animation-delay: 3s; }
.egg-br { bottom: -1rem; right: -1rem;transform: rotate(-8deg);  animation-duration: 11s; animation-delay: 0.8s; }
.egg-ml { top: 45%; left: 0;          transform: rotate(18deg);  animation-duration: 9s; animation-delay: 4s; }

@keyframes eggTulipFloat {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-14px); }
}

.egg-close {
  position: absolute; top: 1.4rem; right: 1.8rem;
  background: none; border: none; font-size: 1.1rem;
  color: var(--ink-muted); cursor: pointer;
  padding: 0.35rem 0.45rem; border-radius: 4px;
  transition: color 0.2s; z-index: 10;
}
.egg-close:hover { color: var(--ink); }

/* Overlay transition */
.egg-fade-enter-active { transition: opacity 0.4s ease; }
.egg-fade-leave-active { transition: opacity 0.3s ease; }
.egg-fade-enter-from, .egg-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════════════════════════
   SCENE
══════════════════════════════════════════════════════════ */
.egg-scene {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  max-width: 860px;
  transition: flex-direction 0.5s, gap 0.5s;
}
.egg-scene.is-revealed {
  flex-direction: row;
  align-items: center;
  gap: 4rem;
}

@media (max-width: 680px) {
  .egg-scene.is-revealed { flex-direction: column; gap: 2rem; }
}

/* ══════════════════════════════════════════════════════════
   LETTER PANEL
══════════════════════════════════════════════════════════ */
.letter-panel {
  flex: 1;
  max-width: 420px;
  width: 100%;
}

.letter-paper {
  background: #faf9f6;
  border: 1px solid #d4cfc6;
  border-radius: 6px;
  padding: 2.4rem 2.2rem 2rem;
  box-shadow:
    0 2px 6px rgba(0,0,0,0.04),
    0 14px 40px rgba(0,0,0,0.07);
  max-height: 78vh;
  overflow-y: auto;
  position: relative;
}

.letter-wax { display: flex; justify-content: center; margin-bottom: 1.1rem; }

.lp-salutation {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.06rem; font-style: italic;
  color: var(--ink-muted); margin: 0 0 1rem;
  letter-spacing: 0.04em;
}

.lp-para {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(0.88rem, 1.5vw, 1.01rem);
  line-height: 1.9; color: var(--ink);
  margin: 0 0 1rem;
  opacity: 0; transform: translateY(8px);
}

.letter-paper.animate .lp-p1 { animation: paraFade 0.6s ease 0.2s forwards; }
.letter-paper.animate .lp-p2 { animation: paraFade 0.6s ease 0.5s forwards; }
.letter-paper.animate .lp-p3 { animation: paraFade 0.6s ease 0.8s forwards; }
.letter-paper.animate .lp-p4 { animation: paraFade 0.6s ease 1.1s forwards; }

.lp-closing {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem; font-style: italic;
  color: var(--sage); margin: 0.6rem 0 0;
  letter-spacing: 0.04em;
  opacity: 0;
  animation: paraFade 0.6s ease 1.4s forwards;
}

/* Easter egg hint — barely visible, whisper-level */
.lp-hint {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.72rem;
  font-style: italic;
  color: var(--sage-light);
  opacity: 0;
  margin: 1.4rem 0 0;
  letter-spacing: 0.06em;
  line-height: 1.7;
  animation: paraFade 0.7s ease 2s forwards;
}

@keyframes paraFade { to { opacity: 1; transform: translateY(0); } }

.letter-reveal-enter-active { transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s; }
.letter-reveal-leave-active { transition: opacity 0.3s ease; }
.letter-reveal-enter-from   { opacity: 0; transform: translateX(-24px); }
.letter-reveal-leave-to     { opacity: 0; }

/* ══════════════════════════════════════════════════════════
   ENVELOPE PANEL
══════════════════════════════════════════════════════════ */
.env-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
}

/* Eyebrow above envelope */
.env-eyebrow {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--sage);
  margin: 0;
  opacity: 0.8;
}

.label-fade-enter-active { transition: opacity 0.35s ease; }
.label-fade-leave-active { transition: opacity 0.25s ease; }
.label-fade-enter-from, .label-fade-leave-to { opacity: 0; }

/* Stage = env-wrap + corner tulips */
.env-stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.etulip { position: absolute; pointer-events: none; }
.etl { top: -28px;   left: -24px;  transform: rotate(-20deg); }
.etr { top: -22px;   right: -20px; transform: rotate(16deg) scaleX(-1); }

/* ── Envelope wrap ── */
.env-wrap {
  position: relative;
  width: 310px;
  height: 206px;
  perspective: 1000px;
  animation: envPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes envPop {
  from { opacity: 0; transform: scale(0.8) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Inner stub letter */
.env-inner-letter {
  position: absolute;
  left: 8%; width: 84%; height: 172px;
  background: linear-gradient(180deg, #faf9f6 0%, #f1ede6 100%);
  border: 1px solid #d4cfc6;
  border-radius: 2px;
  bottom: 14px; z-index: 4;
  transform: translateY(62px);
  transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.65s;
  display: flex; align-items: center; justify-content: center;
  padding: 0.6rem 1rem;
}
.env-inner-letter.rise { transform: translateY(-116px); }

.inner-lines { display: flex; flex-direction: column; gap: 9px; width: 100%; padding-top: 12px; }
.inner-lines span {
  display: block; height: 1px; border-radius: 1px;
  background: linear-gradient(90deg, transparent, #cdc8be 20%, #cdc8be 80%, transparent);
}
.inner-lines span:nth-child(1) { width: 55%; align-self: center; margin-bottom: 4px; }
.inner-lines span:nth-child(2) { width: 92%; }
.inner-lines span:nth-child(3) { width: 100%; }
.inner-lines span:nth-child(4) { width: 96%; }
.inner-lines span:nth-child(5) { width: 88%; }
.inner-lines span:nth-child(6) { width: 52%; }

/* Envelope body */
.env-back {
  position: absolute; inset: 0;
  background: linear-gradient(155deg, #f6f2eb 0%, #ede9e0 100%);
  border: 1.5px solid #c4bdb0;
  border-radius: 3px;
  box-shadow:
    0 18px 50px rgba(0,0,0,0.11),
    0 4px 14px rgba(0,0,0,0.06),
    inset 0 1px 0 rgba(255,255,255,0.6);
  z-index: 3;
  overflow: hidden;
}

/* Fold layers clipped */
.env-folds { position: absolute; inset: 0; overflow: hidden; }
.fold { position: absolute; }
.fold-bottom {
  bottom: 0; left: 0; right: 0;
  border-bottom: 103px solid rgba(170,162,150,0.3);
  border-left: 155px solid transparent;
  border-right: 155px solid transparent;
}
.fold-left {
  top: 0; left: 0; bottom: 0;
  border-left: 155px solid rgba(170,162,150,0.22);
  border-top:    103px solid transparent;
  border-bottom: 103px solid transparent;
}
.fold-right {
  top: 0; right: 0; bottom: 0;
  border-right: 155px solid rgba(170,162,150,0.22);
  border-top:    103px solid transparent;
  border-bottom: 103px solid transparent;
}

/* Wax seal */
.env-seal {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.5s ease;
}
.env-seal.hide { opacity: 0; pointer-events: none; }

.seal-t {
  position: absolute;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem; font-style: italic;
  font-weight: 600; color: #4a6b4d;
}

/* 3D Flap */
.env-flap {
  position: absolute;
  top: 0; left: 0; width: 100%;
  height: 106px;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  background: linear-gradient(170deg, #d6d0c6 0%, #c8c2b8 60%, #bfb9ae 100%);
  transform-origin: top center;
  transform-style: preserve-3d;
  transition: transform 1.05s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 8;
  /* subtle highlight on flap top edge */
  filter: drop-shadow(0 1px 1px rgba(255,255,255,0.5));
}
.env-flap::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 60%);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}
.env-flap.open {
  transform: perspective(1000px) rotateX(-180deg);
}

/* ══════════════════════════════════════════════════════════
   PASSPHRASE INPUT
══════════════════════════════════════════════════════════ */
.env-input-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.env-input-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.75rem;
  font-style: italic;
  color: var(--ink-muted);
  letter-spacing: 0.1em;
  margin: 0 0 0.2rem;
  opacity: 0.75;
}

.env-input {
  width: 270px;
  padding: 0.8rem 1.3rem;
  border: 1px solid var(--parchment);
  border-radius: 40px;
  background: rgba(252, 250, 247, 0.9);
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  color: var(--ink);
  letter-spacing: 0.06em;
  text-align: center;
  outline: none;
  transition: border-color 0.35s, box-shadow 0.35s;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.env-input::placeholder { color: var(--ink-muted); opacity: 0.5; font-style: italic; }
.env-input:focus {
  border-color: var(--sage-light);
  box-shadow: 0 0 0 3px rgba(134,167,137,0.14), 0 2px 10px rgba(0,0,0,0.05);
}
.env-input.correct {
  border-color: var(--sage);
  box-shadow: 0 0 0 3px rgba(134,167,137,0.24);
  color: var(--sage-dark);
}

.env-input.shake { animation: shakeIt 0.5s ease; }
@keyframes shakeIt {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

.env-hint {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.78rem; font-style: italic;
  color: #b08888; letter-spacing: 0.08em;
  height: 1rem; margin: 0;
  opacity: 0; transition: opacity 0.25s;
}
.env-hint.visible { opacity: 1; }

.input-fade-enter-active { transition: opacity 0.3s ease; }
.input-fade-leave-active { transition: opacity 0.22s ease; }
.input-fade-enter-from, .input-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════════════════════════════
   MOBILE
══════════════════════════════════════════════════════════ */
@media (max-width: 640px) {
  /* Scene stacks vertically, envelope on top, letter on bottom */
  .egg-scene.is-revealed { flex-direction: column; gap: 1.5rem; }
  /* Shrink the envelope so it fits alongside the input */
  .env-wrap  { width: 230px; height: 153px; }
  .env-flap  { height: 77px; }
  .env-inner-letter { height: 128px; }
  .env-inner-letter.rise { transform: translateY(-86px); }
  .fold-bottom { border-bottom-width: 76px; border-left-width: 115px; border-right-width: 115px; }
  .fold-left   { border-left-width: 115px; border-top-width: 76px; border-bottom-width: 76px; }
  .fold-right  { border-right-width: 115px; border-top-width: 76px; border-bottom-width: 76px; }
  /* Input takes full width */
  .env-input   { width: 100%; max-width: 300px; }
  /* Letter fills full width with reduced height/padding */
  .letter-panel { max-width: 100%; }
  .letter-paper { padding: 1.8rem 1.4rem 1.6rem; max-height: none; }
  /* Hide less-important corner tulips on tiny screens */
  .egg-tulip   { display: none; }
  .egg-tl, .egg-tr { display: block; }
}
</style>
