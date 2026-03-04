<template>
  <Transition name="fp-fade">
    <div
      v-if="phase !== 'idle'"
      class="fp-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="The Final Door"
      @click.self="close"
    >
      <!-- Background Elements: Green Tulips and Hearts -->
      <div class="fp-bg-elements" aria-hidden="true">
        <!-- Central Glow -->
        <div class="bg-glow"></div>

        <div class="bg-shape s1"><TulipSvg :size="150" color="#86A789" :opacity="0.15" /></div>
        <div class="bg-shape s2">
          <svg viewBox="0 0 24 24" width="120" height="120" fill="#86A789" opacity="0.1">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div class="bg-shape s3"><TulipSvg :size="100" color="#86A789" :opacity="0.12" /></div>
        <div class="bg-shape s4">
          <svg viewBox="0 0 24 24" width="160" height="160" fill="#86A789" opacity="0.08">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div class="bg-shape s5"><TulipSvg :size="180" color="#86A789" :opacity="0.1" /></div>
        <div class="bg-shape s6">
          <svg viewBox="0 0 24 24" width="80" height="80" fill="#86A789" opacity="0.15">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </div>

      <button class="fp-close" aria-label="Close" @click="close">✕</button>

      <div class="fp-scene">
        
        <!-- State 1: Entering the 5 Keys -->
        <Transition name="fp-slide" mode="out-in">
          <div v-if="phase === 'keys'" class="ancient-vault">
            
            <!-- Inner Archway Aesthetic -->
            <div class="vault-archway">
              <div class="vault-dust"></div>
              
              <!-- Ornamental Top -->
              <div class="vault-ornament top-ornament">
                <svg viewBox="0 0 100 30" width="100" height="30" fill="none">
                  <path d="M10 25 Q 50 -10 90 25" stroke="#a494b4" stroke-width="1.5" opacity="0.6"/>
                  <circle cx="50" cy="10" r="4" fill="#86A789" opacity="0.8"/>
                  <path d="M40 18 L60 18 L50 25 Z" fill="#C8A84B" opacity="0.7"/>
                </svg>
              </div>

              <div class="vault-content">
                <p class="fp-eyebrow">The sanctuary awaits</p>
                <h2 class="fp-title">The Final Door</h2>
                <div class="fp-divider"></div>
                
                <p class="fp-desc">
                  Five keys lay scattered across the journey.<br>
                  Place them within the ancient stones.
                </p>
                
                <p class="fp-note">
                  If you found every clue and answer, tell me before you enter everything to open the door.
                </p>

                <div class="fp-keys-grid">
                  <!-- Row 1 (3 Inputs) -->
                  <div class="fp-row row-3">
                    <div class="input-stone">
                      <input v-model="keys[0]" type="text" placeholder="I" :class="{ correct: isInputCorrect(0) }" spellcheck="false" autocomplete="off" />
                      <div class="stone-glow" :class="{ active: isInputCorrect(0) }"></div>
                    </div>
                    <div class="input-stone">
                      <input v-model="keys[1]" type="text" placeholder="II" :class="{ correct: isInputCorrect(1) }" spellcheck="false" autocomplete="off" />
                      <div class="stone-glow" :class="{ active: isInputCorrect(1) }"></div>
                    </div>
                    <div class="input-stone">
                      <input v-model="keys[2]" type="text" placeholder="III" :class="{ correct: isInputCorrect(2) }" spellcheck="false" autocomplete="off" />
                      <div class="stone-glow" :class="{ active: isInputCorrect(2) }"></div>
                    </div>
                  </div>

                  <!-- Row 2 (2 Inputs) -->
                  <div class="fp-row row-2">
                    <div class="input-stone">
                      <input v-model="keys[3]" type="text" placeholder="IV" :class="{ correct: isInputCorrect(3) }" spellcheck="false" autocomplete="off" />
                      <div class="stone-glow" :class="{ active: isInputCorrect(3) }"></div>
                    </div>
                    <div class="input-stone">
                      <input v-model="keys[4]" type="text" placeholder="V" :class="{ correct: isInputCorrect(4) }" spellcheck="false" autocomplete="off" />
                      <div class="stone-glow" :class="{ active: isInputCorrect(4) }"></div>
                    </div>
                  </div>
                </div>

                <div class="vault-actions">
                  <transition name="fade">
                    <p v-if="duplicateWarning" class="duplicate-warning">
                      Each key must be unique. You cannot use the same answer twice.
                    </p>
                  </transition>

                  <button class="fp-submit" :class="{ ready: allCorrect }" :disabled="!allCorrect" @click="openDoor">
                    <span class="btn-rings"></span>
                    <span class="btn-text">{{ allCorrect ? 'Unlock the door' : 'Gathering the keys...' }}</span>
                  </button>
                </div>
              </div>

              <!-- Ornamental Bottom -->
              <div class="vault-ornament bottom-ornament">
                <svg viewBox="0 0 100 30" width="100" height="30" fill="none">
                  <path d="M10 5 Q 50 40 90 5" stroke="#a494b4" stroke-width="1.5" opacity="0.6"/>
                </svg>
              </div>

            </div>
          </div>
        </Transition>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import TulipSvg from './TulipSvg.vue'
