<template>
  <section id="album" class="section album-section">

    <!-- ── 5 Background tulip decorations ──────────── -->
    <div class="abt abt--1" aria-hidden="true"><TulipSvg :size="100" :opacity="0.07" color="#86A789" /></div>
    <div class="abt abt--2" aria-hidden="true"><TulipSvg :size="75"  :opacity="0.065" color="#e8a0b0" /></div>
    <div class="abt abt--3" aria-hidden="true"><TulipSvg :size="60"  :opacity="0.06"  color="#b8a8d0" /></div>
    <div class="abt abt--4" aria-hidden="true"><TulipSvg :size="85"  :opacity="0.06"  color="#a8c4aa" /></div>
    <div class="abt abt--5" aria-hidden="true"><TulipSvg :size="50"  :opacity="0.07"  color="#d4a0a8" /></div>

    <!-- ── Header ──────────────────────────────────── -->
    <p class="section-label">II. The Visual Archive</p>
    <h2 class="section-title">
      Moments,<br />
      <em class="section-title-accent">pressed like flowers.</em>
    </h2>
    <div class="sage-divider" />
    <p class="album-note">
      {{ albums.length }} albums — click any to open it.
    </p>

    <!-- ── Loading state ───────────────────────────── -->
    <div v-if="loading" class="album-loading">
      <TulipSvg :size="40" :opacity="0.3" color="#86A789" />
      <span>gathering memories…</span>
    </div>

    <!-- ── Album Cover Grid ──────────────────────────── -->
    <div v-else class="album-grid">
      <div
        v-for="album in albums"
        :key="album.id"
        class="album-card"
        tabindex="0"
        role="button"
        :aria-label="`Open album: ${album.title}`"
        @click="openAlbum(album)"
        @keydown.enter="openAlbum(album)"
      >
        <!-- Cover polaroid -->
        <div class="polaroid-frame">
          <div class="polaroid-img-wrap">
            <img
              v-if="coverFor(album.id)"
              :src="coverFor(album.id)"
              :alt="album.title"
              loading="lazy"
              class="polaroid-img"
            />
            <div v-else class="polaroid-empty">
              <TulipSvg :size="32" :opacity="0.25" color="#86A789" />
            </div>
            <!-- Image count badge -->
            <div class="photo-count">{{ imageCount(album.id) }} 📷</div>
          </div>
          <!-- Album info below photo -->
          <div class="polaroid-info">
            <p class="polaroid-title">{{ album.title }}</p>
            <p v-if="album.subtitle" class="polaroid-sub">{{ album.subtitle }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── AlbumLightbox ─────────────────────────────── -->
    <AlbumLightbox :album="activeLightbox" @close="closeLightbox" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TulipSvg from './TulipSvg.vue'
import AlbumLightbox from './AlbumLightbox.vue'
import { ALBUMS, type AlbumMeta } from '../data/albums'

// ── Load all album images via Vite glob ─────────────────────────────────────
// import: 'default' collapses module objects → plain string URLs, fixes TS errors
const allGlob = import.meta.glob<string>(
  '/src/assets/albums/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
)

// Group resolved URLs by folder name
const imagesByAlbum = computed<Record<string, string[]>>(() => {
  const map: Record<string, string[]> = {}
  for (const [path, url] of Object.entries(allGlob)) {
    // path: /src/assets/albums/FOLDER/filename.jpg
    const parts = path.split('/')
    const folder = parts[parts.length - 2] // second-to-last segment
    if (!map[folder]) map[folder] = []
    map[folder].push(url)
  }
  // Sort alphabetically for consistent cover photo
  for (const folder in map) {
    map[folder].sort()
  }
  return map
})

// Only show albums that actually have images
const albums = computed(() =>
  ALBUMS.filter((a) => (imagesByAlbum.value[a.id]?.length ?? 0) > 0)
)

function coverFor(albumId: string): string | undefined {
  return imagesByAlbum.value[albumId]?.[0]
}

function imageCount(albumId: string): number {
  return imagesByAlbum.value[albumId]?.length ?? 0
}

// ── Lightbox state ───────────────────────────────────────────────────────────
interface LightboxPayload {
  meta: AlbumMeta
  images: string[]
  startIndex?: number
}

const activeLightbox = ref<LightboxPayload | null>(null)
const loading = ref(false)

function openAlbum(album: AlbumMeta) {
  const images = imagesByAlbum.value[album.id]
  if (!images?.length) return
  activeLightbox.value = { meta: album, images, startIndex: 0 }
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  activeLightbox.value = null
  document.body.style.overflow = ''
}
</script>

<style scoped>
.album-section {
  position: relative;
  overflow: hidden;
}

.section-title-accent {
  font-style: italic;
  color: var(--sage-dark);
}

.album-note {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  color: var(--ink-muted);
  font-style: italic;
  margin-top: 1rem;
  letter-spacing: 0.02em;
}

/* ── Loading ──────────────────────────────────── */
.album-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem 2rem;
  color: var(--ink-muted);
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-style: italic;
}

