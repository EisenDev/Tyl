<template>
  <!-- Envelope trigger button — fixed bottom-left -->
  <div class="envelope-anchor">
    <button
      id="envelope-btn"
      class="envelope-btn"
      aria-label="Open secret note"
      title="A secret note for you"
      @click="open = true"
    >
      <!-- Envelope SVG -->
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
      <span class="envelope-dot" aria-hidden="true" />
    </button>
    <span class="envelope-hint">a note&hellip;</span>
  </div>

  <!-- Secret Modal -->
  <Transition name="modal-fade">
    <div
      v-if="open"
      class="secret-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Secret note"
      @click.self="open = false"
    >
      <div class="secret-modal">
        <!-- Decorative tulip top-right -->
        <div class="modal-tulip" aria-hidden="true">
          <TulipSvg :size="54" :opacity="0.12" color="#86A789" />
        </div>

        <button class="modal-close" aria-label="Close" @click="open = false">✕</button>

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
        </div>

        <!-- Wax seal decoration -->
        <div class="wax-seal" aria-hidden="true">
          <svg viewBox="0 0 40 40" width="40" height="40">
            <circle cx="20" cy="20" r="18" fill="#86A789" opacity="0.18" />
            <circle cx="20" cy="20" r="12" fill="#86A789" opacity="0.28" />
            <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="#6b8a6d" font-family="Cormorant Garamond, serif">T</text>
          </svg>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TulipSvg from './TulipSvg.vue'

const open = ref(false)
</script>

<style scoped>
/* ── Anchor ──────────────────────────────────── */
.envelope-anchor {
  position: fixed;
  bottom: 5.5rem;
  right: 2rem;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.envelope-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(250, 249, 246, 0.92);
  border: 1px solid var(--parchment);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.07);
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.envelope-btn svg {
  width: 18px;
  height: 18px;
  color: var(--ink-muted);
  transition: color 0.3s;
}

.envelope-btn:hover {
  border-color: var(--sage);
  box-shadow: 0 4px 20px rgba(134, 167, 137, 0.28);
  transform: translateY(-2px);
}

.envelope-btn:hover svg {
  color: var(--sage-dark);
}

/* Unread dot */
.envelope-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #e8a0a0;
  border: 1.5px solid #FAF9F6;
  animation: dotPulse 2.4s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.3); opacity: 0.7; }
}

.envelope-hint {
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  color: var(--ink-muted);
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.3s, transform 0.3s;
}

.envelope-anchor:hover .envelope-hint {
  opacity: 1;
  transform: translateY(0);
}

/* ── Overlay ─────────────────────────────────── */
.secret-overlay {
  position: fixed;
  inset: 0;
  background: rgba(245, 243, 238, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* ── Modal ───────────────────────────────────── */
.secret-modal {
  position: relative;
  background: #fff;
  border: 1px solid var(--parchment);
  border-radius: 18px;
  max-width: 480px;
  width: 100%;
  padding: 3rem 3rem 2.5rem;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-tulip {
  position: absolute;
  top: -10px;
  right: -6px;
  transform: rotate(15deg);
  pointer-events: none;
}

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
}
.modal-close:hover { color: var(--ink); }

.modal-label {
  font-size: 0.65rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--sage);
  margin-bottom: 1.4rem;
  font-weight: 400;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.modal-line {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1rem, 2.2vw, 1.2rem);
  line-height: 1.85;
  color: var(--ink);
  font-weight: 400;
}

.modal-line.accent {
  color: var(--sage-dark);
  font-weight: 500;
  font-size: clamp(1.1rem, 2.5vw, 1.35rem);
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
  margin-top: 0.5rem;
  letter-spacing: 0.04em;
}

.wax-seal {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* ── Transition ──────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.35s ease;
}
.modal-fade-enter-active .secret-modal,
.modal-fade-leave-active .secret-modal {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.modal-fade-enter-from { opacity: 0; }
.modal-fade-leave-to   { opacity: 0; }
.modal-fade-enter-from .secret-modal { transform: scale(0.94) translateY(12px); opacity: 0; }
.modal-fade-leave-to   .secret-modal { transform: scale(0.96); opacity: 0; }
</style>
