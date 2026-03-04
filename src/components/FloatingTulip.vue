<template>
  <div
    class="tulip-parallax"
    :style="{ transform: `translate(${tx}px, ${ty}px)`, top: '15vh', right: '6vw' }"
    aria-hidden="true"
  >
    <img src="/tulip.svg" alt="" width="90" height="112" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const tx = ref(0)
const ty = ref(0)

function onMouseMove(e: MouseEvent) {
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  tx.value = (e.clientX - cx) / cx * -12
  ty.value = (e.clientY - cy) / cy * -10
}

onMounted(() => window.addEventListener('mousemove', onMouseMove))
onUnmounted(() => window.removeEventListener('mousemove', onMouseMove))
</script>