/* ── Album Masonry Grid ───────────────────────── */
.album-grid {
  columns: 3;
  column-gap: 1.4rem;
  margin-top: 3rem;
}
@media (max-width: 768px) { .album-grid { columns: 2; } }
@media (max-width: 480px) { .album-grid { columns: 1; } }

/* ── Polaroid Card ────────────────────────────── */
.album-card {
  break-inside: avoid;
  margin-bottom: 1.4rem;
  cursor: pointer;
  outline: none;
}

.polaroid-frame {
  background: #fff;
  border-radius: 18px;
  padding: 10px 10px 18px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 8px 28px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(134, 167, 137, 0.1);
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.35s ease;
  transform-origin: center bottom;
  overflow: hidden;
}

.album-card:hover .polaroid-frame,
.album-card:focus-visible .polaroid-frame {
  box-shadow:
    0 20px 56px rgba(0, 0, 0, 0.15),
    0 6px 16px rgba(134, 167, 137, 0.12);
}

/* Alternate subtle tilt on hover */
.album-card:nth-child(odd):hover  .polaroid-frame { transform: scale(1.035) rotate(-1.2deg); }
.album-card:nth-child(even):hover .polaroid-frame { transform: scale(1.035) rotate(0.9deg); }

/* ── Image area ───────────────────────────────── */
.polaroid-img-wrap {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: var(--parchment);
  line-height: 0;
}

.polaroid-img {
  width: 100%;
  display: block;
  object-fit: cover;
  aspect-ratio: 4/3;
  transition: transform 0.5s ease;
}

.album-card:hover .polaroid-img {
  transform: scale(1.045);
}

/* Photo count badge */
.photo-count {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(250, 249, 246, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: var(--ink-muted);
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Empty album cover */
.polaroid-empty {
  width: 100%;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Album info ───────────────────────────────── */
.polaroid-info {
  padding: 10px 4px 2px;
  text-align: center;
}

.polaroid-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem;
  color: var(--ink);
  margin: 0;
  letter-spacing: 0.04em;
  font-weight: 500;
}

.polaroid-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.75rem;
  color: var(--ink-muted);
  font-style: italic;
  margin: 3px 0 0;
  letter-spacing: 0.02em;
}

/* ── Background tulip positions ───────────────── */
.abt {
  position: absolute;
  pointer-events: none;
  user-select: none;
}
.abt--1 { top: 2rem;   right: -1rem;    transform: rotate(10deg); }
.abt--2 { top: 8rem;   left: -1.5rem;   transform: rotate(-20deg) scaleX(-1); }
.abt--3 { top: 42%;    right: -0.5rem;  transform: rotate(24deg); }
.abt--4 { bottom: 20%; left: -1rem;     transform: rotate(-8deg); }
.abt--5 { bottom: 5%;  right: 1.5rem;   transform: rotate(-14deg) scaleX(-1); }
</style>
