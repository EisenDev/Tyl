<template>
  <Transition name="letter-fade">
    <div class="letter-overlay" role="dialog" aria-modal="true" @click.self="$emit('close')">
      
      <!-- ANNIVERSARY EXTRAVAGANZA BACKGROUND -->
      <div class="anniv-garden" aria-hidden="true">
        <!-- Floating Elements (SVG Hearts & Tulips) -->
        <div v-for="n in 12" :key="'h'+n" class="float-item heart" :style="`--d:${8+Math.random()*8}s; --l:${Math.random()*100}%; --t:${Math.random()*100}%` ">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="#86A789" opacity="0.3"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        <div v-for="n in 10" :key="'t'+n" class="float-item tulip" :style="`--d:${12+Math.random()*10}s; --l:${Math.random()*100}%; --t:${Math.random()*100}%` ">
          <TulipSvg :size="30" color="#86A789" :opacity="0.25" />
        </div>
        
        <!-- Swaying Vines on Edges (SVG) -->
        <div v-for="n in 8" :key="'v'+n" class="hanging-vine-svg" :style="`--d:${5+Math.random()*5}s; --side:${n % 2 === 0 ? 'left' : 'right'}; --pos:${Math.random()*90}%` ">
          <svg viewBox="0 0 100 200" width="80" height="150" opacity="0.4"><path d="M10 0 Q50 50 10 100 Q-30 150 10 200" stroke="#86A789" stroke-width="2" fill="none"/></svg>
        </div>
        
        <!-- Shimmering Gold Dust -->
        <div class="gold-dust">
          <div v-for="n in 40" :key="'d'+n" class="dust" :style="`--d:${3+Math.random()*5}s; --l:${Math.random()*100}%; --t:${Math.random()*100}%` "></div>
        </div>
      </div>

      <div class="stage">
        
        <!-- THE SCROLL (Royal Edition) -->
        <div v-if="phase === 'sealed'" class="royal-scroll" @click="initUnroll">
          <div class="scroll-cylinder-3d">
            <div class="body-wrap">
              <div class="paper-texture"></div>
              <div class="decorative-ribbon" :class="{ 'disappear': unrolling }">
                <div class="ribbon-tail left"></div>
                <div class="seal-complex">
                  <div class="seal-base">
                    <div class="seal-mark">
                       <svg viewBox="0 0 24 24" width="35" height="35" fill="rgba(255,255,255,0.4)"><circle cx="12" cy="14" r="6" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 8 L15 4 L12 2 L9 4 Z" fill="currentColor"/></svg>
                    </div>
                  </div>
                  <div class="seal-glow"></div>
                </div>
                <div class="ribbon-tail right"></div>
              </div>
            </div>
            <div class="end-cap top"></div>
            <div class="end-cap bottom"></div>
          </div>
          <p class="guide-text">Unlock Our Forever</p>
        </div>

        <!-- THE REVEALED PARCHMENT -->
        <div v-else class="revealed-document" :class="{ 'opening': phase === 'unrolling' }">
          <div class="parchment-frame">
            <button class="lc-close" @click="$emit('close')">✕</button>
            
            <div class="document-scroller">
              <div class="content-wrapper">
                <div class="royal-header">
                  <div class="rings-sigil-svg">
                    <svg viewBox="0 0 100 40" width="100" height="40" fill="none" class="gold-icons">
                      <circle cx="20" cy="20" r="10" stroke="#c5a059" stroke-width="1.5"/><path d="M20 10 L24 6 L20 3 L16 6 Z" fill="#c5a059"/>
                      <circle cx="50" cy="20" r="10" stroke="#86A789" stroke-width="1.5"/><path d="M50 10 L54 6 L50 3 L46 6 Z" fill="#86A789"/>
                      <circle cx="80" cy="20" r="10" stroke="#c5a059" stroke-width="1.5"/><path d="M80 10 L84 6 L80 3 L76 6 Z" fill="#c5a059"/>
                    </svg>
                  </div>
                  <h2 class="letter-title">Our Eternal 2nd Anniversary</h2>
                  <div class="ornate-separator">
                    <span class="dot">✦</span>
                  </div>
                </div>

                <div class="letter-body">
                  <p class="salutation">My Dearest and Only Love,</p>
                  
                  <p>Two years. Seven hundred and thirty days of holding your hand, listening to your voice, and waking up every morning knowing that the best part of my life gets to start all over again.</p>
                  
                  <p>They say the first year is about discovery, and the second is about deepening. This year, I have loved you in ways I didn't even know I was capable of. Through every quiet morning, every busy afternoon, and every tired but happy evening, you have been my constant source of strength.</p>
                  
                  <p>When I built this space, I poured all my love into the code and the design. But none of it could ever match the actual beauty of the life we are building together. You are my home, my sanctuary, and my favorite tomorrow.</p>
                  
                  <p>Here's to two years down, and an entire lifetime to go. I will always choose you. Every day, in every way, you are my everything.</p>
                  
                  <div class="signature-block">
                    <p>Lovingly yours,</p>
                    <p class="sign-name">Eisen</p>
                  </div>

                  <!-- SURPRISE TRIGGER -->
                  <div class="surprise-section">
                    <button v-if="!showSurprise" class="surprise-btn" @click="showSurprise = true">
                      Tap for our forever archive ❦
                    </button>
                    
                    <Transition name="royal-reveal">
                      <div v-if="showSurprise" class="surprise-wrapper">
                        <!-- Shimmering Ring Blast (SVG) -->
                        <div class="ring-physics">
                          <div v-for="n in 15" :key="'r'+n" class="physics-ring" :style="`--tx:${-200 + Math.random()*400}px; --ty:${-300 - Math.random()*200}px; --d:${1.2+Math.random()}s` ">
                            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="14" r="7" stroke="#c5a059" stroke-width="2"/>
                              <path d="M12 7 L15 3 L12 1 L9 3 Z" fill="#c5a059" opacity="0.8"/>
                            </svg>
                          </div>
                        </div>

                        <!-- Central Anniversary Reveal -->
                        <div class="anniv-reveal-center">
                          <div class="toast-sigil">
                             <div class="sigil-svg">
                                <svg viewBox="0 0 40 40" width="80" height="80" fill="#c5a059">
                                  <path d="M15 15 L25 15 L23 30 L17 30 Z M15 30 L25 30 L25 32 L15 32 Z" opacity="0.8"/>
                                  <circle cx="20" cy="10" r="3" fill="#86A789"/>
                                </svg>
                             </div>
                             <div class="orbit-petal-svg">
                               <TulipSvg :size="25" color="#86A789" :opacity="0.9" />
                             </div>
                          </div>
                          <p class="anniv-final-msg">I will always choose you, my Queen 💚</p>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>
            </div>

            <div class="scroller-footer">
              <button class="back-btn" @click="$emit('close')">Close Archive</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TulipSvg from '../../TulipSvg.vue'

