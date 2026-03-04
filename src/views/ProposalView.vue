<template>
  <div class="proposal-page">
    <!-- Immersive Background -->
    <div class="proposal-bg" aria-hidden="true">
      <div class="bg-glow"></div>
      <div class="floating-rose r1">🌹</div>
      <div class="floating-rose r2">🌹</div>
      <div class="floating-rose r3">🌹</div>
      <div class="floating-rose r4">🌹</div>
    </div>

    <!-- Hidden audio player for "A Thousand Years" -->
    <iframe
      width="1"
      height="1"
      class="hidden-audio"
      src="https://www.youtube-nocookie.com/embed/5ptdEemGjrQ?autoplay=1&start=20&loop=1&playsinline=1"
      allow="autoplay"
      frameborder="0"
    ></iframe>

    <!-- Proposal Content -->
    <main class="proposal-content">
      <div class="letter-container">
        <p class="greeting">To my one and only, my entire world,</p>

        <p class="para">
          You have found the last key. You have solved all the puzzles, found all the secret messages, and unlocked the deepest aspects of the space I created for you. But the most beautiful truth is that you unlocked my heart a long time ago. This whole adventure, with all the secret messages and puzzles, was my way of leading you to this very place.
        </p>

        <p class="para">
          Take a deep breath and listen carefully to these words.
        </p>

        <p class="para">
          Looking back at where we started, I am deeply touched by the progress we have made. We started this adventure with our little green tulip and heart, and we have been through the high points, the mundane moments, and the moments we had to reach for understanding. Through every late night, every burst of joy, and every tear, you have been there for me. You are the most wonderful thing that has ever happened to me, and I thank God every day for the universe to bring you into my life.
        </p>

        <p class="para">
          I wished for you to read my apologies before you came. I wished for you to read the words "I am still learning" because I want to stand before you today with complete transparency. I know that I have not been perfect. I know that there have been times when I have not been the anchor that you need. But I also need you to know that learning to love you, that trying to be the man that you need me to be, has been the greatest privilege that I have ever known. I have learned from every mistake that I have made because it has only served to reinforce my unwavering commitment to never living another day without you. I promise to spend the rest of my life ensuring that your peace remains, that your heart remains honored, and that you never doubt for a moment how fiercely you are loved. Before you, I never fully understood what it meant to be fully seen and fully safe. You are my sanctuary. You give me a kind of mercy that I can barely begin to express. You give me a kind of patience that makes me feel like I am not worthy. But when I look at you, I do not simply see the most beautiful woman that I have ever known. I see my family. I see my home.
        </p>

        <p class="para">
          While I can’t promise you that the road ahead is flawless, I can promise you this: I will never stop choosing you. I will choose you on our best days and choose you even more fervently on our worst days. I will celebrate your triumphs as if they were my own, and I will stand beside you through the darkness. And I will stand beside you through it all.
        </p>

        <p class="para">
          You have read all of my words. You have uncovered all of my secrets, hidden as they were behind these digital walls. And yet, the greatest truth of all is not written on these screens.
        </p>

        <p class="para">
          It is here, in this room, with you.
        </p>

        <p class="para" style="font-weight: 500;">
          Look away from these screens, turn around, and look at me.
        </p>

        <p class="signoff">
          Jessa Mae Condrillon,
        </p>
      </div>

      <div class="question-container">
        <h1 class="big-question">Will you marry me?</h1>

        <div class="action-buttons">
          <button class="btn btn-yes" @click="answerClicked('Yes')">Yes</button>
          <button class="btn btn-absolute" @click="answerClicked('Absolutely Yes')">Absolutely Yes</button>
        </div>

        <Transition name="fade">
          <p v-if="chosenAnswer" class="success-msg">
            She said {{ chosenAnswer }}! 💍❤️
          </p>
        </Transition>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import confetti from 'canvas-confetti'

const chosenAnswer = ref('')

function answerClicked(ans: string) {
  chosenAnswer.value = ans
  triggerConfetti()
}

function triggerConfetti() {
  const duration = 15 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000, colors: ['#ffb7b2', '#e2858e', '#f8f4e6', '#c8a84b'] }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    // since particles fall down, start a bit higher than random
    confetti({
      ...defaults, particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    })
    confetti({
      ...defaults, particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    })
  }, 250)
}
</script>

<style scoped>
.proposal-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: #fdfafa;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1rem 8rem;
  z-index: 10020; /* Ensure it stays well above everything else */
}

.proposal-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
}
.bg-glow {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at center, rgba(232,160,176,0.08) 0%, transparent 80%);
}

.floating-rose {
  position: absolute; font-size: 2rem; opacity: 0.15;
  animation: floatRose 20s infinite ease-in-out;
}
.r1 { top: 15%; left: 10%; animation-duration: 25s; filter: hue-rotate(30deg); }
.r2 { top: 60%; right: 15%; animation-duration: 30s; animation-delay: -5s; transform: scale(1.5);}
.r3 { bottom: 20%; left: 20%; animation-duration: 22s; animation-delay: -10s; transform: scale(1.2);}
.r4 { top: 30%; right: 5%; animation-duration: 28s; filter: hue-rotate(-20deg); }

@keyframes floatRose {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-30px) rotate(15deg); }
}

.hidden-audio {
  position: absolute; opacity: 0; pointer-events: none;
}

.proposal-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 720px;
  animation: fadeIn 2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.letter-container {
  margin-bottom: 6rem;
}

.greeting {
  font-family: 'Cormorant Garamond', serif; font-size: 1.8rem;
  font-style: italic; color: var(--sage-dark); margin-bottom: 2rem;
}

.para {
  font-family: 'Cormorant Garamond', serif; font-size: 1.25rem;
  line-height: 2; color: var(--ink); margin-bottom: 1.8rem;
}

.signoff {
  font-family: 'Cormorant Garamond', serif; font-size: 1.6rem;
  font-weight: 500; font-style: italic; color: var(--sage-dark);
  margin-top: 3rem; text-align: right;
}

.question-container {
  text-align: center;
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 1px solid rgba(232,160,176,0.3);
}

.big-question {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 500;
  color: var(--ink);
  line-height: 1.1;
  margin-bottom: 4rem;
}

.action-buttons {
  display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
}

.btn {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem; letter-spacing: 0.15em; text-transform: uppercase;
  padding: 1.2rem 4rem; border-radius: 50px; cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 300px;
}

.btn-absolute {
  background: var(--ink); border: 2px solid var(--ink); color: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.btn-absolute:hover {
  background: #fff; color: var(--ink); transform: translateY(-4px) scale(1.02);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.btn-yes {
  background: transparent; border: 2px solid rgba(232,160,176,0.5); color: var(--ink);
}
.btn-yes:hover {
  border-color: var(--ink); transform: translateY(-2px);
}

.success-msg {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem; font-style: italic; color: #b46878;
  margin-top: 3rem; animation: pulse 2s infinite alternate;
}
@keyframes pulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 680px) {
  .proposal-page { padding: 3rem 1.5rem 6rem; }
  .greeting { font-size: 1.5rem; }
  .para { font-size: 1.15rem; }
  .big-question { font-size: 3rem; margin-bottom: 3rem; }
  .btn { width: 100%; min-width: 0; padding: 1rem 2rem; font-size: 1rem; }
}
</style>
