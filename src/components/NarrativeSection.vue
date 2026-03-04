<template>
  <section
    id="narrative"
    class="section narrative-section"
  >

    <!-- ── Scattered background tulips — many colors ────── -->
    <!-- Upper-right background tulip -->
    <div
      class="bg-tulip bg-tulip--1"
      aria-hidden="true"
    >
      <TulipSvg :size="110" :opacity="0.07" color="#86A789" />
    </div>
    <div class="bg-tulip bg-tulip--2" aria-hidden="true">
      <TulipSvg :size="80"  :opacity="0.065" color="#e8a0b0" />
    </div>
    <div class="bg-tulip bg-tulip--3" aria-hidden="true">
      <TulipSvg :size="65"  :opacity="0.055" color="#b8a8d0" />
    </div>
    <div class="bg-tulip bg-tulip--4" aria-hidden="true">
      <TulipSvg :size="55"  :opacity="0.06"  color="#d4a0a8" />
    </div>
    <div class="bg-tulip bg-tulip--5" aria-hidden="true">
      <TulipSvg :size="90"  :opacity="0.055" color="#a8c4aa" />
    </div>
    <div class="bg-tulip bg-tulip--6" aria-hidden="true">
      <TulipSvg :size="48"  :opacity="0.06"  color="#e8a0b0" />
    </div>
    <div class="bg-tulip bg-tulip--7" aria-hidden="true">
      <TulipSvg :size="72"  :opacity="0.05"  color="#86A789" />
    </div>
    <div class="bg-tulip bg-tulip--8" aria-hidden="true">
      <TulipSvg :size="42"  :opacity="0.07"  color="#b8a8d0" />
    </div>

    <!-- ── Section header ──────────────────────── -->
    <p class="section-label">I. The Narrative</p>
    <h2 class="section-title">
      A letter,<br />
      <em class="title-accent">written from the heart.</em>
    </h2>
    <div class="sage-divider" />

    <!-- ── Letter body ─────────────────────────── -->
    <div class="narrative-body">
      <p
        v-for="(line, i) in lines"
        :key="i"
        class="narrative-sentence"
        :class="{
          revealed: revealed[i],
          'italic-line':  line.italic,
          'accent-line':  line.accent,
          'closing-line': line.closing,
        }"
        :data-index="i"
        :ref="(el) => registerRef(el as Element | null, i)"
      >
        <!-- Regular lines — split line[3] to inject clickable EE trigger -->
        <template v-if="!line.closing && i !== 3">{{ line.text }}</template>

        <!-- Line 3: "I am still learning." is a hidden Easter egg trigger -->
        <template v-else-if="!line.closing && i === 3">
          <span
            class="ee-trigger"
            @click="apologyEggRef?.open()"
          >I am still learning.</span>{{ line.text.slice('I am still learning.'.length) }}
        </template>

        <!-- Closing line: signature + inline envelope button -->
        <template v-else-if="line.closing">
          <span>{{ line.text }}</span>
          <button
            class="inline-note-btn"
            aria-label="Open a quiet note"
            title="There is a note for you here"
            @click="noteOpen = true"
          >
            <!-- Tiny envelope icon -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                 stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 7l10 7 10-7"/>
            </svg>
            <span class="note-dot" aria-hidden="true"/>
          </button>
        </template>
      </p>
    </div>

    <!-- ── Secret note modal (v-model) ──────────── -->
    <SecretLetterModal v-model:open="noteOpen" />

    <!-- ── EE#4: Apology egg ──────────────────── -->
    <ApologyEgg ref="apologyEggRef" />
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import TulipSvg from './TulipSvg.vue'
import SecretLetterModal from './SecretLetterModal.vue'
import ApologyEgg from './ApologyEgg.vue'

interface Line {
  text: string
  italic?: boolean
  accent?: boolean
  closing?: boolean
}

