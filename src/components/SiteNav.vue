<template>
  <nav class="site-nav" role="navigation" aria-label="Main">
    <a href="#" class="nav-brand">To My Beloved</a>

    <!-- Desktop links -->
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
        <a href="#album"    class="nav-mobile-link">The Archive</a>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuOpen = ref(false)
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
  justify-content: space-between;
  padding: 1.4rem 3rem;
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
}

.nav-links {
  display: flex;
  gap: 2.5rem;
  list-style: none;
  margin: 0;
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

/* ── Dropdown transition ───────────────────────────────── */
.nav-drop-enter-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.nav-drop-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.nav-drop-enter-from   { opacity: 0; transform: translateY(-8px); }
.nav-drop-leave-to     { opacity: 0; transform: translateY(-4px); }

/* ── Mobile breakpoint ─────────────────────────────────── */
@media (max-width: 640px) {
  .site-nav    { padding: 1.1rem 1.4rem; }
  .nav-links   { display: none; }
  .nav-hamburger { display: flex; }
}
</style>
