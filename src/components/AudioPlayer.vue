<template>
  <!-- Hidden YouTube player containers (1px off-screen so browser allows play) -->
  <div
    v-for="track in tracks"
    :key="track.id"
    :id="`yt-${track.id}`"
    class="yt-hidden"
    aria-hidden="true"
  />

  <div class="audio-player" role="region" aria-label="Background music">

    <!-- Track picker popup — appears above player -->
    <Transition name="picker-fade">
      <div v-if="showPicker" class="track-picker" role="menu">
        <p class="picker-heading">Choose a song</p>
        <button
          v-for="track in tracks"
          :key="track.id"
          class="track-option"
          :class="{ active: activeTrackId === track.id }"
          role="menuitem"
          @click="selectTrack(track.id)"
        >
          <span class="track-icon">{{ track.icon }}</span>
          <span class="track-name">{{ track.label }}</span>
          <span v-if="activeTrackId === track.id" class="track-check">✓</span>
        </button>
      </div>
    </Transition>

    <!-- Hover label -->
    <span class="audio-label">
      {{ isPlaying ? (currentTrack?.label ?? 'Playing') : 'Music' }}
    </span>

    <!-- Frequency visualizer -->
    <div class="audio-visualizer" :class="{ playing: isPlaying }" aria-hidden="true">
      <span v-for="n in 5" :key="n" class="viz-bar" :style="{ '--i': n }" />
    </div>

    <!-- Play/Pause toggle -->
    <button
      id="audio-toggle-btn"
      class="audio-toggle"
      :aria-label="isPlaying ? 'Pause music' : 'Play music'"
      :title="isPlaying ? 'Pause' : 'Play'"
      @click="toggleAudio"
    >
      <svg v-if="isPlaying" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <line x1="23" y1="9" x2="17" y2="15"/>
        <line x1="17" y1="9" x2="23" y2="15"/>
      </svg>
    </button>

    <!-- Track selector button -->
    <button
      id="audio-track-btn"
      class="track-btn"
      :class="{ active: showPicker }"
      aria-label="Select song"
      title="Switch song"
      @click.stop="showPicker = !showPicker"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
           width="14" height="14">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

/* ── Track definitions ─────────────────────────────────────────────── */
interface Track {
  id: string
  label: string
  icon: string
  videoId: string
  startSeconds: number
}

const tracks: Track[] = [
  {
    id: 'piano',
    label: 'Piano Only',
    icon: '🎹',
    videoId: 'jNolxknUYoE',
    startSeconds: 23,       // start at 0:23
  },
  {
    id: 'thousand',
    label: 'A Thousand Years',
    icon: '🌹',
    videoId: '5ptdEemGjrQ',
    startSeconds: 0,         // intro to end, looped
  },
]

/* ── Props / state ─────────────────────────────────────────────────── */
const props = defineProps<{ pendingAutoPlay?: boolean }>()

const isPlaying     = ref(false)
const showPicker    = ref(false)
const activeTrackId = ref<string>('piano')   // default to Piano
const pendingStart  = ref(false)             // set true if player not ready yet

const currentTrack = computed(() => tracks.find(t => t.id === activeTrackId.value))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const players: Record<string, any> = {}
let fadeTimer: ReturnType<typeof setInterval> | null = null

/* ── YouTube IFrame API ────────────────────────────────────────────── */
function loadYTApi() {
  if ((window as any).YT?.Player) {
    initPlayers()
    return
  }
  const prevReady = (window as any).onYouTubeIframeAPIReady
  ;(window as any).onYouTubeIframeAPIReady = () => {
    if (prevReady) prevReady()
    initPlayers()
  }
  if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  }
}

function initPlayers() {
  const YT = (window as any).YT
  tracks.forEach((track) => {
    players[track.id] = new YT.Player(`yt-${track.id}`, {
      height: '1',
      width: '1',
      videoId: track.videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        start: track.startSeconds,
        loop: 1,
        playlist: track.videoId,   // needed for loop to work
        rel: 0,
        fs: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (event: any) => {
          event.target.setVolume(0)
          // If startFade was called before this player was ready
          if (pendingStart.value && track.id === activeTrackId.value) {
            pendingStart.value = false
            playTrack(track.id)
          }
        },
      },
    })
  })
}

/* ── Volume fade ───────────────────────────────────────────────────── */
function clearFade() {
  if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null }
}

function fadeInPlayer(trackId: string, targetVol = 55, durationMs = 2800) {
  clearFade()
  const p = players[trackId]
  if (!p) return
  p.setVolume(0)
  const steps  = 40
  const stepMs = durationMs / steps
  const stepV  = targetVol / steps
  let step = 0
  fadeTimer = setInterval(() => {
    step++
    try { p.setVolume(Math.min(stepV * step, targetVol)) } catch {}
    if (step >= steps) clearFade()
  }, stepMs)
}

/* ── Play a track ──────────────────────────────────────────────────── */
function playTrack(trackId: string) {
  const p = players[trackId]
  const track = tracks.find(t => t.id === trackId)!
  if (!p || typeof p.playVideo !== 'function') {
    // Player not initialised yet — set pending flag
    pendingStart.value = true
    return
  }
  try {
    p.seekTo(track.startSeconds, true)
    p.playVideo()
    isPlaying.value = true
    fadeInPlayer(trackId)
  } catch {
    pendingStart.value = true
  }
}

/* ── Exposed: App.vue calls this after passphrase unlock ───────────── */
function startFade() {
  if (isPlaying.value) return
  playTrack(activeTrackId.value)
}
defineExpose({ startFade })

