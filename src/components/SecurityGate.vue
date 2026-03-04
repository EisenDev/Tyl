<template>
  <div class="gate-wrapper">
    <!-- Ambient tulip decorations — multi-color -->
    <div class="gate-tulip gate-tulip--1" aria-hidden="true">
      <TulipSvg :size="90" :opacity="0.09" color="#86A789" />
    </div>
    <div class="gate-tulip gate-tulip--2" aria-hidden="true">
      <TulipSvg :size="70" :opacity="0.08" color="#e8a0b0" />
    </div>
    <div class="gate-tulip gate-tulip--3" aria-hidden="true">
      <TulipSvg :size="55" :opacity="0.07" color="#b8a8d0" />
    </div>
    <div class="gate-tulip gate-tulip--4" aria-hidden="true">
      <TulipSvg :size="65" :opacity="0.07" color="#d4a0a8" />
    </div>
    <div class="gate-tulip gate-tulip--5" aria-hidden="true">
      <TulipSvg :size="45" :opacity="0.06" color="#86A789" />
    </div>

    <!-- Brand -->
    <div class="gate-subtitle">a personal space</div>
    <h1 class="gate-title">To my beloved</h1>
    <div class="sage-divider" style="margin: 0 auto;" />

    <!-- Passphrase input -->
    <div class="gate-input-wrapper">
      <input
        id="gate-passphrase"
        ref="inputRef"
        v-model="passphrase"
        type="password"
        placeholder="enter the passphrase"
        class="gate-input"
        :class="{ glowing: isCorrect }"
        autocomplete="off"
        spellcheck="false"
        @input="checkPassphrase"
        @keydown.enter="tryUnlock"
      />
      <p class="gate-hint">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import TulipSvg from './TulipSvg.vue'

const emit = defineEmits<{
  (e: 'unlock'): void
  (e: 'autoplay'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const passphrase = ref('')
const isCorrect = ref(false)
const hint = ref('')

const SECRET = 'trust yearning love'

onMounted(() => nextTick(() => inputRef.value?.focus()))

function checkPassphrase() {
  if (passphrase.value.toLowerCase().trim() === SECRET) {
    isCorrect.value = true
    hint.value = ''
    // Emit autoplay IMMEDIATELY (inside user gesture context) so audio can start
    emit('autoplay')
    setTimeout(() => emit('unlock'), 900)
  } else {
    isCorrect.value = false
  }
}

function tryUnlock() {
  if (!isCorrect.value) {
    hint.value = 'not quite, my love...'
    setTimeout(() => { hint.value = '' }, 2000)
  }
}
</script>

<style scoped>
/* Tulip decorations — animated float */
.gate-tulip {
  position: absolute;
  pointer-events: none;
  user-select: none;
  animation: floatTulip 9s ease-in-out infinite;
}

.gate-tulip--1 { top: 8%;  left: 6%;   transform: rotate(-12deg); animation-duration: 8s;   animation-delay: 0s; }
.gate-tulip--2 { top: 10%; right: 5%;  transform: rotate(10deg);  animation-duration: 10s;  animation-delay: 1.5s; }
.gate-tulip--3 { bottom: 12%; left: 12%; transform: rotate(20deg);  animation-duration: 7.5s; animation-delay: 3s; }
.gate-tulip--4 { bottom: 10%; right: 10%; transform: rotate(-8deg); animation-duration: 11s;  animation-delay: 0.8s; }
.gate-tulip--5 { top: 50%; left: 3%;   transform: rotate(15deg);  animation-duration: 9s;   animation-delay: 4s; }

@keyframes floatTulip {
  0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
  50%       { transform: translateY(-16px) rotate(calc(var(--r, 0deg) + 6deg)); }
}

.gate-hint {
  text-align: center;
  font-size: 0.72rem;
  color: #c09b8f;
  letter-spacing: 0.12em;
  margin-top: 0.8rem;
  height: 1rem;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  transition: opacity 0.3s;
}
</style>
