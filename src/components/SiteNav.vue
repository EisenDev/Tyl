<template>
  <nav class="site-nav" role="navigation" aria-label="Main" @click.self="menuOpen = false">
    <a href="#" class="nav-brand" @click.prevent="onBrandClick">To My Beloved</a>

    <!-- Centre: Philippine date — clickable -->
    <button
      id="nav-date-btn"
      class="nav-date"
      :title="`Open today's word — ${phDate}`"
      @click="dailyOpen = true"
    >
      <svg class="nav-date-icon" viewBox="0 0 16 16" width="13" height="13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <ellipse cx="8" cy="4"  rx="1.8" ry="3.2" fill="#86A789" opacity="0.55"/>
        <ellipse cx="8" cy="12" rx="1.8" ry="3.2" fill="#86A789" opacity="0.55"/>
        <ellipse cx="4"  cy="8" rx="3.2" ry="1.8" fill="#86A789" opacity="0.55"/>
        <ellipse cx="12" cy="8" rx="3.2" ry="1.8" fill="#86A789" opacity="0.55"/>
        <circle  cx="8"  cy="8" r="2.2"            fill="#86A789" opacity="0.82"/>
      </svg>
      <span class="nav-date-text">{{ phDate }}</span>
    </button>

    <!-- Desktop nav links -->
    <ul class="nav-links">
      <li><a href="#narrative">The Letter</a></li>
      <li><a href="#album">The Archive</a></li>
    </ul>

    <!-- Mobile hamburger -->
    <button
      class="nav-hamburger"
      :class="{ open: menuOpen }"
      :aria-expanded="menuOpen"
      aria-label="Toggle navigation"
      @click="menuOpen = !menuOpen"
    >
      <span /><span /><span />
    </button>

    <!-- Mobile dropdown -->
    <Transition name="nav-drop">
      <div v-if="menuOpen" class="nav-mobile-menu" @click="menuOpen = false">
        <a href="#narrative" class="nav-mobile-link">The Letter</a>
        <a href="#album"     class="nav-mobile-link">The Archive</a>
      </div>
    </Transition>
  </nav>

  <!-- Daily modal (rendered outside nav for z-index) -->
  <DailyModal v-model:open="dailyOpen" />

  <!-- Final Proposal Egg (Triggered by 3 fast clicks on brand) -->
  <FinalProposalEgg ref="fpEggRef" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DailyModal from './DailyModal.vue'
import FinalProposalEgg from './FinalProposalEgg.vue'

const menuOpen  = ref(false)
const dailyOpen = ref(false)
const phDate    = ref('')

const fpEggRef = ref<InstanceType<typeof FinalProposalEgg> | null>(null)

// 3 Fast Clicks Logic for EE#6 (Final Proposal)
let clickCount = 0
let clickTimer: ReturnType<typeof setTimeout> | null = null

function onBrandClick() {
  clickCount++
  if (clickTimer) clearTimeout(clickTimer)
  
  if (clickCount >= 3) {
    clickCount = 0
    fpEggRef.value?.open()
  } else {
    // Reset click count after 600ms of inactivity
    clickTimer = setTimeout(() => {
      clickCount = 0
    }, 600)
  }
}

function computePhDate() {
  const ph = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }))
  const mm = String(ph.getMonth() + 1).padStart(2, '0')
  const dd = String(ph.getDate()).padStart(2, '0')
  phDate.value = `${mm}/${dd}/${ph.getFullYear()}`
}

onMounted(computePhDate)
</script>

<style scoped>
.site-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0 3rem;
  height: 58px;
  background: rgba(250, 249, 246, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--parchment);
}

.nav-brand {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  letter-spacing: 0.06em;
  color: var(--ink);
  text-decoration: none;
  font-weight: 500;
  flex-shrink: 0;
}

/* ── Date button — centred ─────────────────────────────── */
.nav-date {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  transition: background 0.25s;
}

.nav-date:hover {
  background: rgba(134, 167, 137, 0.08);
}

.nav-date-icon { font-size: 0.75rem; line-height: 1; }

.nav-date-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.9rem;
  letter-spacing: 0.14em;
  color: var(--ink-muted);
  font-weight: 500;
  transition: color 0.25s;
}

.nav-date:hover .nav-date-text { color: var(--sage-dark); }

/* ── Desktop links ─────────────────────────────────────── */
.nav-links {
  display: flex;
  gap: 2.5rem;
  list-style: none;
  margin: 0 0 0 auto;
  padding: 0;
}
.nav-links a {
  font-size: 0.62rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--ink-muted);
  text-decoration: none;
  transition: color 0.25s;
}
.nav-links a:hover { color: var(--sage-dark); }

/* ── Hamburger ─────────────────────────────────────────── */
.nav-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  margin-left: auto;
}
.nav-hamburger span {
  display: block;
  width: 22px;
  height: 1.5px;
  background: var(--ink-muted);
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* ── Mobile dropdown ───────────────────────────────────── */
.nav-mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(250, 249, 246, 0.97);
  border-bottom: 1px solid var(--parchment);
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem 1.4rem;
  gap: 1rem;
  backdrop-filter: blur(14px);
}
.nav-mobile-link {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-muted);
  text-decoration: none;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--parchment);
  transition: color 0.2s;
}
.nav-mobile-link:last-child { border-bottom: none; }
.nav-mobile-link:hover { color: var(--sage-dark); }

/* Dropdown transition */
.nav-drop-enter-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.nav-drop-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.nav-drop-enter-from   { opacity: 0; transform: translateY(-8px); }
.nav-drop-leave-to     { opacity: 0; transform: translateY(-4px); }

/* ── Mobile breakpoint ─────────────────────────────────── */
@media (max-width: 640px) {
  .site-nav      { padding: 0 1.2rem; }
  .nav-links     { display: none; }
  .nav-hamburger { display: flex; }
  /* Keep date centred but a bit smaller */
  .nav-date-text { font-size: 0.8rem; letter-spacing: 0.1em; }
  .nav-date-icon { display: none; }
}
</style>