import { isProposalUnlocked } from '../store'

type Phase = 'idle' | 'keys'
const phase = ref<Phase>('idle')

const router = useRouter()

const keys = ref(['', '', '', '', ''])

// Valid answers logic (can be entered in any order)
const ANSWERS = [
  // 1: Envelope Passphrase
  ['trustyearninglove', 'trust yearning love'],
  
  // 2: Scroll Egg
  ['november182024', '111824', 'nov18', 'november18', '1118'],
  
  // 3: China Box Egg
  ['surreal', 'surrealjustin', 'canihavethisdance', 'canihavedance'],
  
  // 4: Apology Egg
  ['sorry', 'imsorry', 'iamsorry'],
  
  // 5: Watcher Egg
  ['greentulipandheart', 'greentulipheart', 'greentulipandgreenheart']
]

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function getMatchedGroupIndex(val: string): number {
  if (!val) return -1
  for (let i = 0; i < ANSWERS.length; i++) {
    if (ANSWERS[i]?.some(ans => ans === val)) {
      return i
    }
  }
  return -1
}

function isInputCorrect(index: number): boolean {
  const val = normalize(keys.value[index] || '')
  return getMatchedGroupIndex(val) !== -1
}

const duplicateWarning = computed(() => {
  const matchedGroups = new Set<number>()
  for (let i = 0; i < 5; i++) {
    const val = normalize(keys.value[i] || '')
    const match = getMatchedGroupIndex(val)
    if (match !== -1) {
      if (matchedGroups.has(match)) return true
      matchedGroups.add(match)
    }
  }
  return false
})

const allCorrect = computed(() => {
  if (duplicateWarning.value) return false
  const matchedGroups = new Set<number>()
  let countCorrect = 0
  for (let i = 0; i < 5; i++) {
    const val = normalize(keys.value[i] || '')
    const match = getMatchedGroupIndex(val)
    if (match !== -1) {
      matchedGroups.add(match)
      countCorrect++
    }
  }
  return countCorrect === 5 && matchedGroups.size === 5
})

function open() {
  phase.value = 'keys'
  keys.value = ['', '', '', '', '']
}

function close() {
  phase.value = 'idle'
}

function openDoor() {
  if (allCorrect.value) {
    isProposalUnlocked.value = true
    close() // Close modal
    router.push('/my-proposal') // Route to the massive proposal view
  }
}

defineExpose({ open })
</script>

<style scoped>
/* ── OVERLAY & BACKGROUND ── */
.fp-overlay {
  position: fixed; inset: 0;
  background: rgba(250, 248, 245, 0.98);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  z-index: 10010;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}

.fp-bg-elements {
  position: absolute; inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-glow {
  position: absolute; top: 50%; left: 50%; width: 1000px; height: 1000px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(134,167,137,0.1) 0%, rgba(200,168,75,0.05) 30%, transparent 70%);
  animation: pulseGlow 15s ease-in-out infinite alternate;
}

