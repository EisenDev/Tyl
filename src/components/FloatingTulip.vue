<template>
  <div
    class="tulip-parallax tulip-interactive"
    :style="{ transform: `translate(${tx}px, ${ty}px)`, top: '15vh', right: '6vw' }"
    aria-hidden="true"
    role="button"
    tabindex="0"
    @click="watcherEggRef?.open()"
  >
    <img src="/tulip.svg" alt="" width="90" height="112" />
  </div>

  <WatcherEgg ref="watcherEggRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import WatcherEgg from './WatcherEgg.vue'

const tx = ref(0)
const ty = ref(0)
const watcherEggRef = ref<InstanceType<typeof WatcherEgg> | null>(null)

function onMouseMove(e: MouseEvent) {
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  tx.value = (e.clientX - cx) / cx * -12
  ty.value = (e.clientY - cy) / cy * -10
}

onMounted(() => window.addEventListener('mousemove', onMouseMove))
onUnmounted(() => window.removeEventListener('mousemove', onMouseMove))
</script>

<style scoped>
.tulip-parallax {
  position: fixed;
  z-index: 50;
  pointer-events: none;
}
.tulip-interactive {
  pointer-events: all !important;
  cursor: pointer;
  transition: filter 0.2s ease;
}
.tulip-interactive:hover {
  filter: drop-shadow(0 4px 12px rgba(134,167,137,0.3)) scale(1.05);
}
</style>
