<template>
  <Transition name="letter-fade">
    <div class="letter-overlay" role="dialog" aria-modal="true" @click.self="$emit('close')">
      
      <!-- Premium Background Atmosphere -->
      <div class="bg-atmosphere" aria-hidden="true">
        <div class="nature-layer">
          <div v-for="n in 6" :key="'v'+n" class="swaying-vine" :style="`--d:${8+Math.random()*4}s; --l:${Math.random()*100}%; --t:${Math.random()*100}%` ">🌿</div>
          <div v-for="n in 8" :key="'p'+n" class="falling-petal" :style="`--d:${10+Math.random()*10}s; --l:${Math.random()*100}%` ">🌸</div>
          <div v-for="n in 4" :key="'t'+n" class="blooming-tulip" :style="`--d:${15+Math.random()*5}s; --l:${Math.random()*100}%` ">🌷</div>
        </div>
      </div>

      <div class="scene-container">
        
        <!-- ROLLED SCROLL VIEW -->
        <div v-if="phase === 'sealed'" class="scroll-object" @click="handleUnroll">
          <div class="scroll-cylinder">
            <div class="cylinder-body">
              <div class="cylinder-lines">
                <span/><span/><span/><span/>
              </div>
            </div>
            <div class="cylinder-cap top"/>
            <div class="cylinder-cap bottom"/>
            
            <!-- Opening Ribbon & Seal -->
            <div class="ribbon-wrap" :class="{ 'sliding': unrolling }">
              <div class="ribbon-band"></div>
              <div class="wax-seal">
                <div class="seal-inner">❦</div>
              </div>
            </div>
            <p class="tap-hint">Tap to reveal our story</p>
          </div>
        </div>

        <!-- REVEALED CONTENT -->
        <div v-else class="revealed-scroll" :class="{ 'expanding': phase === 'unrolling' }">
          <div class="parchment-flat">
            <button class="lc-close" @click="$emit('close')">✕</button>
            
            <div class="content-viewport">
              <div class="letter-inner">
                <div class="header-decor">
                  <div class="line"></div>
                  <div class="icon">❦</div>
                  <div class="line"></div>
                </div>

                <h2 class="letter-title">Sixteen Months of Us</h2>

                <div class="letter-text">
                  <p class="salutation">My Sweetest {{'Peinshiii'}},</p>
                  
                  <p>It is hard to believe that 16 months have flown by since the day we decided to call each other ours. Sixteen months of learning you, loving you, and realizing that my favorite place in the world is simply wherever you are.</p>
                  
                  <p>Every 18th is a beautiful reminder of the best decision I ever made. We have shared so many quiet evenings, so many bursts of laughter, and so many moments where just looking at you feels like a dream I never want to wake up from.</p>
                  
                  <p>I built this space so that no matter where we are, you can always open it and remember how deeply you are loved. This little green tulip and heart <span class="emoji-inline">🌷💚</span> will always be our symbol, blooming more vividly with every month that passes.</p>
                  
                  <p>Thank you for being my peace, my joy, and my greatest adventure. I love you, completely and always.</p>
                  
                  <div class="signature">
                    <p>Forever yours,</p>
                    <p class="name">Eisen</p>
                  </div>

                  <!-- SURPRISE TRIGGER -->
                  <div class="surprise-section">
                    <button v-if="!showSurprise" class="surprise-btn" @click="triggerSurprise">
                      Tap for a surprise ✨
                    </button>
                    
                    <Transition name="surprise-reveal">
                      <div v-if="showSurprise" class="surprise-wrapper">
                        <!-- Left & Right Cannons (SVG Styled) -->
                        <div class="svg-cannon left">
                          <svg viewBox="0 0 40 60"><path d="M5 60 L15 10 L25 10 L35 60 Z" fill="#86A789"/><circle cx="20" cy="10" r="8" fill="#6b8a6d"/></svg>
                        </div>
                        <div class="svg-cannon right">
                          <svg viewBox="0 0 40 60"><path d="M5 60 L15 10 L25 10 L35 60 Z" fill="#86A789"/><circle cx="20" cy="10" r="8" fill="#6b8a6d"/></svg>
                        </div>
                        
                        <!-- High Quality Particles -->
                        <div class="physics-layer">
                          <div v-for="n in 12" :key="'p'+n" class="burst-p" :style="`--x:${-100 + Math.random()*200}px; --y:${-300 - Math.random()*200}px; --d:${0.5 + Math.random()}s` ">
                            <TulipSvg :size="30" color="#e8a0b0" :opacity="0.8" />
                          </div>
                          <div v-for="n in 8" :key="'h'+n" class="burst-p" :style="`--x:${-150 + Math.random()*300}px; --y:${-250 - Math.random()*200}px; --d:${0.8 + Math.random()}s` ">
                            <svg viewBox="0 0 24 24" width="25" height="25" fill="#86A789" opacity="0.6"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                          </div>
                        </div>

                        <!-- Central Gift Blossom -->
                        <div class="center-surprise">
                          <div class="blooming-gift">
                            <TulipSvg :size="120" color="#86A789" :opacity="1" />
                            <div class="glow-ring"></div>
                          </div>
                          <p class="surprise-text">You are my forever, Peinshiii ❦</p>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
              </div>
            </div>

            <div class="unroll-actions">
              <button class="finish-btn" @click="$emit('close')">Return</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Surprise Rain (Appears outside parchment) -->
      <div v-if="showSurprise" class="surprise-rain-v2">
        <div v-for="n in 25" :key="'r'+n" class="rain-p" :style="`--l:${Math.random()*100}%; --d:${3+Math.random()*4}s; --delay:${Math.random()*2}s` ">
          <TulipSvg :size="20" color="#e8a0b0" :opacity="0.4" />
        </div>
      </div>

    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TulipSvg from '../../TulipSvg.vue'