@keyframes pulseGlow {
  0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

.bg-shape {
  position: absolute;
  animation: floatShape 25s ease-in-out infinite;
}
.s1 { top: 10%; left: 15%; animation-duration: 22s; transform: rotate(15deg); }
.s2 { bottom: 15%; right: 10%; animation-duration: 28s; transform: rotate(-20deg); }
.s3 { top: 25%; right: 20%; animation-duration: 25s; animation-delay: -5s; transform: rotate(45deg); }
.s4 { bottom: 25%; left: 5%; animation-duration: 35s; transform: rotate(-10deg); }
.s5 { top: -5%; left: 50%; animation-duration: 30s; animation-delay: -10s; transform: rotate(180deg); }
.s6 { bottom: 10%; left: 45%; animation-duration: 20s; transform: rotate(90deg); }

@keyframes floatShape {
  0%, 100% { margin-top: 0; margin-left: 0; }
  50% { margin-top: -30px; margin-left: 20px; }
}

/* ── CLOSE BUTTON ── */
.fp-close {
  position: absolute; top: 2rem; right: 2rem;
  background: rgba(134,167,137,0.05); border: 1px solid rgba(134,167,137,0.2);
  font-size: 1.2rem; color: rgba(134,167,137,0.8);
  cursor: pointer; padding: 0.6rem; border-radius: 50%;
  z-index: 10; width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s;
}
.fp-close:hover { 
  color: #fff; background: rgba(134,167,137,0.8); 
  transform: rotate(90deg);
}

/* ── SCENE & VAULT DOOR CONCEPT ── */
.fp-scene {
  width: 100%; max-width: 800px;
  position: relative;
  z-index: 2;
  padding: 2rem;
}

.ancient-vault {
  position: relative;
  background: #fbf9f6;
  border-radius: 12px 12px 2px 2px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.5);
  overflow: hidden;
}

.vault-archway {
  position: relative;
  background: linear-gradient(180deg, rgba(251,249,246,1) 0%, rgba(244,242,238,1) 100%);
  border: 12px solid #e8e4dc;
  border-bottom: 24px solid #dcd8d0;
  border-radius: 12px 12px 2px 2px;
  padding: 4rem 3rem 5rem;
  box-shadow: inset 0 20px 40px rgba(0,0,0,0.03);
}

.vault-dust {
  position: absolute; inset: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="a"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23a)" opacity="0.04"/></svg>');
  pointer-events: none;
}

.vault-ornament {
  position: absolute; left: 50%; transform: translateX(-50%);
  width: 100px; height: 30px;
}
.top-ornament { top: 1.5rem; }
.bottom-ornament { bottom: 1.5rem; }

.fp-eyebrow {
  font-family: 'Cormorant Garamond', serif; font-size: 0.85rem;
  letter-spacing: 0.3em; text-transform: uppercase; color: rgba(134,167,137,0.8);
  text-align: center; margin: 0 0 1rem;
}
.fp-title {
  font-family: 'Cormorant Garamond', serif; font-size: 3rem;
  color: var(--ink); text-align: center; margin: 0 0 1.5rem;
  font-weight: 500; letter-spacing: 0.02em;
}
.fp-divider {
  height: 2px; width: 140px; margin: 0 auto 2rem;
  background: linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent);
}
.fp-desc {
  font-family: 'Cormorant Garamond', serif; font-size: 1.2rem;
  line-height: 1.8; color: var(--ink); text-align: center; margin: 0 0 1rem;
  font-style: italic; opacity: 0.85;
}
.fp-note {
  font-family: 'Cormorant Garamond', serif; font-size: 1.05rem;
  line-height: 1.6; color: #86A789; text-align: center; margin: 0 0 3rem;
  font-weight: 500; font-style: italic;
}

/* ── 5 KEYS GRID (2 ROWS) ── */
.fp-keys-grid {
  display: flex; flex-direction: column; gap: 2.5rem;
  margin-bottom: 4rem;
}

.fp-row {
  display: flex; justify-content: center; gap: 2.5rem;
}

