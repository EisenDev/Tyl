<template>
  <Transition name="letter-fade">
    <div class="letter-overlay" role="dialog" aria-modal="true" @click.self="$emit('close')">
      
      <!-- Magical Sky Background -->
      <div class="sky-decor" aria-hidden="true">
        <div class="stars-layer">
          <div v-for="n in 30" :key="'s'+n" class="star" :style="`--d:${2+Math.random()*4}s; --l:${Math.random()*100}%; --t:${Math.random()*100}%` ">
             <svg viewBox="0 0 24 24" width="8" height="8" fill="#c5a059"><path d="M12 0l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z"/></svg>
          </div>
        </div>
        <div class="floating-vines">
          <div v-for="n in 4" :key="'v'+n" class="vine-branch" :style="`--d:${12+Math.random()*8}s; --l:${Math.random()*100}%; --t:${Math.random()*100}%` ">
            <svg viewBox="0 0 100 100" width="80" height="80" opacity="0.1"><path d="M10 90 Q30 50 10 10 M10 10 Q50 30 90 10" stroke="#86A789" stroke-width="2" fill="none"/></svg>
          </div>
        </div>
      </div>

      <div class="scene-layout" :class="`phase-${phase}`">
        
        <!-- CENTER ICON WRAPPER (Eye-Catcher) -->
        <div class="icon-focus-col">
          <div class="composition-wrap" :class="{ 'revealed': phase === 'revealed' }" @click="handleToggle">
            <div class="composition-glow"></div>
            <div class="composition-inner">
              <div class="crown-icon">
                <svg viewBox="0 0 24 24" width="50" height="50" fill="#c5a059"><path d="M5 16 L3 5 L8 10 L12 2 L16 10 L21 5 L19 16 Z M5 18 H19 V20 H5 Z"/></svg>
              </div>
              <div class="tulip-pair">
                <div class="t1"><TulipSvg :size="50" color="#86A789" :opacity="0.9" /></div>
                <div class="t2"><TulipSvg :size="50" color="#86A789" :opacity="0.9" /></div>
              </div>
              <div class="heart-base">
                <svg viewBox="0 0 24 24" width="80" height="80" fill="#86A789" opacity="0.7"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </div>
            </div>
          </div>
          <p v-if="phase === 'idle'" class="interaction-hint">Touch the heart of our story</p>
        </div>

        <!-- REVEALED CARD -->
        <Transition name="card-slide">
          <div v-if="phase === 'revealed'" class="letter-card">
            <button class="lc-close" @click="$emit('close')">✕</button>
            <div class="scroll-viewport">
              <div class="inner-paper">
                <div class="card-header">
                  <div class="crown-symbol">
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="#c5a059"><path d="M5 16 L3 5 L8 10 L12 2 L16 10 L21 5 L19 16 Z"/></svg>
                  </div>
                  <h2 class="card-title">To the Queen of my Heart</h2>
                  <div class="divider-gold"></div>
                </div>

                <div class="card-body">
                  <p class="greeting">My Beloved {{'Peinshiii'}},</p>
                  
                  <p>Happy 23rd birthday! Today, the world celebrates the day you were born, but I celebrate you every single day. Looking back at the girl you were and the stunning woman you have become, I am constantly in awe of your strength, your kindness, and the fierce grace with which you carry yourself.</p>
                  
                  <p>You bring so much light into the lives of everyone lucky enough to know you, but the light you have brought into my life is something I could never fully put into words. You are my source of joy, and my greatest blessing.</p>
                  
                  <p>As you blow out your candles today, I want you to know that my biggest wish has already come true—it's you. I promise to spend this year, and every year after, making sure you feel as loved and cherished as you truly are.</p>
                  
                  <p>May this new chapter bring you boundless joy, peace, and every dream your heart desires. Let's make this year unforgettable.</p>
                  
                  <div class="signature">
                    <p>With all my love,</p>
                    <p class="name">Eisen</p>
                  </div>

                  <!-- SURPRISE TRIGGER -->
                  <div class="surprise-section">
                    <button v-if="!showSurprise" class="surprise-btn" @click="showSurprise = true" aria-label="Surprise for you">
                      Tap for a magic moment ✨
                    </button>
                    
                    <Transition name="magic-reveal">
                      <div v-if="showSurprise" class="surprise-wrapper">
                        <!-- Magic Sparkle Cannons (SVG) -->
                        <div class="sparkle-layer">
                          <div v-for="n in 25" :key="'s'+n" class="magic-sparkle" :style="`--tx:${-150 + Math.random()*300}px; --ty:${-200 - Math.random()*200}px; --d:${1+Math.random()}s` ">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="#c5a059"><path d="M12 0l3.09 8.91h9.41l-7.62 5.54 2.91 9.55-7.79-5.63-7.79 5.63 2.91-9.55-7.62-5.54h9.41z"/></svg>
                          </div>
                        </div>

                        <!-- Central Magic Reveal (World Heart) -->
                        <div class="magic-reveal-center">
                          <div class="world-blossom">
                            <div class="world-svg">
                               <svg viewBox="0 0 24 24" width="80" height="80" fill="#86A789"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                            </div>
                            <div class="heart-orbit">
                               <svg viewBox="0 0 24 24" width="30" height="30" fill="#86A789"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            </div>
                          </div>
                          <p class="magic-final-msg">You are my whole world, Peinshiii 💚</p>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>

                <div class="actions">
                  <button class="btn-close" @click="$emit('close')">Keep Private</button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TulipSvg from '../../TulipSvg.vue'