defineEmits(['close'])

type Phase = 'sealed' | 'unrolling' | 'revealed'
const phase = ref<Phase>('sealed')
const unrolling = ref(false)
const showSurprise = ref(false)

function handleUnroll() {
  unrolling.value = true
  setTimeout(() => {
    phase.value = 'unrolling'
    setTimeout(() => {
      phase.value = 'revealed'
    }, 800)
  }, 600)
}

function triggerSurprise() {
  showSurprise.value = true
}

onMounted(() => document.body.style.overflow = 'hidden')
onUnmounted(() => document.body.style.overflow = '')
</script>

<style scoped>
.letter-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: #fdfdfc;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem; overflow: hidden;
}

/* BACKGROUND ATMOSPHERE */
.bg-atmosphere { position: fixed; inset: 0; pointer-events: none; z-index: 1; }
.nature-layer { position: relative; width: 100%; height: 100%; }

.swaying-vine {
  position: absolute; top: var(--t); left: var(--l);
  font-size: 2.5rem; opacity: 0.1;
  animation: sway var(--d) infinite ease-in-out alternate;
}
@keyframes sway { from { transform: rotate(-5deg); } to { transform: rotate(15deg); } }

.falling-petal {
  position: absolute; top: -50px; left: var(--l);
  font-size: 1.2rem; opacity: 0.4;
  animation: fall var(--d) infinite linear;
}
@keyframes fall {
  0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 0; }
  20% { opacity: 0.6; }
  100% { transform: translateY(110vh) rotate(360deg) translateX(50px); opacity: 0; }
}

.blooming-tulip {
  position: absolute; bottom: 5%; left: var(--l);
  font-size: 1.5rem; opacity: 0.15;
  animation: bloom var(--d) infinite ease-in-out;
}
@keyframes bloom {
  0%, 100% { transform: scale(0.8) translateY(0); }
  50% { transform: scale(1.1) translateY(-10px); }
}

.scene-container {
  position: relative; z-index: 10;
  width: 100%; max-width: 600px;
  display: flex; justify-content: center; align-items: center;
}

