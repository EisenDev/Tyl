<template>
  <!-- Security Gate -->
  <Transition name="gate-bloom">
    <SecurityGate
      v-if="!unlocked"
      @unlock="handleUnlock"
      @autoplay="handleAutoplay"
    />
  </Transition>

  <!-- Main Site -->
  <Transition name="main-bloom">
    <div v-if="unlocked" class="site-root">
      <!-- Scroll Progress -->
      <div class="scroll-progress" :style="{ width: scrollProgress + '%' }" />

      <!-- Floating Tulip (parallax) -->
      <FloatingTulip />

      <!-- Navigation -->
      <SiteNav />

      <!-- Audio player — passes pending flag so it auto-plays on mount -->
      <AudioPlayer ref="audioPlayerRef" :pending-auto-play="pendingAutoPlay" />

      <!-- Tulip confetti trigger — bottom-left -->
      <TulipConfetti />

      <!-- Main Content -->
      <main>
        <NarrativeSection />
        <AlbumSection />
      </main>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import SecurityGate from './components/SecurityGate.vue'
import FloatingTulip from './components/FloatingTulip.vue'
import SiteNav from './components/SiteNav.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import TulipConfetti from './components/TulipConfetti.vue'
import NarrativeSection from './components/NarrativeSection.vue'
import AlbumSection from './components/AlbumSection.vue'

const unlocked = ref(false)
const scrollProgress = ref(0)
const pendingAutoPlay = ref(false)
const audioPlayerRef = ref<InstanceType<typeof AudioPlayer> | null>(null)

function handleUnlock() {
  unlocked.value = true
}

// Called synchronously within the user-gesture input handler — safe for autoplay
function handleAutoplay() {
  pendingAutoPlay.value = true
  // If AudioPlayer is already mounted (already unlocked somehow), trigger directly
  audioPlayerRef.value?.startFade()
}

function onScroll() {
  const el = document.documentElement
  const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
  scrollProgress.value = isNaN(pct) ? 0 : pct
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
