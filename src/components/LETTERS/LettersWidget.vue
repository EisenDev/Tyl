<template>
  <div class="letters-widget" role="region" aria-label="Special Letters">
    
    <!-- Letters List Popup -->
    <Transition name="picker-fade">
      <div v-if="showPopup" class="letters-picker" role="menu">
        <p class="picker-heading">Special Letters</p>
        
        <div v-if="unlockedLetters.length === 0" class="empty-state">
          <span class="empty-icon">⏳</span>
          <p>Patience, my love...</p>
          <p class="empty-sub">Letters will appear here when the time is right.</p>
        </div>

        <button
          v-for="letter in unlockedLetters"
          :key="letter.id"
          class="letter-option"
          role="menuitem"
          @click="openLetter(letter)"
        >
          <span class="letter-icon">{{ getIcon(letter.type) }}</span>
          <div class="letter-info">
            <span class="letter-name">{{ letter.title }}</span>
          </div>
        </button>
      </div>
    </Transition>

    <!-- The Toggle Button -->
    <button
      class="letters-toggle"
      :class="{ active: showPopup, 'has-updates': hasUnreadUpdates }"
      aria-label="Toggle Letters"
      title="Our Letters"
      @click.stop="showPopup = !showPopup"
    >
      <svg viewBox="0 0 24 24" fill="none" class="env-icon" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
      <!-- Small notification dot if there are new letters (just an aesthetic touch) -->
      <span v-if="hasUnreadUpdates" class="notify-dot"></span>
    </button>
  </div>

  <!-- Render the active letter overlay when selected -->
  <Teleport to="body">
    <Monthsary16 v-if="activeLetter?.id === 'm16'" @close="activeLetter = null" />
    <Birthday23 v-if="activeLetter?.id === 'b23'" @close="activeLetter = null" />
    <Anniv2 v-if="activeLetter?.id === 'a2'" @close="activeLetter = null" />
  </Teleport>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

import Monthsary16 from './MonthsaryLetters/Monthsary16.vue'
import Birthday23 from './BirthdayLetters/Birthday23.vue'
import Anniv2 from './AnnivLetters/Anniv2.vue'

interface LetterDef {
  id: string
  title: string
  dateStr: string
  type: 'monthsary' | 'birthday' | 'anniv'
}

const allLetters: LetterDef[] = [
  // Using Asia/Manila (GMT+8) timezones for exact midnight unveils
  { id: 'm16', title: '16th Monthsary', dateStr: '2026-03-18T00:00:00+08:00', type: 'monthsary' },
  { id: 'b23', title: '23rd Birthday', dateStr: '2026-03-28T00:00:00+08:00', type: 'birthday' },
  { id: 'a2', title: '2nd Anniversary', dateStr: '2027-11-18T00:00:00+08:00', type: 'anniv' }
]

const showPopup = ref(false)
const activeLetter = ref<LetterDef | null>(null)
const now = ref(new Date())

// Dynamic check so it can unlock exactly at midnight if they are browsing
let timer: ReturnType<typeof setInterval>
onMounted(() => {
  timer = setInterval(() => { now.value = new Date() }, 60000) // check every minute
  document.addEventListener('click', onOutsideClick)
})
onUnmounted(() => {
  clearInterval(timer)
  document.removeEventListener('click', onOutsideClick)
})

function onOutsideClick(e: MouseEvent) {
  if (showPopup.value && !(e.target as HTMLElement).closest('.letters-widget')) {
    showPopup.value = false
  }
}

const unlockedLetters = computed(() => {
  return allLetters.filter(l => now.value >= new Date(l.dateStr))
})

// Optional feature: track if they've seen the latest letters
const hasUnreadUpdates = computed(() => {
  return unlockedLetters.value.length > 0 && !showPopup.value // Just a simple logic for now
})

function getIcon(type: string) {
  if (type === 'anniv') return '💍'
  if (type === 'birthday') return '🎂'
  return '💐'
}