defineEmits(['close'])

const phase = ref<'sealed' | 'unrolling' | 'revealed'>('sealed')
const unrolling = ref(false)
const showSurprise = ref(false)

function initUnroll() {
  unrolling.value = true
  setTimeout(() => {
    phase.value = 'unrolling'
    setTimeout(() => {
      phase.value = 'revealed'
    }, 1000)
  }, 700)
}

onMounted(() => document.body.style.overflow = 'hidden')
onUnmounted(() => document.body.style.overflow = '')
</script>

<style scoped>
.letter-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: #fdfdfd;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem; overflow: hidden;
}

/* ANNIVERSARY EXTRAVAGANZA BACKGROUND */
.anniv-garden { position: fixed; inset: 0; pointer-events: none; z-index: 1; }

.float-item {
  position: absolute; top: var(--t); left: var(--l);
  animation: floatSpecial var(--d) infinite ease-in-out alternate;
}
@keyframes floatSpecial { from { transform: translate(0, 0) scale(0.9); } to { transform: translate(30px, -30px) scale(1.1); } }

.hanging-vine-svg {
  position: absolute; top: var(--pos);
  animation: vineSway var(--d) infinite ease-in-out alternate;
}
.hanging-vine-svg[style*="left"] { left: -10px; transform-origin: left top; }
.hanging-vine-svg[style*="right"] { right: -10px; transform-origin: right top; transform: scaleX(-1); }
@keyframes vineSway { from { transform: rotate(-10deg); } to { transform: rotate(10deg); } }

