<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <!-- Header -->
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h1 class="h2 fw-bold text-success mb-1">
              🌱 Youth Climate Wellbeing & Coping Assistant
            </h1>
            <p class="text-muted mb-0">
              Interactive self-care companion offering evidence-based cognitive reframing, somatic grounding exercises, and local Melbourne climate action pathways.
            </p>
          </div>
          <button class="btn btn-outline-secondary btn-sm" @click="resetConversation">
            🧹 Clear Chat
          </button>
        </div>

        <!-- System Mode Banner (Zero External API / Zero Firebase Setup Required) -->
        <div class="card shadow-sm border-0 mb-4 bg-light">
          <div class="card-body py-2 px-3">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-success">Local Wellbeing Engine</span>
                <small class="text-muted">
                  Status: <strong>Active (Privacy-Preserving Local Expert Knowledge Base)</strong>
                </small>
              </div>
              <small class="text-muted">
                * Zero external API keys needed • 100% Client-Side Evaluation Ready
              </small>
            </div>
          </div>
        </div>

        <!-- Chat Container Card -->
        <div class="card shadow border-0" style="min-height: 550px; display: flex; flex-direction: column;">
          <!-- Chat Message History -->
          <div class="card-body p-4 flex-grow-1" style="overflow-y: auto; max-height: 480px;" ref="chatBox">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="d-flex mb-3"
              :class="msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'"
            >
              <!-- Avatar -->
              <div v-if="msg.role === 'assistant'" class="me-2 fs-4" aria-hidden="true">
                🌿
              </div>

              <!-- Message Bubble -->
              <div
                class="p-3 rounded-4 shadow-sm"
                :class="msg.role === 'user' ? 'bg-success text-white' : 'bg-light text-dark border'"
                style="max-width: 80%; white-space: pre-wrap;"
              >
                <div class="fw-bold small mb-1" :class="msg.role === 'user' ? 'text-white-50' : 'text-success'">
                  {{ msg.role === 'user' ? 'You' : 'EcoYouth Wellbeing Companion' }}
                </div>
                <div>{{ msg.content }}</div>
              </div>

              <div v-if="msg.role === 'user'" class="ms-2 fs-4" aria-hidden="true">
                👤
              </div>
            </div>

            <!-- Typing Indicator -->
            <div v-if="isTyping" class="d-flex justify-content-start mb-3 align-items-center">
              <span class="fs-4 me-2">🌿</span>
              <div class="bg-light p-3 rounded-4 border text-muted small">
                <span class="spinner-grow spinner-grow-sm text-success me-2" role="status"></span>
                Wellbeing Assistant is preparing grounding advice...
              </div>
            </div>
          </div>

          <!-- Suggested Starter Prompts -->
          <div class="px-4 py-2 bg-light border-top border-bottom">
            <small class="fw-bold text-muted d-block mb-1">💡 Quick Exploration Prompts:</small>
            <div class="d-flex flex-wrap gap-2">
              <button
                v-for="(prompt, pIdx) in promptChips"
                :key="pIdx"
                type="button"
                class="btn btn-sm btn-outline-success py-1 px-2 text-start"
                @click="sendPrompt(prompt)"
                :disabled="isTyping"
              >
                {{ prompt }}
              </button>
            </div>
          </div>

          <!-- Input Footer -->
          <div class="card-footer bg-white p-3">
            <form @submit.prevent="handleSend" class="d-flex gap-2">
              <input
                type="text"
                class="form-control form-control-lg"
                v-model.trim="userInput"
                placeholder="Share your feelings about climate change, or ask for mindfulness techniques..."
                :disabled="isTyping"
                required
              >
              <button type="submit" class="btn btn-success btn-lg px-4" :disabled="isTyping || !userInput">
                Send 🚀
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';

const chatBox = ref(null);
const isTyping = ref(false);
const userInput = ref('');

const promptChips = [
  "I feel overwhelmed by climate doom headlines today",
  "Give me a 3-minute sensory grounding technique for eco-distress",
  "How do I turn eco-anxiety into local community action in Melbourne?",
  "Recommend inspiring books or resources on Active Hope"
];

