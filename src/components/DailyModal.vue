<template>
  <Transition name="daily-fade">
    <div
      v-if="open"
      class="daily-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Daily word"
      @click.self="close"
    >
      <div class="daily-modal">

        <!-- Tulip accents -->
        <div class="dm-tulip dm-tl" aria-hidden="true">
          <TulipSvg :size="70" :opacity="0.09" color="#86A789" />
        </div>
        <div class="dm-tulip dm-tr" aria-hidden="true">
          <TulipSvg :size="55" :opacity="0.08" color="#e8a0b0" />
        </div>
        <div class="dm-tulip dm-br" aria-hidden="true">
          <TulipSvg :size="50" :opacity="0.07" color="#b8a8d0" />
        </div>

        <!-- Close -->
        <button class="dm-close" aria-label="Close" @click="close">✕</button>

        <!-- Header -->
        <p class="dm-eyebrow">Today's Word</p>
        <p class="dm-date">{{ phDate }}</p>
        <div class="dm-divider" />

        <!-- Loading -->
        <div v-if="loading" class="dm-loading">
          <TulipSvg :size="28" :opacity="0.3" color="#86A789" />
          <span>gathering today's words…</span>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="dm-error">
          <p>{{ error }}</p>
        </div>

        <!-- Content -->
        <div v-else class="dm-content">
          <!-- Bible Verse -->
          <div class="dm-verse-wrap">
            <p class="dm-section-label">📖 Scripture</p>
            <blockquote class="dm-verse-text">"{{ content.verse.text }}"</blockquote>
            <p class="dm-verse-ref">— {{ content.verse.reference }}</p>
          </div>

          <!-- Quote -->
          <div class="dm-quote-wrap">
            <p class="dm-section-label">💬 For Today</p>
            <p class="dm-quote">{{ content.quote }}</p>
          </div>
        </div>

        <!-- Wax seal -->
        <div class="dm-seal" aria-hidden="true">
          <svg viewBox="0 0 36 36" width="36" height="36">
            <circle cx="18" cy="18" r="16" fill="#86A789" opacity="0.12"/>
            <circle cx="18" cy="18" r="10" fill="#86A789" opacity="0.2"/>
            <circle cx="18" cy="18" r="5"  fill="#86A789" opacity="0.28"/>
          </svg>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import TulipSvg from './TulipSvg.vue'

const props = defineProps<{ open: boolean }>()
const emit  = defineEmits<{ (e: 'update:open', v: boolean): void }>()

function close() { emit('update:open', false) }

/* ── Philippine date (GMT+8) ───────────────────────────────────── */
const phDate    = ref('')
const dateParam = ref('')   // YYYY-MM-DD  used as API param + cache key

function computePhDate() {
  const now = new Date()
  // Shift to Asia/Manila (UTC+8)
  const ph  = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }))
  const mm  = String(ph.getMonth() + 1).padStart(2, '0')
  const dd  = String(ph.getDate()).padStart(2, '0')
  const yyyy = ph.getFullYear()
  phDate.value    = `${mm}/${dd}/${yyyy}`
  dateParam.value = `${mm}-${dd}-${yyyy}`
}

/* ── Daily content ─────────────────────────────────────────────── */
interface DailyContent {
  verse: { text: string; reference: string }
  quote: string
}

const content = ref<DailyContent>({
  verse: { text: '', reference: '' },
  quote: '',
})
const loading = ref(false)
const error   = ref('')

async function fetchDaily() {
  computePhDate()
  const cacheKey = `daily-v6-${dateParam.value}`
  const cached   = localStorage.getItem(cacheKey)

  if (cached) {
    try { content.value = JSON.parse(cached); return } catch { /* stale */ }
  }

  loading.value = true
  error.value   = ''
  try {
    const res  = await fetch(`/api/daily?date=${dateParam.value}&v=6`)
    const data = await res.json()
    if (data.verse && data.quote) {
      content.value = data
      localStorage.setItem(cacheKey, JSON.stringify(data))
    } else {
      throw new Error('malformed response')
    }
  } catch {
    error.value = "Could not load today's word. Please try again."
  } finally {
    loading.value = false
  }
}

