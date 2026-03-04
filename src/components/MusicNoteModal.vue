<template>
  <Transition name="mn-fade">
    <div
      v-if="open"
      class="mn-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="A music note"
      @click.self="close"
    >
      <div class="mn-modal">

        <!-- Tulip accents -->
        <div class="mn-tulip mn-tl" aria-hidden="true">
          <TulipSvg :size="65" :opacity="0.09" color="#e8a0b0" />
        </div>
        <div class="mn-tulip mn-br" aria-hidden="true">
          <TulipSvg :size="55" :opacity="0.08" color="#86A789" />
        </div>
        <div class="mn-tulip mn-tm" aria-hidden="true">
          <TulipSvg :size="40" :opacity="0.07" color="#b8a8d0" />
        </div>

        <!-- Close -->
        <button class="mn-close" aria-label="Close" @click="close">✕</button>

        <!-- Musical note decoration -->
        <div class="mn-note-icon" aria-hidden="true">♪</div>

        <!-- Eyebrow -->
        <p class="mn-eyebrow">A little note, tucked between the notes.</p>
        <div class="mn-divider" />

        <!-- Body -->
        <div class="mn-body">
          <p class="mn-para">
            You're the music I didn't know I was missing.
          </p>
          <p class="mn-para accent">
            Before you, sound was just sound. But now — every song feels like
            it's about us somehow. Every quiet melody feels like the space
            between your words. Every chorus feels like the moment I realized
            I was in too deep to ever want to find my way back.
          </p>
          <p class="mn-para">
            You are the kind of music that doesn't need to be loud to be felt.
            You play softly in the spaces between ordinary moments — when we're
            just sitting together, when you laugh at something small, when you
            reach for my hand without thinking.
          </p>
          <p class="mn-para italic">
            I hear you in the in-between. In the three seconds before a song
            starts. In the silence after one ends. In the part of me that hums
            something I can't name but I know is you.
          </p>
          <p class="mn-para accent">
            You are my favorite song. The one I never get tired of. The one I
            put on when I need to feel something real.
          </p>
          <p class="mn-para">
            I hope you know: I don't ever want to press pause on us.
          </p>
          <p class="mn-signature">— play me, always. 🎵</p>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import TulipSvg from './TulipSvg.vue'

const props = defineProps<{ open: boolean }>()
const emit  = defineEmits<{ (e: 'update:open', v: boolean): void }>()

function close() { emit('update:open', false) }

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) close()
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* ── Overlay ───────────────────────────────────────────── */
.mn-overlay {
  position: fixed;
  inset: 0;
  background: rgba(245, 243, 238, 0.9);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  z-index: 1300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* ── Card ──────────────────────────────────────────────── */
.mn-modal {
  position: relative;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid var(--parchment);
  border-radius: 22px;
  max-width: 500px;
  width: 100%;
  padding: 3rem 3rem 2.5rem;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.09), 0 4px 16px rgba(232, 160, 176, 0.08);
  overflow: hidden;
}

.mn-tulip { position: absolute; pointer-events: none; }
.mn-tl { top: -10px; left: -8px;    transform: rotate(-16deg); }
.mn-br { bottom: -8px; right: -6px; transform: rotate(-10deg) scaleX(-1); }
.mn-tm { top: 30%; right: -4px;     transform: rotate(20deg); }

.mn-close {
  position: absolute; top: 1.2rem; right: 1.4rem;
  background: none; border: none; font-size: 1rem;
  color: var(--ink-muted); cursor: pointer;
  padding: 0.3rem 0.4rem; border-radius: 4px;
  transition: color 0.2s; z-index: 2;
}
.mn-close:hover { color: var(--ink); }

/* Musical note */
.mn-note-icon {
  font-size: 2.2rem;
  color: var(--sage-light);
  margin-bottom: 0.6rem;
  display: block;
  line-height: 1;
  position: relative;
  z-index: 2;
}

.mn-eyebrow {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem;
  font-style: italic;
  color: var(--ink-muted);
  letter-spacing: 0.03em;
  margin: 0 0 1rem;
  position: relative;
  z-index: 2;
}

.mn-divider {
  height: 1px;
  background: var(--parchment);
  margin-bottom: 1.6rem;
}

/* Body */
.mn-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.mn-para {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(0.95rem, 1.9vw, 1.12rem);
  line-height: 1.9;
  color: var(--ink);
  margin: 0;
}

.mn-para.accent {
  color: var(--sage-dark);
  font-weight: 500;
}

.mn-para.italic {
  font-style: italic;
  color: var(--ink-muted);
}

.mn-signature {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  font-style: italic;
  color: var(--sage);
  margin-top: 0.6rem;
  letter-spacing: 0.04em;
}

/* ── Transitions ────────────────────────────────────────── */
.mn-fade-enter-active { transition: opacity 0.35s ease; }
.mn-fade-leave-active { transition: opacity 0.28s ease; }
.mn-fade-enter-from   { opacity: 0; }
.mn-fade-leave-to     { opacity: 0; }

.mn-fade-enter-active .mn-modal {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
}
.mn-fade-enter-from .mn-modal {
  transform: scale(0.94) translateY(12px);
  opacity: 0;
}

@media (max-width: 600px) {
  .mn-modal { padding: 2.4rem 1.8rem 2rem; }
}
</style>
