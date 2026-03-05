<template>
  <!-- Tulip confetti trigger — fixed BOTTOM-LEFT -->
  <div class="tulip-trigger-anchor">
    <span class="tulip-hint">for you&nbsp;🌷</span>
    <div class="hold-ring-wrap">
      <!-- Hold progress ring -->
      <svg class="hold-ring" viewBox="0 0 48 48" :style="holdRingStyle">
        <circle class="ring-track" cx="24" cy="24" r="21"/>
        <circle class="ring-fill" cx="24" cy="24" r="21"
          :style="{ strokeDashoffset: ringDashOffset }" />
      </svg>
      <button
        id="tulip-confetti-btn"
        class="tulip-trigger-btn"
        :class="{ blooming, holding }"
        aria-label="Send tulips"
        title="A bouquet for you"
        @click="bloom"
        @mousedown="startHold"
        @mouseup="cancelHold"
        @mouseleave="cancelHold"
        @touchstart="startHold"
        @touchend="cancelHold"
        @touchcancel="cancelHold"
      >
      <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="28">
        <path d="M32 78 C32 62 32 50 32 36" stroke="#86A789" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M32 54 C23 47 17 38 21 29 C26 38 30 46 32 54Z" fill="#86A789" opacity="0.6"/>
        <path d="M32 50 C41 43 47 34 43 25 C38 34 34 42 32 50Z" fill="#86A789" opacity="0.6"/>
        <path d="M32 36 C29 27 23 20 21 12 C25 8 30 11 32 18 C34 11 39 8 43 12 C41 20 35 27 32 36Z" fill="#86A789"/>
        <path d="M30 35 C26 27 20 20 18 11 C21 8 26 11 29 18Z" fill="#a8c4aa"/>
        <path d="M34 35 C38 27 44 20 46 11 C43 8 38 11 35 18Z" fill="#a8c4aa"/>
        <circle cx="32" cy="20" r="2.5" fill="#FAF9F6" opacity="0.85"/>
      </svg>
      </button>
    </div><!-- /hold-ring-wrap -->
  </div>

  <!-- Scroll Easter Egg -->
  <ScrollEgg ref="scrollEggRef" />

  <!-- Bouquet overlay — WITH backdrop blur -->
  <Transition name="bouquet-fade">
    <div v-if="showBouquet" class="bouquet-overlay" aria-hidden="true">
      <div class="bouquet-center">
        <svg viewBox="0 0 200 260" width="200" height="260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Left tulip — sage -->
          <path d="M80 260 C80 210 75 180 78 148" stroke="#86A789" stroke-width="3" stroke-linecap="round"/>
          <path d="M78 200 C65 188 55 172 60 156 C67 168 74 182 78 200Z" fill="#a8c4aa" opacity="0.7"/>
          <path d="M78 148 C73 132 65 120 63 106 C69 101 76 105 78 115 C80 105 87 101 93 106 C91 120 83 132 78 148Z" fill="#86A789"/>
          <path d="M76 146 C71 130 63 118 61 103 C65 99 71 103 74 113Z" fill="#a8c4aa"/>
          <path d="M80 146 C85 130 93 118 95 103 C91 99 85 103 82 113Z" fill="#a8c4aa"/>
          <!-- Center tulip — dark sage -->
          <path d="M100 260 C100 205 100 175 100 140" stroke="#6b8a6d" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M100 200 C88 188 82 170 88 152 C94 166 98 182 100 200Z" fill="#86A789" opacity="0.6"/>
          <path d="M100 200 C112 188 118 170 112 152 C106 166 102 182 100 200Z" fill="#86A789" opacity="0.6"/>
          <path d="M100 140 C96 126 88 116 85 100 C91 95 98 99 100 109 C102 99 109 95 115 100 C112 116 104 126 100 140Z" fill="#6b8a6d"/>
          <path d="M98 138 C93 124 85 114 82 98 C87 94 93 98 96 108Z" fill="#86A789" opacity="0.7"/>
          <path d="M102 138 C107 124 115 114 118 98 C113 94 107 98 104 108Z" fill="#86A789" opacity="0.7"/>
          <circle cx="100" cy="110" r="3.5" fill="#FAF9F6"/>
          <!-- Right tulip — pink -->
          <path d="M122 260 C122 210 127 180 122 148" stroke="#86A789" stroke-width="3" stroke-linecap="round"/>
          <path d="M122 200 C135 188 145 172 140 156 C133 168 126 182 122 200Z" fill="#a8c4aa" opacity="0.7"/>
          <path d="M122 148 C127 132 135 120 137 106 C131 101 124 105 122 115 C120 105 113 101 107 106 C109 120 117 132 122 148Z" fill="#e8a0b0"/>
          <path d="M120 146 C115 130 107 118 105 103 C109 99 115 103 118 113Z" fill="#f0b8c4" opacity="0.85"/>
          <path d="M124 146 C129 130 137 118 139 103 C135 99 129 103 126 113Z" fill="#f0b8c4" opacity="0.85"/>
          <circle cx="122" cy="114" r="2.5" fill="#FAF9F6" opacity="0.9"/>
          <!-- Ribbon -->
          <path d="M78 250 Q100 240 122 250" stroke="#86A789" stroke-width="1.5" stroke-linecap="round" fill="none"/>
          <path d="M89 250 Q100 258 111 250" stroke="#86A789" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        </svg>
        <p class="bouquet-msg">With all my love. 🌷</p>
        <br>
         <p class="bouquet-msg">I love You Tyl 🌷💚</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import confetti from 'canvas-confetti'
