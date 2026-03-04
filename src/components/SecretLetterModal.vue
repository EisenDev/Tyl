<template>
  <Transition name="modal-fade">
    <div
      v-if="open"
      class="secret-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="A quiet note"
      @click.self="close"
    >
      <div class="secret-modal">

        <!-- ── Tulip decorations inside modal bg ── -->
        <div class="mt mt--tl" aria-hidden="true">
          <TulipSvg :size="80" :opacity="0.1" color="#86A789" />
        </div>
        <div class="mt mt--tr" aria-hidden="true">
          <TulipSvg :size="65" :opacity="0.09" color="#e8a0b0" />
        </div>
        <div class="mt mt--bl" aria-hidden="true">
          <TulipSvg :size="55" :opacity="0.08" color="#b8a8d0" />
        </div>
        <div class="mt mt--br" aria-hidden="true">
          <TulipSvg :size="70" :opacity="0.09" color="#d4a0a8" />
        </div>
        <div class="mt mt--mc" aria-hidden="true">
          <TulipSvg :size="44" :opacity="0.07" color="#86A789" />
        </div>

        <!-- Close -->
        <button class="modal-close" aria-label="Close" @click="close">✕</button>

        <!-- Content -->
        <p class="modal-label">A quieter note</p>

        <div class="modal-body">
          <p class="modal-line">
            If you are reading this, you found it.<br />
            Which means you are exactly the kind of person<br />
            who pays attention to the small things.
          </p>
          <p class="modal-line accent">
            I love that about you.
          </p>
          <p class="modal-line">
            I am sorry for every time I made you feel like<br />
            you had to search for reassurance on your own.
          </p>
          <p class="modal-line italic">
            You will never have to look this hard again.<br />
            I promise.
          </p>
          <p class="modal-signature">— with everything I have, always.</p>
          
          <div class="clue-section">
            <p class="modal-line clue-text">
              Not everything is seen inside sometimes you need to look outside the space <span class="highlight">my beloved</span>.
            </p>
          </div>
        </div>

        <!-- Wax seal -->
        <div class="wax-seal" aria-hidden="true">
          <svg viewBox="0 0 44 44" width="44" height="44">
            <circle cx="22" cy="22" r="20" fill="#86A789" opacity="0.15"/>
            <circle cx="22" cy="22" r="14" fill="#86A789" opacity="0.22"/>
            <circle cx="22" cy="22" r="7"  fill="#86A789" opacity="0.3"/>
            <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle"
                  font-size="10" fill="#6b8a6d" font-family="Cormorant Garamond, serif"
                  font-style="italic">T</text>
          </svg>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import TulipSvg from './TulipSvg.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', val: boolean): void }>()

function close() {
  emit('update:open', false)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* ── Overlay ─────────────────────────────────── */
.secret-overlay {
  position: fixed;
  inset: 0;
  background: rgba(245, 243, 238, 0.88);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* ── Modal ────────────────────────────────────── */
.secret-modal {
  position: relative;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--parchment);
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  padding: 3.2rem 3rem 2.5rem;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.10), 0 4px 16px rgba(134,167,137,0.08);
  overflow: hidden;
}

/* ── Tulip motifs inside the modal ────────────── */
.mt {
  position: absolute;
  pointer-events: none;
  user-select: none;
}
.mt--tl { top: -12px; left: -10px;  transform: rotate(-15deg); }
.mt--tr { top: -8px;  right: -8px;  transform: rotate(20deg) scaleX(-1); }
.mt--bl { bottom: -8px; left: -8px; transform: rotate(12deg); }
.mt--br { bottom: -12px; right: -10px; transform: rotate(-10deg) scaleX(-1); }
.mt--mc { top: 45%;  right: 8px;   transform: rotate(30deg) translateY(-50%); opacity: 0.6; }

/* ── Content ──────────────────────────────────── */
.modal-close {
  position: absolute;
  top: 1.2rem;
  right: 1.4rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--ink-muted);
  cursor: pointer;
  line-height: 1;
  padding: 0.3rem 0.4rem;
  border-radius: 4px;
  transition: color 0.2s;
  z-index: 2;
}
.modal-close:hover { color: var(--ink); }

.modal-label {
  font-size: 0.65rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--sage);
  margin-bottom: 1.6rem;
  font-weight: 400;
  position: relative;
  z-index: 2;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
  z-index: 2;
}

.modal-line {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1rem, 2.2vw, 1.22rem);
  line-height: 1.9;
  color: var(--ink);
  font-weight: 400;
}

.modal-line.accent {
  color: var(--sage-dark);
  font-weight: 500;
  font-size: clamp(1.1rem, 2.5vw, 1.38rem);
}

.modal-line.italic {
  font-style: italic;
  color: var(--ink-muted);
}

.modal-signature {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  font-style: italic;
  color: var(--sage);
  margin-top: 0.4rem;
  letter-spacing: 0.04em;
  position: relative;
  z-index: 2;
}

.wax-seal {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.6rem;
  position: relative;
  z-index: 2;
}

.clue-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px dashed rgba(134,167,137,0.3);
}

.clue-text {
  font-size: 1.1rem;
  font-style: italic;
  color: var(--ink-muted);
}

.highlight {
  color: var(--sage-dark);
  font-weight: 500;
}

/* ── Transitions ──────────────────────────────── */
.modal-fade-enter-active { transition: opacity 0.35s ease; }
.modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from   { opacity: 0; }
.modal-fade-leave-to     { opacity: 0; }

.modal-fade-enter-active .secret-modal {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.modal-fade-enter-from .secret-modal {
  transform: scale(0.93) translateY(14px);
  opacity: 0;
}
</style>