/* ── Track selection ───────────────────────────────────────────────── */
function selectTrack(id: string) {
  const prev = activeTrackId.value
  if (prev === id) { showPicker.value = false; return }

  // Fade out and stop previous
  if (isPlaying.value && players[prev]) {
    clearFade()
    try { players[prev].pauseVideo(); players[prev].setVolume(0) } catch {}
    isPlaying.value = false
  }

  activeTrackId.value = id
  showPicker.value = false

  // Auto-play the newly selected track
  playTrack(id)
}

/* ── Toggle play/pause ─────────────────────────────────────────────── */
function toggleAudio() {
  if (isPlaying.value) {
    clearFade()
    const p = players[activeTrackId.value]
    try { if (p) { p.pauseVideo(); p.setVolume(0) } } catch {}
    isPlaying.value = false
  } else {
    playTrack(activeTrackId.value)
  }
}

/* ── Close picker on outside click ────────────────────────────────── */
function onOutsideClick(e: MouseEvent) {
  if (showPicker.value && !(e.target as HTMLElement).closest('.audio-player, .track-btn')) {
    showPicker.value = false
  }
}

/* ── Lifecycle ─────────────────────────────────────────────────────── */
onMounted(() => {
  loadYTApi()
  pendingStart.value = !!props.pendingAutoPlay
  document.addEventListener('click', onOutsideClick)
})

onUnmounted(() => {
  clearFade()
  Object.values(players).forEach((p: any) => { try { p.destroy() } catch {} })
  document.removeEventListener('click', onOutsideClick)
})
</script>

<style scoped>
/* Hidden YouTube containers — off-screen but present for browser autoplay */
.yt-hidden {
  position: fixed;
  left: -4px;
  top: -4px;
  width: 1px;
  height: 1px;
  pointer-events: none;
  opacity: 0;
  z-index: -1;
}

/* ── Player row ────────────────────────────────────────────────────── */
.audio-player {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Hover-reveal label */
.audio-label {
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-muted);
  opacity: 0;
  transform: translateX(6px);
  transition: opacity 0.3s, transform 0.3s;
  white-space: nowrap;
  pointer-events: none;
}
.audio-player:hover .audio-label { opacity: 1; transform: translateX(0); }

/* ── Visualizer ────────────────────────────────────────────────────── */
.audio-visualizer {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 18px;
}
.viz-bar {
  display: block;
  width: 3px;
  border-radius: 2px;
  background: var(--sage-light);
  height: 4px;
  transform-origin: bottom;
}
.audio-visualizer:not(.playing) .viz-bar {
  height: calc(3px + var(--i) * 1px);
  opacity: 0.35;
}
.audio-visualizer.playing .viz-bar {
  background: var(--sage);
  animation: vizPulse ease-in-out infinite alternate;
  animation-duration: calc(0.55s + var(--i) * 0.12s);
  animation-delay: calc(var(--i) * 0.08s);
}
@keyframes vizPulse { from { height: 3px; } to { height: 16px; } }

/* ── Toggle button ─────────────────────────────────────────────────── */
.audio-toggle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(250, 249, 246, 0.92);
  border: 1px solid var(--parchment);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  transition: border-color 0.3s, box-shadow 0.3s;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  flex-shrink: 0;
}
.audio-toggle svg { width: 17px; height: 17px; color: var(--ink-muted); transition: color 0.3s; }
.audio-toggle:hover { border-color: var(--sage); box-shadow: 0 4px 20px rgba(134,167,137,0.28); }
.audio-toggle:hover svg { color: var(--sage-dark); }

/* ── Track selector button ─────────────────────────────────────────── */
.track-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(250, 249, 246, 0.88);
  border: 1px solid var(--parchment);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  flex-shrink: 0;
}
.track-btn:hover,
.track-btn.active {
  border-color: var(--sage);
  box-shadow: 0 3px 14px rgba(134,167,137,0.25);
  background: rgba(250, 249, 246, 0.97);
}
.track-btn svg { color: var(--ink-muted); transition: color 0.25s; }
.track-btn:hover svg, .track-btn.active svg { color: var(--sage-dark); }

/* ── Track picker popup ────────────────────────────────────────────── */
.track-picker {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid var(--parchment);
  border-radius: 14px;
  padding: 1rem 0.8rem 0.8rem;
  min-width: 220px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(134,167,137,0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 300;
}

.picker-heading {
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--sage);
  margin: 0 0 0.7rem 0.4rem;
  font-weight: 400;
}

.track-option {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  padding: 0.65rem 0.7rem;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
  color: var(--ink);
}
.track-option:hover { background: rgba(134, 167, 137, 0.08); }
.track-option.active { background: rgba(134, 167, 137, 0.12); }

.track-icon { font-size: 1.1rem; flex-shrink: 0; }
.track-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem;
  flex: 1;
  letter-spacing: 0.02em;
}
.track-check {
  color: var(--sage);
  font-size: 0.85rem;
  font-weight: 600;
}

/* ── Picker transition ─────────────────────────────────────────────── */
.picker-fade-enter-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.picker-fade-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.picker-fade-enter-from { opacity: 0; transform: translateY(8px) scale(0.97); }
.picker-fade-leave-to   { opacity: 0; transform: translateY(4px) scale(0.98); }

/* ── Mobile responsive ─────────────────────────────────────────────── */
@media (max-width: 600px) {
  .audio-player { bottom: 1.2rem; right: 1.2rem; gap: 0.4rem; }
  .audio-toggle { width: 40px; height: 40px; }
  .track-btn    { width: 28px; height: 28px; }
  .track-picker { min-width: 190px; }
}
</style>