const lines: Line[] = [
  {
    text: 'To My Most Beloved,',
    italic: true,
  },
  {
    text: "I've been reflecting a lot lately on where we started and where we are. I'll be honest: I know I haven't always been the consistent foundation you deserve to lean on.",
  },
  {
    text: "It weighs on me, knowing there were times I was forgetful or irresponsible with the things that matter most, and for the moments I didn't give you the steady assurance you need.",
    accent: true,
  },
  {
    text: "I am still learning. I'm learning how to show up for you properly - not just in the big gestures, but in the small, quiet moments where you need to feel seen and held.",
  },
  {
    text: 'I often think back to the day you finally said "yes" to us. I can still feel the weight of that little note you gave me: "Let\'s Do Boyfriend | Girlfriend thing."',
  },
  {
    text: "I remember how my heart absolutely fluttered in that moment. I was so happy I could hardly breathe. That note wasn't just a piece of paper - it was you giving me a chance, and it's a chance I never want to take for granted again.",
    accent: true,
  },
  {
    text: "You are the reason I want to be better every single day. I want to be the man who honors that note and the girl who wrote it.",
  },
  {
    text: "I am working every day to become the person who shows up fully, with my whole heart, just like you've always done for me.",
    accent: true,
  },
  {
    text: "Every morning I wake up, I choose you. It's not out of habit or routine - it's out of a quiet, bone-deep certainty that nothing in this world makes more sense than having you beside me.",
  },
  {
    text: "Thank you for staying. Thank you for believing in what we are, and for having faith in the man I am still becoming. I'm so grateful that we're still doing this \"thing\" together.",
    italic: true,
  },
  {
    text: '— Always yours',
    closing: true,
  },
]

const noteOpen     = ref(false)
const apologyEggRef= ref<InstanceType<typeof ApologyEgg> | null>(null)
const revealed     = reactive<boolean[]>(new Array(lines.length).fill(false))
const elRefs       = ref<(Element | null)[]>([])
let observer: IntersectionObserver | null = null

function registerRef(el: Element | null, index: number) {
  elRefs.value[index] = el
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const idx = Number((entry.target as HTMLElement).dataset.index ?? -1)
        if (entry.isIntersecting && idx >= 0) revealed[idx] = true
      })
    },
    { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
  )
  setTimeout(() => elRefs.value.forEach((el) => el && observer?.observe(el)), 120)
})
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.narrative-section {
  border-bottom: 1px solid var(--parchment);
  position: relative;
  overflow: hidden;
}

.title-accent {
  font-style: italic;
  color: var(--sage-dark);
}

/* Sage accent sentences */
.narrative-sentence.accent-line {
  color: var(--sage-dark);
  font-weight: 500;
}

/* Closing signature */
.narrative-sentence.closing-line {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.15rem, 2.5vw, 1.5rem);
  font-style: italic;
  color: var(--sage);
  margin-top: 2rem;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

/* Inline envelope button */
.inline-note-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(250, 249, 246, 0.9);
  border: 1px solid var(--parchment);
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
  color: var(--ink-muted);
  flex-shrink: 0;
  backdrop-filter: blur(8px);
}

.inline-note-btn:hover {
  border-color: var(--sage);
  box-shadow: 0 3px 14px rgba(134, 167, 137, 0.28);
  transform: scale(1.1);
  color: var(--sage-dark);
}

/* Pulsing red unread dot */
.note-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e8a0a0;
  border: 1.5px solid #faf9f6;
  animation: dotPulse 2.4s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.35); opacity: 0.65; }
}

/* ── Background tulip positions ──────────────── */
.bg-tulip {
  position: absolute;
  pointer-events: none;
  user-select: none;
}

.bg-tulip--1 { top: 2rem;   right: 1rem;  transform: rotate(8deg); }
.bg-tulip--2 { top: 5rem;   left: -1rem;  transform: rotate(-18deg) scaleX(-1); }
.bg-tulip--3 { top: 35%;    right: -0.5rem; transform: rotate(22deg); }
.bg-tulip--4 { top: 28%;    left: 0rem;   transform: rotate(-10deg); }
.bg-tulip--5 { bottom: 15%; right: -1rem; transform: rotate(6deg); }
.bg-tulip--6 { bottom: 10%; left: 2rem;   transform: rotate(-22deg) scaleX(-1); }
.bg-tulip--7 { bottom: 35%; left: -1rem;  transform: rotate(14deg); }
.bg-tulip--8 { top: 60%;    right: 0rem;  transform: rotate(-6deg) scaleX(-1); }

/* Interactive tulip (EE#5) */
.tulip-interactive {
  pointer-events: all !important;
  cursor: pointer;
}

/* Hidden EE trigger — same color, no hover */
.ee-trigger {
  cursor: pointer;
  color: inherit;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  display: inline;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
</style>