import ScrollEgg from './ScrollEgg.vue'

const blooming    = ref(false)
const showBouquet = ref(false)
const holding     = ref(false)
const holdProgress= ref(0)
const scrollEggRef= ref<InstanceType<typeof ScrollEgg> | null>(null)

let holdTimer: ReturnType<typeof setInterval> | null = null
let holdStart = 0

const HOLD_MS = 5000

/* ── Ring geometry ────────────────────────────────────────── */
const RING_C = 2 * Math.PI * 21  // circumference for r=21
const ringDashOffset = computed(() => RING_C * (1 - holdProgress.value))
const holdRingStyle  = computed(() => ({ opacity: holding.value ? 1 : 0 }))

/* ── Hold start/cancel ────────────────────────────────────── */
function startHold() {
  holding.value  = true
  holdProgress.value = 0
  holdStart = Date.now()

  holdTimer = setInterval(() => {
    const elapsed = Date.now() - holdStart
    holdProgress.value = Math.min(elapsed / HOLD_MS, 1)
    if (holdProgress.value >= 1) {
      cancelHold()
      scrollEggRef.value?.open()
    }
  }, 30)
}

function cancelHold() {
  if (holdTimer) { clearInterval(holdTimer); holdTimer = null }
  holding.value = false
  holdProgress.value = 0
}

async function bloom() {
  if (blooming.value) return
  blooming.value = true
  showBouquet.value = true

  const petalColors = ['#86A789', '#a8c4aa', '#6b8a6d', '#e8a0b0', '#f0b8c4', '#c8deca', '#b8a8d0']

  confetti({
    particleCount: 90,
    spread: 90,
    origin: { y: 0.55, x: 0.5 },
    colors: petalColors,
    startVelocity: 42,
    gravity: 0.85,
    scalar: 1.1,
    ticks: 230,
    shapes: ['circle', 'square'],
  })

  setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 60,
      origin: { x: 0.15, y: 0.6 },
      colors: petalColors,
      scalar: 0.9,
      ticks: 190,
    })
  }, 140)

  setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 60,
      origin: { x: 0.85, y: 0.6 },
      colors: petalColors,
      scalar: 0.9,
      ticks: 190,
    })
  }, 280)

  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 130,
      origin: { y: 0.05, x: 0.5 },
      colors: petalColors,
      startVelocity: 18,
      gravity: 0.55,
      scalar: 0.75,
      ticks: 300,
    })
  }, 480)

  setTimeout(() => {
    showBouquet.value = false
    blooming.value = false
  }, 3400)
}
</script>

<style scoped>
/* ── ANCHORED BOTTOM-LEFT ─────────────────────── */
.tulip-trigger-anchor {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

/* Wrap that houses button + ring overlay */
.hold-ring-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SVG ring overlay */
.hold-ring {
  position: absolute;
  inset: -2px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  transform: rotate(-90deg);
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 2;
}
.ring-track {
  fill: none;
  stroke: rgba(134, 167, 137, 0.18);
  stroke-width: 2.5;
}
.ring-fill {
  fill: none;
  stroke: #86A789;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: v-bind(RING_C);
  transition: stroke-dashoffset 0.04s linear;
}

.tulip-trigger-btn {
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
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.tulip-trigger-btn:hover {
  border-color: var(--sage);
  box-shadow: 0 4px 20px rgba(134, 167, 137, 0.28);
  transform: scale(1.08) translateY(-2px);
}

.tulip-trigger-btn.blooming {
  animation: bloomPulse 0.6s ease;
}

@keyframes bloomPulse {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.28) rotate(-8deg); }
  70%  { transform: scale(1.12) rotate(4deg); }
  100% { transform: scale(1); }
}

.tulip-hint {
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--ink-muted);
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.3s, transform 0.3s;
  white-space: nowrap;
}

.tulip-trigger-anchor:hover .tulip-hint {
  opacity: 1;
  transform: translateY(0);
}

/* ── Bouquet overlay — WITH BACKDROP BLUR ──────── */
.bouquet-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Frosted blur so the bouquet pops */
  background: rgba(250, 249, 246, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.bouquet-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: bouquetRise 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes bouquetRise {
  from { transform: translateY(45px) scale(0.78); opacity: 0; }
  to   { transform: translateY(0)    scale(1);    opacity: 1; }
}

.bouquet-msg {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-style: italic;
  color: var(--sage-dark);
  letter-spacing: 0.06em;
}

/* ── Transition ──────────────────────────────── */
.bouquet-fade-enter-active { transition: opacity 0.5s ease; }
.bouquet-fade-leave-active { transition: opacity 0.7s ease; }
.bouquet-fade-enter-from   { opacity: 0; }
.bouquet-fade-leave-to     { opacity: 0; }
</style>