function openLetter(l: LetterDef) {
  activeLetter.value = l
  showPopup.value = false
}
</script>

<style scoped>
.letters-widget {
  position: fixed; 
  bottom: calc(2rem + 60px); /* Stacked exactly on top of the audio player */
  right: 2rem;
  z-index: 200; 
  display: flex; 
  align-items: flex-end; 
  flex-direction: column;
  gap: 0.8rem;
}

@media (max-width: 600px) {
  .letters-widget {
    bottom: calc(1.2rem + 55px);
    right: 1.2rem;
  }
}

/* Toggle Button */
.letters-toggle {
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(250, 249, 246, 0.92); border: 1px solid var(--parchment);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07); transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); flex-shrink: 0;
  position: relative;
}
.env-icon { 
  width: 18px; height: 18px; color: var(--ink-muted); 
  transition: color 0.3s, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
}
.letters-toggle:hover { border-color: var(--sage); box-shadow: 0 4px 20px rgba(134,167,137,0.28); }
.letters-toggle:hover .env-icon { color: var(--sage-dark); transform: scale(1.1) rotate(2deg); }
.letters-toggle.active { background: rgba(250, 249, 246, 0.98); border-color: var(--sage); }
.letters-toggle.active .env-icon { color: var(--sage-dark); }

.notify-dot {
  position: absolute;
  top: 9px; right: 9px;
  width: 8px; height: 8px;
  background: #e8a0b0;
  border-radius: 50%;
  border: 1.5px solid #faf9f6;
  animation: pulseDot 2s infinite;
}

@keyframes pulseDot {
  0% { box-shadow: 0 0 0 0 rgba(232, 160, 176, 0.6); }
  70% { box-shadow: 0 0 0 6px rgba(232, 160, 176, 0); }
  100% { box-shadow: 0 0 0 0 rgba(232, 160, 176, 0); }
}

/* Letters Picker Popup */
.letters-picker {
  position: absolute; bottom: calc(100% + 12px); right: 0;
  background: rgba(255, 255, 255, 0.97); border: 1px solid var(--parchment);
  border-radius: 14px; padding: 1rem 0.8rem 0.8rem; min-width: 250px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(134,167,137,0.08);
  backdrop-filter: blur(16px); z-index: 300;
  display: flex; flex-direction: column; gap: 0.3rem;
}

@media (max-width: 600px) {
  .letters-picker { min-width: 210px; }
}

.picker-heading {
  font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--sage); margin: 0 0 0.7rem 0.4rem; font-weight: 400;
}

.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 1.5rem 0.5rem; text-align: center; color: var(--ink-muted);
}
.empty-icon { font-size: 1.8rem; margin-bottom: 0.5rem; opacity: 0.7; }
.empty-state p { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-style: italic; margin: 0; }
.empty-sub { font-family: 'Inter', sans-serif !important; font-size: 0.7rem !important; opacity: 0.7; font-style: normal !important; margin-top: 0.3rem !important; }

.letter-option {
  display: flex; align-items: center; gap: 0.8rem; width: 100%; padding: 0.7rem 0.8rem;
  border-radius: 10px; border: none; background: transparent; cursor: pointer;
  transition: background 0.2s, transform 0.1s; text-align: left; color: var(--ink);
}
.letter-option:hover  { background: rgba(134, 167, 137, 0.08); transform: translateY(-1px); }
.letter-option:active { transform: translateY(0); }

.letter-icon { font-size: 1.3rem; flex-shrink: 0; }
.letter-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.letter-name { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.letter-date { font-size: 0.65rem; color: var(--ink-muted); letter-spacing: 0.05em; text-transform: uppercase; margin-top: 0.1rem; }

/* Picker transition */
.picker-fade-enter-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.picker-fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.picker-fade-enter-from   { opacity: 0; transform: translateY(8px) scale(0.97); }
.picker-fade-leave-to     { opacity: 0; transform: translateY(4px) scale(0.98); }
</style>