.input-stone {
  position: relative;
  width: 140px; height: 60px;
}

.input-stone input {
  position: absolute; inset: 0; width: 100%; height: 100%;
  background: #fbf9f6;
  border: 2px solid rgba(134,167,137,0.3);
  border-radius: 8px;
  font-family: 'Cormorant Garamond', serif; font-size: 1.4rem;
  color: var(--ink); text-align: center; font-weight: 500;
  outline: none; transition: 0.4s; z-index: 2;
  box-shadow: inset 0 4px 10px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.05);
}
.input-stone input::placeholder {
  color: rgba(134,167,137,0.4); font-style: italic;
}
.input-stone input:focus {
  border-color: #86A789; box-shadow: 0 0 0 4px rgba(134,167,137,0.1), inset 0 2px 5px rgba(0,0,0,0.02);
  transform: translateY(-2px);
}
.input-stone input.correct {
  border-color: #C8A84B;
  color: #C8A84B;
  background: #fffdfa;
  box-shadow: 0 8px 24px rgba(200,168,75,0.2), inset 0 2px 5px rgba(0,0,0,0.01);
  text-shadow: 0 0 8px rgba(200,168,75,0.3);
}

.stone-glow {
  position: absolute; inset: -15px;
  background: radial-gradient(circle, rgba(200,168,75,0.3) 0%, transparent 60%);
  opacity: 0; transform: scale(0.8); transition: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 1; pointer-events: none;
}
.stone-glow.active {
  opacity: 1; transform: scale(1);
  animation: floatStoneGlow 4s infinite alternate ease-in-out;
}

@keyframes floatStoneGlow {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.1); opacity: 1; }
}

/* ── VAULT ACTIONS ── */
.vault-actions {
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
}

.duplicate-warning {
  font-family: 'Inter', sans-serif; font-size: 0.85rem;
  color: #c97070; margin: 0; font-weight: 500;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fp-submit {
  position: relative;
  padding: 1.2rem 3rem;
  background: var(--ink); color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px; overflow: hidden;
  font-family: 'Inter', sans-serif; font-size: 0.95rem; letter-spacing: 0.15em;
  text-transform: uppercase; cursor: pointer; transition: 0.4s;
}
.fp-submit:disabled {
  background: #e8e4dc; color: #a8a098; border-color: transparent;
  cursor: not-allowed;
}
.fp-submit.ready {
  background: #86A789; border-color: #86A789;
  box-shadow: 0 10px 30px rgba(134,167,137,0.4);
}
.fp-submit.ready:hover {
  background: #759478; transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(134,167,137,0.5);
}

.btn-rings {
  position: absolute; top: 50%; left: 50%; width: 200%; padding-bottom: 200%;
  transform: translate(-50%, -50%) scale(0);
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
  border-radius: 50%; transition: 0.6s ease-out; pointer-events: none;
}
.fp-submit.ready:hover .btn-rings { transform: translate(-50%, -50%) scale(1); }
.btn-text { position: relative; z-index: 2; font-weight: 500; }

/* ── ANIMATIONS ── */
.fp-fade-enter-active { transition: opacity 0.8s ease; }
.fp-fade-leave-active { transition: opacity 0.6s ease; }
.fp-fade-enter-from, .fp-fade-leave-to { opacity: 0; }

.fp-slide-enter-active, .fp-slide-leave-active { transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
.fp-slide-enter-from { opacity: 0; transform: translateY(40px) scale(0.98); }
.fp-slide-leave-to { opacity: 0; transform: translateY(-40px) scale(0.98); }

/* ── RESPONSIVE ── */
@media (max-width: 680px) {
  .fp-scene { padding: 1rem; }
  .vault-archway { padding: 3rem 1.5rem 4rem; border-width: 8px; border-bottom-width: 16px; }
  .fp-title { font-size: 2.2rem; }
  .fp-row { flex-direction: column; gap: 1.5rem; align-items: center; }
  .fp-keys-grid { gap: 1.5rem; }
  .input-stone { width: 100%; max-width: 200px; }
}
</style>