.gold-dust { position: absolute; inset: 0; }
.dust {
  position: absolute; top: var(--t); left: var(--l);
  width: 2px; height: 2px; background: #c5a059; border-radius: 50%; opacity: 0;
  animation: shimmer var(--d) infinite ease-in-out;
}
@keyframes shimmer { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.8; transform: scale(1.5); } }

.stage {
  position: relative; z-index: 10;
  width: 100%; max-width: 700px;
  display: flex; justify-content: center; align-items: center;
}

/* ROYAL SCROLL */
.royal-scroll { cursor: pointer; }
.scroll-cylinder-3d {
  position: relative; width: 180px; height: 320px;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.royal-scroll:hover .scroll-cylinder-3d { transform: scale(1.08) rotate(-1deg); }

.body-wrap {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, #d8d2c5 0%, #fdfbf5 15%, #ffffff 50%, #fdfbf5 85%, #d8d2c5 100%);
  border-radius: 90px / 14px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.15);
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.paper-texture { position: absolute; inset: 0; opacity: 0.03; background: url("https://www.transparenttextures.com/patterns/parchment.png"); }

.decorative-ribbon {
  position: absolute; width: 100%; height: 80px;
  display: flex; align-items: center; justify-content: center;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.decorative-ribbon.disappear { transform: translateX(200%); opacity: 0; }

.ribbon-tail { width: 100px; height: 3px; background: #c5a059; opacity: 0.6; }

.seal-complex {
  position: relative; width: 70px; height: 70px; margin: 0 10px;
}
.seal-base {
  width: 100%; height: 100%; background: #962525; border-radius: 50%;
  border: 1px solid #7a1c1c; box-shadow: 0 5px 15px rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
}
.seal-mark { color: rgba(255,255,255,0.4); }
.seal-glow {
  position: absolute; inset: -15px; border-radius: 50%;
  background: radial-gradient(circle, rgba(197, 160, 89, 0.3) 0%, transparent 70%);
  animation: pulseSeal 3s infinite;
}
@keyframes pulseSeal { 0%, 100% { opacity: 0.2; transform: scale(0.9); } 50% { opacity: 0.6; transform: scale(1.2); } }

.end-cap {
  position: absolute; left: 0; right: 0; height: 36px;
  background: linear-gradient(90deg, #b8b1a2 0%, #e8e4d8 50%, #b8b1a2 100%);
  border-radius: 50%; border: 1px solid #c5a059;
}
.top { top: -14px; }
.bottom { bottom: -14px; }

.guide-text {
  position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%);
  font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-style: italic; color: #c5a059;
  letter-spacing: 0.1em;
}

/* REVEALED DOCUMENT */
.revealed-document {
  width: 100%; animation: documentOpen 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes documentOpen {
  from { transform: scaleY(0.05); opacity: 0; }
  to { transform: scaleY(1); opacity: 1; }
}

.parchment-frame {
  background: #ffffff; border: 1px solid #f2f1ec;
  box-shadow: 0 40px 100px rgba(0,0,0,0.1);
  display: flex; flex-direction: column;
  max-height: 85vh; width: 100%;
}

.document-scroller { overflow-y: auto; padding: 6rem 5rem; flex: 1; }

.lc-close {
  position: absolute; top: 1.5rem; right: 2rem;
  background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #ddd; z-index: 100;
}
.lc-close:hover { color: #c5a059; }

.royal-header { text-align: center; margin-bottom: 4rem; }
.letter-title {
  font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; font-weight: 300;
  color: #1a201c; margin: 0; font-style: italic;
}
.ornate-separator {
  margin-top: 2rem; display: flex; align-items: center; justify-content: center;
  gap: 20px;
}
.ornate-separator::before, .ornate-separator::after { content: ''; width: 40px; height: 1px; background: #c5a059; opacity: 0.2; }
.ornate-separator .dot { color: #c5a059; opacity: 0.4; }

.letter-body {
  font-family: 'Cormorant Garamond', serif; font-size: 1rem; line-height: 1.9;
  color: #2a332d; text-align: justify;
}
.salutation { font-size: 1.3rem; font-style: italic; margin-bottom: 2.5rem; color: #1a1a1a; }
.letter-body p { margin-bottom: 1.8rem; text-indent: 1.5rem; }

.signature-block { margin-top: 5rem; text-align: right; }
.signature-block p:first-child { font-style: italic; color: #888; font-size: 0.9rem; }
.sign-name { font-size: 2.5rem; color: #1a201c; font-weight: 400; font-family: 'Cormorant Garamond', serif; font-style: italic; }

/* SURPRISE STYLES */
.surprise-section { margin-top: 4rem; display: flex; flex-direction: column; align-items: center; position: relative; }
.surprise-btn {
  background: #fdfbf5; border: 1px double #c5a059; color: #c5a059;
  padding: 0.8rem 2.8rem; font-family: 'Cormorant Garamond', serif; font-style: italic;
  cursor: pointer; border-radius: 2px; transition: 0.4s;
}
.surprise-btn:hover { background: #fff; box-shadow: 0 5px 15px rgba(197, 160, 89, 0.1); transform: scale(1.02); }

.surprise-wrapper { position: relative; width: 100%; min-height: 350px; display: flex; align-items: center; justify-content: center; overflow: visible; }

.ring-physics { position: absolute; inset: 0; pointer-events: none; }
.physics-ring { position: absolute; left: 50%; bottom: 20px; opacity: 0; }
.physics-ring { animation: ringPhysics var(--d) cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes ringPhysics {
  0% { transform: translate(-50%, 0) scale(0) rotate(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(1.2) rotate(360deg); opacity: 0; }
}

.anniv-reveal-center {
  text-align: center; animation: revealPop 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes revealPop {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.toast-sigil { position: relative; margin-bottom: 1.5rem; display: inline-block; }
.sigil-svg { filter: drop-shadow(0 5px 15px rgba(197, 160, 89, 0.3)); }
.orbit-petal-svg {
  position: absolute; top: -10px; right: -10px;
  animation: petalOrbit 4s infinite linear;
}
@keyframes petalOrbit {
  0% { transform: rotate(0) translate(30px) rotate(0); }
  100% { transform: rotate(360deg) translate(30px) rotate(-360deg); }
}

.anniv-final-msg {
  font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-style: italic; color: #1a1a1a;
  opacity: 0; animation: textReveal 1s ease 0.8s forwards;
}
@keyframes textReveal { to { opacity: 1; } }

.scroller-footer { padding: 4rem; display: flex; justify-content: center; border-top: 1px solid #fafafa; }
.back-btn {
  background: transparent; border: 1px solid #c5a059; color: #c5a059;
  padding: 0.9rem 3.5rem; font-family: 'Inter', sans-serif; font-size: 0.8rem;
  letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: 0.4s;
}
.back-btn:hover { background: #c5a059; color: #fff; transform: translateY(-4px); }

@media (max-width: 600px) {
  .document-scroller { padding: 4rem 2rem; }
  .letter-title { font-size: 2rem; }
  .letter-body { font-size: 0.95rem; }
}

.letter-fade-enter-active, .letter-fade-leave-active { transition: opacity 0.5s ease; }
.letter-fade-enter-from, .letter-fade-leave-to { opacity: 0; }
</style>
