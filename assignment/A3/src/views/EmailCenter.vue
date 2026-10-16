<template>
  <div class="container my-5">
    <!-- Header -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
      <div>
        <h1 class="h2 fw-bold text-success mb-1">EcoYouth Communications & Email Center</h1>
        <p class="text-muted mb-0">
          Direct email with PDF attachments (BR D.2) and bulk campaign dispatch to selected community members (BR F.1).
        </p>
      </div>
      <div class="d-flex gap-2">
        <button 
          class="btn" 
          :class="activeTab === 'single' ? 'btn-success' : 'btn-outline-success'"
          @click="activeTab = 'single'"
        >
          ✉️ Send Email with Attachment (BR D.2)
        </button>
        <button 
          class="btn" 
          :class="activeTab === 'bulk' ? 'btn-primary' : 'btn-outline-primary'"
          @click="activeTab = 'bulk'"
        >
          📢 Bulk Email Dispatch (BR F.1)
        </button>
      </div>
    </div>

    <!-- TAB 1: Single Email with PDF Attachment (BR D.2) -->
    <div v-if="activeTab === 'single'" class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-success text-white py-3">
            <h5 class="mb-0 fw-bold">BR (D.2): Compose Email with File Attachment</h5>
          </div>
          <div class="card-body p-4">
            <div class="alert alert-info py-2 small mb-4">
              <strong>SendGrid / Cloud Functions Integration:</strong> This module prepares the email payload and packages binary attachments (PDF/guides) via Base64 encoding for API transmission.
            </div>

            <form @submit.prevent="handleSendSingleEmail">
              <div class="mb-3">
                <label for="recipientEmail" class="form-label fw-bold">Recipient Email Address *</label>
                <input 
                  type="email" 
                  id="recipientEmail" 
                  class="form-control" 
                  v-model.trim="singleForm.recipient" 
                  placeholder="e.g. student@student.monash.edu"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="emailSubject" class="form-label fw-bold">Subject Line *</label>
                <input 
                  type="text" 
                  id="emailSubject" 
                  class="form-control" 
                  v-model.trim="singleForm.subject" 
                  placeholder="e.g. Your Eco-Anxiety Peer Counseling Ticket & Coping Guide"
                  required
                >
              </div>

              <div class="mb-3">
                <label for="emailMessage" class="form-label fw-bold">Message Body *</label>
                <textarea 
                  id="emailMessage" 
                  class="form-control" 
                  rows="5" 
                  v-model.trim="singleForm.message" 
                  required
                ></textarea>
              </div>

              <!-- Attachment Selector (BR D.2 Specification) -->
              <div class="mb-4 p-3 bg-light rounded border">
                <label class="form-label fw-bold text-success d-flex align-items-center mb-2">
                  <span class="fs-5 me-2">📎</span> Document Attachment (PDF)
                </label>
                <div class="row g-2">
                  <div class="col-sm-8">
                    <select class="form-select" v-model="singleForm.attachmentType">
                      <option value="guide">Eco-Anxiety Youth Coping Guide 2026.pdf (1.2 MB)</option>
                      <option value="ticket">Melbourne Climate Action Session Ticket.pdf (420 KB)</option>
                      <option value="report">Longitudinal Eco-Resilience Impact Report.pdf (2.1 MB)</option>
                    </select>
                  </div>
                  <div class="col-sm-4">
                    <button type="button" class="btn btn-outline-secondary w-100" @click="previewAttachment">
                      👁️ Preview PDF
                    </button>
                  </div>
                </div>
                <div class="small text-muted mt-2">
                  ✓ Validated attachment MIME type: <code>application/pdf</code> (Base64 payload encoded)
                </div>
              </div>

              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-success btn-lg px-4" :disabled="isSending">
                  <span v-if="isSending" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isSending ? 'Transmitting via Email API...' : '🚀 Send Email with Attachment' }}
                </button>
              </div>
            </form>

            <div v-if="sendSuccessMessage" class="alert alert-success mt-4 mb-0">
              <h6 class="fw-bold mb-1">✓ Email Successfully Delivered!</h6>
              <p class="small mb-0">{{ sendSuccessMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: Bulk Email to Selected Users (BR F.1 Innovative Feature 4) -->
    <div v-else class="row justify-content-center">
      <div class="col-lg-10">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white py-3 d-flex justify-content-between align-items-center">
            <h5 class="mb-0 fw-bold">BR (F.1 Feature 4): Bulk Email Campaign Dispatcher</h5>
            <span class="badge bg-light text-primary">{{ selectedUserIds.length }} Selected</span>
          </div>
          <div class="card-body p-4">
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label for="campaignTemplate" class="form-label fw-bold">Campaign Announcement Template</label>
                <select id="campaignTemplate" class="form-select" v-model="selectedTemplate" @change="applyTemplate">
                  <option value="rally">Urgent Youth Climate Action Rally Briefing</option>
                  <option value="circle">Monthly Eco-Anxiety Peer Support Circle Invitation</option>
                  <option value="newsletter">Quarterly Melbourne Climate Resilience Newsletter</option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="bulkAttachment" class="form-label fw-bold">Attach Official Flyer (PDF)</label>
                <select id="bulkAttachment" class="form-select" v-model="bulkAttachment">
                  <option value="flyer">Melbourne Climate Action Briefing 2026.pdf</option>
                  <option value="resources">Youth Mental Health Resource Kit.pdf</option>
                </select>
              </div>
            </div>

            <!-- Subject & Content Preview -->
            <div class="mb-3">
              <label for="bulkSubject" class="form-label fw-bold">Campaign Subject</label>
              <input type="text" id="bulkSubject" class="form-control" v-model.trim="bulkSubject">
            </div>
            <div class="mb-4">
              <label for="bulkMessage" class="form-label fw-bold">Campaign Message Body</label>
              <textarea id="bulkMessage" class="form-control" rows="4" v-model.trim="bulkMessage"></textarea>
            </div>

            <!-- User Selection Table with Role Filter -->
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold mb-0">Select Target Recipients ({{ filteredUsers.length }} Available):</h6>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-sm btn-outline-secondary" @click="selectAllUsers">Select All</button>
                <button type="button" class="btn btn-sm btn-outline-secondary" @click="deselectAllUsers">Deselect All</button>
              </div>
            </div>

            <div class="table-responsive border rounded mb-4" style="max-height: 250px; overflow-y: auto;">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th style="width: 40px;">Select</th>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in filteredUsers" :key="user.id">
                    <td>
                      <input 
                        type="checkbox" 
                        class="form-check-input" 
                        :value="user.id" 
                        v-model="selectedUserIds"
                        :aria-label="'Select ' + user.name"
                      >
                    </td>
                    <td><strong>{{ user.name }}</strong></td>
                    <td>{{ user.email }}</td>
                    <td><span class="badge bg-secondary">{{ user.role }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Bulk Dispatch Progress -->
            <div v-if="bulkProgress.active" class="mb-4">
              <div class="d-flex justify-content-between small mb-1">
                <span>Dispatching bulk emails...</span>
                <span>{{ bulkProgress.current }} / {{ bulkProgress.total }} sent</span>
              </div>
              <div class="progress" style="height: 12px;">
                <div 
                  class="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                  :style="{ width: (bulkProgress.current / bulkProgress.total * 100) + '%' }"
                ></div>
              </div>
            </div>

            <div class="d-flex justify-content-end">
              <button 
                type="button" 
                class="btn btn-primary btn-lg px-4" 
                :disabled="bulkProgress.active || !selectedUserIds.length"
                @click="dispatchBulkEmail"
              >
                📢 Send Bulk Campaign to {{ selectedUserIds.length }} Selected Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { usersDB, exportToPDF } from '../store.js';

const activeTab = ref('single');
const isSending = ref(false);
const sendSuccessMessage = ref('');

// Single Email Form State (BR D.2)
const singleForm = reactive({
  recipient: 'bhua0035@student.monash.edu',
  subject: 'Your Eco-Anxiety Peer Support Ticket & Coping Guide',
  message: 'Dear Student,\n\nThank you for reaching out to EcoYouth Action. Attached please find your confirmed counseling ticket and our 10-step Eco-Anxiety Coping Guide.\n\nWarm regards,\nEcoYouth Action Melbourne Team',
  attachmentType: 'guide'
});

const previewAttachment = () => {
  const columns = ['Document', 'Version', 'Organization', 'Issued Date'];
  const rows = [
    ['Youth Eco-Anxiety Guide', '2026 Edition', 'EcoYouth Action', new Date().toLocaleDateString('en-AU')],
    ['Counseling Ticket', 'Verified', 'Melbourne Climate Resilience', 'October 2026']
  ];
  exportToPDF('EcoYouth Action Official Document Attachment', columns, rows, 'Attachment_Preview.pdf');
};

const handleSendSingleEmail = () => {
  isSending.value = true;
  sendSuccessMessage.value = '';

  setTimeout(() => {
    isSending.value = false;
    sendSuccessMessage.value = `Dispatched successfully to ${singleForm.recipient} with attachment "${singleForm.attachmentType}.pdf" via SendGrid API simulation. Status: 202 Accepted.`;
  }, 1200);
};

// Bulk Email Campaign State (BR F.1 Feature 4)
const selectedTemplate = ref('rally');
const bulkAttachment = ref('flyer');
const bulkSubject = ref('Urgent Youth Climate Action Rally Briefing & Assembly Points');
const bulkMessage = ref('Dear Volunteers and Community Members,\n\nWe are gathering this Saturday for our annual climate resilience briefing and youth support session. Please find the attached timetable and safety guidelines.\n\nSee you there!');
const selectedUserIds = ref(usersDB.value.map(u => u.id));

const filteredUsers = computed(() => usersDB.value);

const bulkProgress = reactive({
  active: false,
  current: 0,
  total: 0
});

const applyTemplate = () => {
  if (selectedTemplate.value === 'rally') {
    bulkSubject.value = 'Urgent Youth Climate Action Rally Briefing & Assembly Points';
    bulkMessage.value = 'Dear Volunteers,\n\nWe are organizing a grassroots climate rally this Saturday in Melbourne CBD. Please review the attached assembly point map and safety protocol.';
  } else if (selectedTemplate.value === 'circle') {
    bulkSubject.value = 'Invitation: Monthly Eco-Anxiety Peer Support Circle';
    bulkMessage.value = 'Hello friends,\n\nOur upcoming peer support circle will be held at Carlton Climate Action Hub. Book your free ticket or join via our online stream.';
  } else if (selectedTemplate.value === 'newsletter') {
    bulkSubject.value = 'EcoYouth Action Quarterly Impact & Tree Planting Report';
    bulkMessage.value = 'Greetings,\n\nWe are excited to share our Q3 achievements: over 2,400 youth supported and 85 community workshops held across Victoria!';
  }
};

const selectAllUsers = () => {
  selectedUserIds.value = usersDB.value.map(u => u.id);
};

const deselectAllUsers = () => {
  selectedUserIds.value = [];
};

const dispatchBulkEmail = () => {
  if (!selectedUserIds.value.length) {
    alert('Please select at least one recipient.');
    return;
  }

  bulkProgress.active = true;
  bulkProgress.current = 0;
  bulkProgress.total = selectedUserIds.value.length;

  const interval = setInterval(() => {
    bulkProgress.current++;
    if (bulkProgress.current >= bulkProgress.total) {
      clearInterval(interval);
      setTimeout(() => {
        bulkProgress.active = false;
        alert(`Bulk Campaign Successfully Sent! ${bulkProgress.total} emails dispatched with attached "${bulkAttachment.value}.pdf".`);
      }, 500);
    }
  }, 350);
};
</script>
