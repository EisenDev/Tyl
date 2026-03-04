<template>
  <Transition name="lb-fade">
    <div
      v-if="props.album"
      class="lb-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="`Viewing album: ${props.album.meta.title}`"
      @click.self="close"
    >
      <!-- Header bar -->
      <div class="lb-header">
        <div class="lb-album-info">
          <p class="lb-album-title">{{ props.album.meta.title }}</p>
          <p v-if="props.album.meta.subtitle" class="lb-album-sub">{{ props.album.meta.subtitle }}</p>
        </div>
        <div class="lb-counter">{{ currentIndex + 1 }} / {{ props.album.images.length }}</div>
        <button class="lb-close" aria-label="Close" @click="close">✕</button>
      </div>

      <!-- Image stage -->
      <div class="lb-stage">
        <!-- Previous button -->
        <button
          class="lb-nav lb-nav--prev"
          :disabled="currentIndex === 0"
          aria-label="Previous photo"
          @click="prev"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <!-- The photo — Transition between images -->
        <Transition :name="slideDir" mode="out-in">
          <div :key="currentIndex" class="lb-photo-wrap">
            <img
              class="lb-photo"
              :src="currentImage"
              :alt="`${props.album.meta.title} photo ${currentIndex + 1}`"
              @load="onLoad"
            />
          </div>
        </Transition>

        <!-- Next button -->
        <button
          class="lb-nav lb-nav--next"
          :disabled="currentIndex === props.album.images.length - 1"
          aria-label="Next photo"
          @click="next"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <!-- Thumbnail strip -->
      <div class="lb-filmstrip">
        <button
          v-for="(img, i) in props.album.images"
          :key="i"
          class="lb-thumb"
          :class="{ active: i === currentIndex }"
          @click="goTo(i)"
        >
          <img :src="img" :alt="`thumb ${i + 1}`" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { AlbumMeta } from '../data/albums'

interface AlbumPayload {
  meta: AlbumMeta
  images: string[]
  startIndex?: number
}

const props = defineProps<{ album: AlbumPayload | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const currentIndex = ref(0)
const slideDir = ref<'slide-left' | 'slide-right'>('slide-left')

const currentImage = computed(() => props.album?.images[currentIndex.value] ?? '')

watch(() => props.album, (album) => {
  if (album) {
    currentIndex.value = album.startIndex ?? 0
  }
})

function close() { emit('close') }

function prev() {
  if (currentIndex.value > 0) {
    slideDir.value = 'slide-right'
    currentIndex.value--
  }
}

function next() {
  if (props.album && currentIndex.value < props.album.images.length - 1) {
    slideDir.value = 'slide-left'
    currentIndex.value++
  }
}

function goTo(i: number) {
  slideDir.value = i > currentIndex.value ? 'slide-left' : 'slide-right'
  currentIndex.value = i
}

function onLoad() { /* noop — could add loading state */ }

function onKeydown(e: KeyboardEvent) {
  if (!props.album) return
  if (e.key === 'ArrowLeft')  prev()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'Escape')     close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* ── Overlay ─────────────────────────────────────── */
.lb-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 20, 18, 0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

/* ── Header ──────────────────────────────────────── */
.lb-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.4rem 2rem;
  flex-shrink: 0;
}

.lb-album-info { flex: 1; }

.lb-album-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: rgba(250, 249, 246, 0.92);
  letter-spacing: 0.06em;
  margin: 0;
}

.lb-album-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--sage-light);
  letter-spacing: 0.04em;
  margin: 0.2rem 0 0;
}

.lb-counter {
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(250, 249, 246, 0.45);
  white-space: nowrap;
}

.lb-close {
  background: none;
  border: none;
  color: rgba(250, 249, 246, 0.6);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.lb-close:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(250, 249, 246, 0.95);
}

/* ── Image Stage ─────────────────────────────────── */
.lb-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0 1rem;
  min-height: 0;
  overflow: hidden;
}

.lb-photo-wrap {
  flex: 1;
  max-width: 860px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.lb-photo {
  max-width: 100%;
  max-height: calc(100vh - 200px);
  object-fit: contain;
  border-radius: 12px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.06),
    0 32px 80px rgba(0, 0, 0, 0.55),
    0 8px 24px rgba(0, 0, 0, 0.35);
  display: block;
}

/* ── Nav Buttons ─────────────────────────────────── */
.lb-nav {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  color: rgba(250, 249, 246, 0.7);
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s, color 0.25s, transform 0.2s;
}

.lb-nav:hover:not(:disabled) {
  background: rgba(134, 167, 137, 0.2);
  border-color: var(--sage);
  color: var(--sage-light);
  transform: scale(1.08);
}

.lb-nav:disabled {
  opacity: 0.18;
  cursor: default;
}

/* ── Filmstrip ───────────────────────────────────── */
.lb-filmstrip {
  display: flex;
  gap: 6px;
  padding: 0.8rem 2rem 1.2rem;
  overflow-x: auto;
  justify-content: center;
  flex-shrink: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(134, 167, 137, 0.4) transparent;
}

.lb-thumb {
  width: 54px;
  height: 54px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  background: none;
  transition: border-color 0.2s, transform 0.2s, opacity 0.2s;
  opacity: 0.45;
}

.lb-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lb-thumb:hover {
  opacity: 0.8;
  transform: scale(1.06);
}

.lb-thumb.active {
  border-color: var(--sage);
  opacity: 1;
  transform: scale(1.1);
}

/* ── Overlay transition ──────────────────────────── */
.lb-fade-enter-active,
.lb-fade-leave-active { transition: opacity 0.35s ease; }
.lb-fade-enter-from,
.lb-fade-leave-to { opacity: 0; }

/* ── Slide transitions ───────────────────────────── */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.slide-left-enter-from  { opacity: 0; transform: translateX(40px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-40px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(40px); }
</style>