/* ROLLED SCROLL OBJECT */
.scroll-object { cursor: pointer; }
.scroll-cylinder {
  position: relative; width: 160px; height: 260px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.scroll-object:hover .scroll-cylinder { transform: scale(1.05) rotate(1deg); }

.cylinder-body {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, #d4c8af 0%, #fdfaf3 15%, #ffffff 50%, #fdfaf3 85%, #d4c8af 100%);
  border-radius: 80px / 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.12);
  display: flex; justify-content: center; align-items: center;
}
.cylinder-lines { width: 100%; height: 60%; display: flex; flex-direction: column; gap: 12px; opacity: 0.2; }
.cylinder-lines span { height: 1px; width: 100%; background: #000; }

.cylinder-cap {
  position: absolute; left: 0; right: 0; height: 30px;
  background: linear-gradient(90deg, #a8a196 0%, #d8d2c5 50%, #a8a196 100%);
  border-radius: 50%;
}
.top { top: -10px; }
.bottom { bottom: -10px; }

.ribbon-wrap {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 200px; height: 60px; z-index: 20;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.ribbon-wrap.sliding { transform: translate(150%, -50%); opacity: 0; }

.ribbon-band {
  position: absolute; top: 50%; left: 0; width: 100%; height: 2px;
  background: #86a789; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.wax-seal {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 50px; height: 50px; background: #b22222; border-radius: 50%;
  border: 1px solid #8b0000; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
}
.seal-inner { color: rgba(255,255,255,0.3); font-size: 1.4rem; font-weight: bold; }

.tap-hint {
  position: absolute; bottom: -50px; left: 50%; transform: translateX(-50%);
  white-space: nowrap; font-family: 'Cormorant Garamond', serif; font-style: italic; color: #8b5a2b;
  animation: pulseHint 2s infinite;
}
@keyframes pulseHint { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }

/* REVEALED PARCHMENT */
.revealed-scroll {
  width: 100%; animation: unfurl 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes unfurl {
  from { transform: scaleY(0.1); opacity: 0; }
  to { transform: scaleY(1); opacity: 1; }
}

.parchment-flat {
  background: #fff; position: relative;
  box-shadow: 0 30px 80px rgba(0,0,0,0.08);
  border: 1px solid #f0efeb;
  padding: 0;
  display: flex; flex-direction: column;
  max-height: 85vh; width: 100%;
}

.content-viewport {
  overflow-y: auto; padding: 5rem 3.5rem;
}

.lc-close {
  position: absolute; top: 1.5rem; right: 1.5rem;
  background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #ccc; z-index: 100;
}

.header-decor { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 2rem; }
.header-decor .line { height: 1px; width: 40px; background: #86a789; opacity: 0.4; }
.header-decor .icon { font-size: 1.2rem; color: #86a789; }

.letter-title {
  text-align: center; font-family: 'Cormorant Garamond', serif; font-size: 2.4rem;
  font-weight: 300; color: #1a201c; margin: 0 0 3.5rem; font-style: italic;
}

.letter-text {
  font-family: 'Cormorant Garamond', serif; font-size: 1rem; line-height: 1.8;
  color: #2a332d; text-align: justify;
}
.salutation { font-size: 1.2rem; font-style: italic; margin-bottom: 2rem; color: #1a201c; }
.letter-text p { margin-bottom: 1.5rem; }

.emoji-inline { display: inline-block; transform: scale(1.1); vertical-align: middle; }

.signature { margin-top: 4.5rem; text-align: right; }
.signature p:first-child { font-style: italic; color: #888; font-size: 0.9rem; }
.name { font-size: 2rem; color: #1a201c; font-weight: 400; font-family: 'Cormorant Garamond', serif; font-style: italic; margin-top: 0.2rem; }

/* SURPRISE STYLES */
.surprise-section { margin-top: 4rem; display: flex; flex-direction: column; align-items: center; position: relative; }

.surprise-btn {
  background: #fdfaf3; color: #8b5a2b; border: 1px dashed #d4c8af; border-radius: 4px;
  padding: 0.8rem 2.5rem; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.1rem;
  cursor: pointer; transition: 0.3s;
}
.surprise-btn:hover { background: #fff; border-style: solid; transform: scale(1.05); color: #5c4033; }

.surprise-wrapper { width: 100%; position: relative; min-height: 350px; padding-top: 2rem; overflow: visible; }

/* SVG Cannons */
.svg-cannon {
  position: absolute; bottom: 0; width: 40px; z-index: 10;
  animation: cannonPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.svg-cannon.left { left: 0; transform: rotate(-30deg); }
.svg-cannon.right { right: 0; transform: rotate(30deg); }

@keyframes cannonPop {
  0% { transform: translateY(50px) scale(0); opacity: 0; }
  100% { transform: translateY(0) scale(1) rotate(var(--rot)); opacity: 1; }
}
.left { --rot: -30deg; }
.right { --rot: 30deg; }

/* Physics Layer for Particles */
.physics-layer { position: absolute; inset: 0; pointer-events: none; }
.burst-p { position: absolute; bottom: 20px; left: 50%; opacity: 0; }
.burst-p { animation: physicsBurst var(--d) cubic-bezier(0.16, 1, 0.3, 1) forwards; }

@keyframes physicsBurst {
  0% { transform: translate(-50%, 0) scale(0) rotate(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translate(var(--x), var(--y)) scale(1) rotate(360deg); opacity: 0; }
}

/* Center Surprise */
.center-surprise {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 100%; text-align: center;
}

.blooming-gift {
  position: relative; 
  animation: blossomGift 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes blossomGift {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.glow-ring {
  position: absolute; inset: -20px; border-radius: 50%;
  border: 2px solid rgba(134,167,137,0.2);
  animation: ringExpand 2s infinite ease-out;
}
@keyframes ringExpand {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.surprise-text {
  font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-style: italic; color: #5c4033;
  margin-top: 1.5rem; opacity: 0; animation: textFade 1s ease 1s forwards;
}
@keyframes textFade { to { opacity: 1; } }

/* Rain V2 */
.surprise-rain-v2 { position: fixed; inset: 0; pointer-events: none; z-index: 10000; }
.rain-p {
  position: absolute; top: -50px; left: var(--l);
  animation: rainDrop var(--d) linear var(--delay) infinite;
}
@keyframes rainDrop {
  0% { transform: translateY(0) rotate(0); opacity: 0; }
  20% { opacity: 0.6; }
  100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
}

.unroll-actions { padding: 3rem; display: flex; justify-content: center; border-top: 1px solid #fbfbfb; }
.finish-btn {
  background: none; border: 1px solid #86a789; color: #86a789;
  padding: 0.7rem 2.8rem; font-family: 'Inter', sans-serif; font-size: 0.75rem;
  letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: 0.3s;
}
.finish-btn:hover { background: #86a789; color: #fff; }

@media (max-width: 600px) {
  .content-viewport { padding: 4rem 1.8rem; }
  .letter-title { font-size: 1.8rem; }
  .letter-text { font-size: 0.95rem; }
}

.letter-fade-enter-active, .letter-fade-leave-active { transition: opacity 0.5s ease; }
.letter-fade-enter-from, .letter-fade-leave-to { opacity: 0; }
</style>