/* Fetch when opened, lazy */
watch(() => props.open, (v) => { if (v && !content.value.verse.text) fetchDaily() })
onMounted(computePhDate)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) close()
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* ── Overlay ─────────────────────────────────────────────── */
.daily-overlay {
  position: fixed;
  inset: 0;
  background: rgba(245, 243, 238, 0.9);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* ── Modal card ─────────────────────────────────────────── */
.daily-modal {
  position: relative;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid var(--parchment);
  border-radius: 22px;
  max-width: 520px;
  width: 100%;
  padding: 3rem 3rem 2.4rem;
  box-shadow:
    0 28px 80px rgba(0, 0, 0, 0.09),
    0 4px 16px rgba(134, 167, 137, 0.08);
  overflow: hidden;
}

/* Tulip corners */
.dm-tulip { position: absolute; pointer-events: none; }
.dm-tl { top: -10px; left: -8px;    transform: rotate(-14deg); }
.dm-tr { top: -8px;  right: -6px;   transform: rotate(18deg) scaleX(-1); }
.dm-br { bottom: -8px; right: -6px; transform: rotate(-10deg) scaleX(-1); }

/* Close */
.dm-close {
  position: absolute; top: 1.2rem; right: 1.4rem;
  background: none; border: none; font-size: 1rem;
  color: var(--ink-muted); cursor: pointer;
  padding: 0.3rem 0.4rem; border-radius: 4px;
  transition: color 0.2s; z-index: 2;
}
.dm-close:hover { color: var(--ink); }

/* Header */
.dm-eyebrow {
  font-size: 0.6rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--sage);
  margin: 0 0 0.5rem;
  font-weight: 400;
  position: relative;
  z-index: 2;
}

.dm-date {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--ink);
  margin: 0 0 1.2rem;
  position: relative;
  z-index: 2;
}

.dm-divider {
  height: 1px;
  background: var(--parchment);
  margin-bottom: 1.8rem;
}

/* Loading */
.dm-loading {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  font-style: italic;
  color: var(--ink-muted);
  padding: 1rem 0 2rem;
}

.dm-error { color: #c09b8f; font-size: 0.9rem; padding: 1rem 0; }

/* Content */
.dm-content {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  position: relative;
  z-index: 2;
}

.dm-section-label {
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin: 0 0 0.7rem;
  font-weight: 400;
}

/* Bible verse */
.dm-verse-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-style: italic;
  line-height: 1.85;
  color: var(--ink);
  margin: 0 0 0.5rem;
  padding-left: 1rem;
  border-left: 2px solid var(--sage-light);
}

.dm-verse-ref {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--sage);
  margin: 0;
  padding-left: 1rem;
}

/* Daily quote */
.dm-quote {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1rem, 2vw, 1.15rem);
  line-height: 1.8;
  color: var(--ink-muted);
  margin: 0;
}

/* Seal */
.dm-seal {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.6rem;
  position: relative;
  z-index: 2;
}

/* ── Transitions ─────────────────────────────────────────── */
.daily-fade-enter-active { transition: opacity 0.35s ease; }
.daily-fade-leave-active { transition: opacity 0.28s ease; }
.daily-fade-enter-from   { opacity: 0; }
.daily-fade-leave-to     { opacity: 0; }

.daily-fade-enter-active .daily-modal {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
}
.daily-fade-enter-from .daily-modal {
  transform: scale(0.94) translateY(12px);
  opacity: 0;
}

/* ── Mobile ──────────────────────────────────────────────── */
@media (max-width: 600px) {
  .daily-modal { padding: 2.4rem 1.8rem 2rem; }
  .dm-date { font-size: 1.7rem; }
}
</style>