defineEmits(['close'])

const phase = ref<'idle' | 'revealed'>('idle')
const showSurprise = ref(false)

function handleToggle() {
  if (phase.value === 'idle') {
    phase.value = 'revealed'
  }
}

onMounted(() => document.body.style.overflow = 'hidden')
onUnmounted(() => document.body.style.overflow = '')
</script>

<style scoped>
.letter-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: radial-gradient(circle at center, #ffffff 0%, #f7f9f7 100%);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem; overflow: hidden;
}

/* SKY DECORATIONS */
.sky-decor { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
.star {
  position: absolute; top: var(--t); left: var(--l);
  opacity: 0;
  animation: twinkle var(--d) infinite ease-in-out;
}
@keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.6; transform: scale(1.1); } }

.vine-branch {
  position: absolute; top: var(--t); left: var(--l);
  opacity: 0.1;
  animation: driftVine var(--d) infinite ease-in-out alternate;
}
@keyframes driftVine { from { transform: translate(0, 0) rotate(0); } to { transform: translate(20px, 20px) rotate(10deg); } }

.scene-layout {
  position: relative; z-index: 10;
  display: flex; align-items: center; justify-content: center;
  gap: 4rem; width: 100%; max-width: 1000px;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.phase-revealed { gap: 3rem; }

/* ICON COLUMN (EYE CATCHER) */
.icon-focus-col { display: flex; flex-direction: column; align-items: center; gap: 2rem; flex-shrink: 0; }
.composition-wrap {
  position: relative; width: 180px; height: 180px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  border-radius: 50%; border: 1.5px solid rgba(134,167,137,0.2);
  background: rgba(255,255,255,0.6);
  box-shadow: 0 10px 40px rgba(134,167,137,0.1);
  transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.composition-wrap:hover { transform: scale(1.1); box-shadow: 0 15px 50px rgba(134,167,137,0.2); }
.composition-wrap.revealed { transform: scale(0.9) rotate(-5deg); box-shadow: 0 5px 20px rgba(134,167,137,0.1); }

.composition-glow {
  position: absolute; inset: -20px; border-radius: 50%;
  background: radial-gradient(circle, rgba(134,167,137,0.15) 0%, transparent 70%);
  animation: pulseGlow 4s infinite alternate;
}
@keyframes pulseGlow { from { opacity: 0.4; transform: scale(0.9); } to { opacity: 0.8; transform: scale(1.1); } }

.composition-inner { position: relative; width: 100px; height: 100px; display: flex; justify-content: center; align-items: center; }
.crown-icon { position: absolute; top: -10px; z-index: 5; opacity: 0.8; }
.tulip-pair { position: absolute; width: 100%; height: 100%; display: flex; justify-content: space-around; transform: translateY(10px); }
.t1 { transform: rotate(-15deg); }
.t2 { transform: rotate(15deg); }
.heart-base { position: absolute; bottom: -10px; opacity: 0.7; }

.interaction-hint { font-family: 'Cormorant Garamond', serif; font-style: italic; color: #86a789; font-size: 1.1rem; animation: hintFade 2s infinite alternate; }
@keyframes hintFade { from { opacity: 0.3; } to { opacity: 0.9; } }

/* REVEALED CARD */
.letter-card {
  width: 440px; height: 85vh;
  background: #ffffff; border: 1px solid rgba(134,167,137,0.2);
  border-radius: 4px; box-shadow: 0 20px 60px rgba(0,0,0,0.06);
  position: relative; display: flex; flex-direction: column;
}

.scroll-viewport { overflow-y: auto; flex: 1; padding: 4.5rem 3rem; }

.lc-close {
  position: absolute; top: 1.5rem; right: 1.5rem;
  background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #ccc; transition: 0.3s;
}
.lc-close:hover { color: #c5a059; }

.card-header { text-align: center; margin-bottom: 3.5rem; }
.crown-symbol { margin-bottom: 0.5rem; opacity: 0.8; }
.card-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 300; color: #1a201c; margin: 0; font-style: italic; }
.divider-gold { width: 60px; height: 1px; background: #c5a059; opacity: 0.4; margin: 1.5rem auto 0; }

.card-body { font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; line-height: 1.85; color: #2a332d; text-align: justify; }
.greeting { font-size: 1.15rem; font-style: italic; margin-bottom: 2rem; color: #1a201c; }
.card-body p { margin-bottom: 1.5rem; }
.highlight { color: #c5a059; font-weight: 600; display: inline-block; transform: scale(1.1); }

.signature { margin-top: 4.5rem; text-align: right; }
.signature p:first-child { font-style: italic; color: #888; font-size: 0.85rem; }
.name { font-size: 2.2rem; color: #1a201c; font-weight: 400; font-style: italic; }

/* SURPRISE STYLES */
.surprise-section { margin-top: 3rem; display: flex; flex-direction: column; align-items: center; position: relative; }
.surprise-btn {
  background: transparent; border: 1px dashed #c5a059; color: #c5a059;
  padding: 0.6rem 2rem; font-family: 'Cormorant Garamond', serif; font-style: italic;
  cursor: pointer; border-radius: 4px; transition: 0.3s;
}
.surprise-btn:hover { background: rgba(197, 160, 89, 0.05); transform: scale(1.05); }

.surprise-wrapper { position: relative; width: 100%; min-height: 300px; display: flex; align-items: center; justify-content: center; overflow: visible; }

.sparkle-layer { position: absolute; inset: 0; pointer-events: none; }
.magic-sparkle { position: absolute; left: 50%; bottom: 20px; opacity: 0; }
.magic-sparkle { animation: sparkleFly var(--d) cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes sparkleFly {
  0% { transform: translate(-50%, 0) scale(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(720deg); opacity: 0; }
}

.magic-reveal-center {
  text-align: center; animation: magicPop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes magicPop {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.world-blossom { position: relative; margin-bottom: 1.5rem; display: inline-block; }
.world-svg { filter: drop-shadow(0 5px 15px rgba(134,167,137,0.3)); }
.heart-orbit {
  position: absolute; top: -10px; right: -10px;
  animation: heartOrbit 3s infinite ease-in-out;
}
@keyframes heartOrbit {
  0% { transform: translate(0,0) scale(1) rotate(0); }
  50% { transform: translate(15px, -15px) scale(1.2) rotate(15deg); }
  100% { transform: translate(0,0) scale(1) rotate(0); }
}

.magic-final-msg {
  font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-style: italic; color: #1a201c;
  opacity: 0; animation: textFade 1s ease 0.8s forwards;
}
@keyframes textFade { to { opacity: 1; } }

.actions { margin-top: 5rem; display: flex; justify-content: center; }
.btn-close {
  background: transparent; border: 1px solid #1a201c; color: #1a201c;
  padding: 0.6rem 2.4rem; font-family: 'Inter', sans-serif; font-size: 0.75rem;
  letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: 0.3s;
}
.btn-close:hover { background: #1a201c; color: #fff; transform: translateY(-3px); }

/* ANIMATIONS */
.card-slide-enter-active { transition: all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s; }
.card-slide-leave-active { transition: all 0.5s ease; }
.card-slide-enter-from { opacity: 0; transform: translateX(40px) scale(0.95); }
.card-slide-leave-to { opacity: 0; transform: translateX(20px) scale(0.98); }

@media (max-width: 850px) {
  .scene-layout { flex-direction: column; gap: 2rem; }
  .letter-card { width: 100%; height: auto; max-height: 70vh; }
  .scroll-viewport { padding: 3.5rem 2rem; }
}

.letter-fade-enter-active, .letter-fade-leave-active { transition: opacity 0.5s ease; }
.letter-fade-enter-from, .letter-fade-leave-to { opacity: 0; }
</style>