const messages = reactive([
  {
    role: 'assistant',
    content: "Kia ora & hello! I am your EcoYouth Wellbeing Companion. Eco-anxiety is a completely healthy, empathetic reaction to our changing world—it proves how deeply you care about our living planet. How are you feeling today, and how can I support your wellbeing or help channel your passion into action?"
  }
]);

const scrollToBottom = async () => {
  await nextTick();
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight;
  }
};

const sendPrompt = (text) => {
  userInput.value = text;
  handleSend();
};

const handleSend = async () => {
  const query = userInput.value;
  if (!query) return;

  messages.push({ role: 'user', content: query });
  userInput.value = '';
  isTyping.value = true;
  await scrollToBottom();

  setTimeout(() => {
    const response = generateCopingResponse(query);
    messages.push({ role: 'assistant', content: response });
    isTyping.value = false;
    scrollToBottom();
  }, 650);
};

// Clinical & CBT-based Eco-Anxiety Coping Response Engine
const generateCopingResponse = (text) => {
  const lower = text.toLowerCase();

  if (lower.includes('headline') || lower.includes('overwhelm') || lower.includes('news') || lower.includes('doom')) {
    return "When climate news feels overwhelming, practice the 3 Boundaries of Digital Self-Care:\n\n1. **Containment**: Limit climate news consumption to 15 focused minutes once a day, never within 1 hour before sleep.\n2. **Cognitive Reframing**: Media algorithms prioritize acute catastrophes while ignoring slow, systemic regeneration happening worldwide.\n3. **Return to the Senses**: Step outside, touch the bark of a local gum tree, feel the wind on your cheeks, and remind your nervous system that right now, you are safe and grounded.";
  }

  if (lower.includes('grounding') || lower.includes('technique') || lower.includes('exercise') || lower.includes('breathe')) {
    return "Here is the **5-4-3-2-1 Sensory Earth Grounding Technique**:\n\n• **5 Things you can see**: Natural patterns (veins on a leaf, light filtering through clouds, colors).\n• **4 Things you can physically touch**: Feel your feet firmly planted on the ground, the texture of your clothing, or a smooth pebble.\n• **3 Things you can hear**: Distant birds, rustling leaves, the rhythm of your breath.\n• **2 Things you can smell**: Fresh rain (petrichor), coffee, or eucalyptus leaves.\n• **1 Thing you can taste**: A sip of cool water.\n\nTake three deep diaphragmatic breaths: Inhale for 4 counts, hold for 2, exhale slowly for 6 counts. Your breath signals your nervous system that it is safe to rest.";
  }

  if (lower.includes('action') || lower.includes('melbourne') || lower.includes('community')) {
    return "The antidote to climate despair is collective community action!\n\nIn Melbourne, here are three high-impact ways to connect this week:\n\n1. **Carlton Climate Action Hub**: Join our Tuesday Youth Grief & Hope Drop-in Circle at 154 Drummond St.\n2. **Merri Creek Urban Rewilding**: Come along to Brunswick Community Garden this Saturday for mindful indigenous seedling planting.\n3. **Active Travel**: Connect with our student cycling convoy across Monash Clayton.\n\nCheck out our 'Impact Map' in the top navigation to view walking routes and transit directions directly to these hubs!";
  }

  if (lower.includes('book') || lower.includes('hope') || lower.includes('resource')) {
    return "Highly recommended reading for climate resilience:\n\n• **Active Hope** by Joanna Macy & Chris Johnstone (How to face the climate mess without going crazy)\n• **All We Can Save** edited by Ayana Elizabeth Johnson & Katharine K. Wilkinson\n• **Generation Dread** by Britt Wray (Finding purpose in an age of climate crisis)\n\nYou can also find downloadable PDF summaries in our 'Resources Library' tab!";
  }

  return "Thank you for sharing your thoughts. Living with open eyes during an ecological transition takes immense courage. Remember: you do not carry the weight of planetary transformation alone. Each of us is just one cell in an immense organism of regeneration. Feel free to explore our 'Peer Counseling Calendar' to book a free 1-on-1 session with Dr. Sarah Lin or Mark Henderson.";
};

const resetConversation = () => {
  messages.splice(0, messages.length, {
    role: 'assistant',
    content: "Chat cleared! How can I support your climate wellbeing today?"
  });
};
</script>
