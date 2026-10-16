<template>
  <div class="container my-5">
    <!-- Header -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
      <div>
        <h1 class="h2 fw-bold text-success mb-1">Peer Counseling & Mentorship Calendar</h1>
        <p class="text-muted mb-0">
          Book 1-on-1 eco-anxiety support sessions with automated booking constraint and conflict management.
        </p>
      </div>
      <div>
        <button class="btn btn-success btn-lg shadow-sm" data-bs-toggle="modal" data-bs-target="#bookingModal">
          🗓️ Book Support Session
        </button>
      </div>
    </div>

    <!-- Conflict Engine Banner (BR F.1 Innovative Feature 1) -->
    <div class="alert alert-light border-start border-4 border-success shadow-sm mb-4">
      <div class="d-flex align-items-center">
        <span class="fs-4 me-3">🛡️</span>
        <div>
          <strong class="text-success">Automated Booking Conflict Engine (Constraint Management):</strong>
          <p class="small text-muted mb-0">
            Our booking system strictly enforces scheduling constraints. If a selected mentor/counselor is already booked for a specific date and time slot, the system prevents double-booking and dynamically suggests non-conflicting alternative slots.
          </p>
        </div>
      </div>
    </div>

    <!-- Calendar Month Navigation & Grid -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-success text-white py-3 d-flex justify-content-between align-items-center">
        <button class="btn btn-sm btn-outline-light" @click="changeMonth(-1)">&larr; Previous Month</button>
        <h4 class="mb-0 fw-bold">{{ currentMonthName }} {{ currentYear }}</h4>
        <button class="btn btn-sm btn-outline-light" @click="changeMonth(1)">Next Month &rarr;</button>
      </div>
      <div class="card-body p-0">
        <!-- Day Names -->
        <div class="row g-0 text-center fw-bold text-secondary border-bottom py-2 bg-light">
          <div class="col" v-for="d in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="d">
            {{ d }}
          </div>
        </div>

        <!-- Calendar Weeks & Days -->
        <div v-for="(week, wIdx) in calendarGrid" :key="wIdx" class="row g-0">
          <div 
            v-for="(day, dIdx) in week" 
            :key="dIdx" 
            class="col border p-2 calendar-day-box"
            :class="{
              'bg-light opacity-50': !day.inMonth,
              'bg-success-subtle': day.isToday
            }"
            style="min-height: 110px;"
          >
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fw-bold small" :class="{ 'text-success': day.isToday }">{{ day.dateNumber }}</span>
              <span v-if="day.appointments.length" class="badge bg-success rounded-pill" style="font-size: 10px;">
                {{ day.appointments.length }} session{{ day.appointments.length > 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Mini Session Badges in Calendar Cell -->
            <div class="d-flex flex-column gap-1">
              <div 
                v-for="apt in day.appointments" 
                :key="apt.id" 
                class="badge text-start text-truncate py-1 px-2 border"
                :class="apt.counselor.includes('Sarah') ? 'bg-info-subtle text-info-emphasis border-info' : 'bg-warning-subtle text-warning-emphasis border-warning'"
                :title="apt.counselor + ' (' + apt.timeSlot + '): ' + apt.topic"
              >
                <strong>{{ apt.timeSlot.split(' ')[0] }}</strong>: {{ apt.counselor.split(' ')[1] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmed Appointments Table -->
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold text-success">Confirmed Support Appointments</h5>
        <span class="badge bg-secondary">{{ appointmentsList.length }} Scheduled</span>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Counselor / Mentor</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Client Name</th>
              <th>Topic / Concern</th>
              <th>Status</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="apt in appointmentsList" :key="apt.id">
              <td><strong>{{ apt.counselor }}</strong></td>
              <td>{{ apt.date }}</td>
              <td><span class="badge bg-light text-dark border">{{ apt.timeSlot }}</span></td>
              <td>{{ apt.clientName }} <br><small class="text-muted">{{ apt.clientEmail }}</small></td>
              <td>{{ apt.topic }}</td>
              <td><span class="badge bg-success">Confirmed</span></td>
              <td class="text-end">
                <router-link to="/email-center" class="btn btn-sm btn-outline-primary me-1" title="Send email confirmation with PDF">
                  ✉️ Email Ticket
                </router-link>
                <button class="btn btn-sm btn-outline-danger" @click="cancelAppointment(apt.id)">
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Booking Modal with Conflict Constraint Checker (BR F.1) -->
    <div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="handleBookingSubmit">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title" id="bookingModalLabel">Book a 1-on-1 Eco-Anxiety Counseling Session</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Live Conflict Alert Box (Triggered when constraint check fails) -->
              <div v-if="conflictAlert" class="alert alert-danger conflict-alert mb-4">
                <h6 class="fw-bold mb-1">⚠️ Scheduling Constraint Violation (Booking Conflict)!</h6>
                <p class="small mb-2">{{ conflictAlert }}</p>
                <div class="bg-white p-2 rounded border border-danger">
                  <small class="fw-bold text-dark d-block mb-1">Suggested Available Non-Conflicting Slots for this Date:</small>
                  <div class="d-flex flex-wrap gap-2">
                    <button 
                      v-for="avail in suggestedAvailableSlots" 
                      :key="avail"
                      type="button" 
                      class="btn btn-sm btn-outline-success py-0 px-2"
                      @click="selectSuggestedSlot(avail)"
                    >
                      Use {{ avail }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label for="bookingCounselor" class="form-label fw-bold">Select Counselor / Mentor *</label>
                  <select 
                    id="bookingCounselor" 
                    class="form-select" 
                    v-model="bookingForm.counselor" 
                    required 
                    @change="validateLiveConflict"
                  >
                    <option value="Dr. Sarah Lin (Eco-Psychologist)">Dr. Sarah Lin (Eco-Psychologist)</option>
                    <option value="Mark Henderson (Youth Peer Mentor)">Mark Henderson (Youth Peer Mentor)</option>
                    <option value="Elena Rostova (Mindfulness Coach)">Elena Rostova (Mindfulness Coach)</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="bookingDate" class="form-label fw-bold">Session Date *</label>
                  <input 
                    type="date" 
                    id="bookingDate" 
                    class="form-control" 
                    v-model="bookingForm.date" 
                    required 
                    @change="validateLiveConflict"
                  >
                </div>
                <div class="col-md-6">
                  <label for="bookingSlot" class="form-label fw-bold">Time Slot *</label>
                  <select 
                    id="bookingSlot" 
                    class="form-select" 
                    v-model="bookingForm.timeSlot" 
                    required 
                    @change="validateLiveConflict"
                  >
                    <option value="09:00 - 10:00">09:00 - 10:00 (Morning Slot 1)</option>
                    <option value="10:30 - 11:30">10:30 - 11:30 (Morning Slot 2)</option>
                    <option value="14:00 - 15:00">14:00 - 15:00 (Afternoon Slot 1)</option>
                    <option value="15:30 - 16:30">15:30 - 16:30 (Afternoon Slot 2)</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="clientName" class="form-label fw-bold">Your Name *</label>
                  <input type="text" id="clientName" class="form-control" v-model.trim="bookingForm.clientName" required>
                </div>
                <div class="col-md-6">
                  <label for="clientEmail" class="form-label fw-bold">Your Email Address *</label>
                  <input type="email" id="clientEmail" class="form-control" v-model.trim="bookingForm.clientEmail" required>
                </div>
                <div class="col-md-6">
                  <label for="bookingTopic" class="form-label fw-bold">Primary Topic / Concern *</label>
                  <input type="text" id="bookingTopic" class="form-control" v-model.trim="bookingForm.topic" placeholder="e.g. Climate grief, feeling stuck..." required>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-success">
                Confirm & Check Constraints
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { 
  appointmentsList, 
  currentUser, 
  checkBookingConflict, 
  bookAppointment 
} from '../store.js';

// Calendar Navigation State
const currentDate = ref(new Date(2026, 9, 1)); // October 2026
const allTimeSlots = ['09:00 - 10:00', '10:30 - 11:30', '14:00 - 15:00', '15:30 - 16:30'];

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' });
});

const changeMonth = (delta) => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + delta, 1);
};

// Calendar Grid Generation
const calendarGrid = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const grid = [];
  let currentWeek = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    currentWeek.push({
      dateNumber: prevMonthDays - i,
      inMonth: false,
      dateString: '',
      appointments: []
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayAppointments = appointmentsList.value.filter(apt => apt.date === formattedDate);

    currentWeek.push({
      dateNumber: d,
      inMonth: true,
      dateString: formattedDate,
      isToday: d === 15 && month === 9,
      appointments: dayAppointments
    });

    if (currentWeek.length === 7) {
      grid.push(currentWeek);
      currentWeek = [];
    }
  }

  // Next month leading days
  if (currentWeek.length > 0) {
    let nextD = 1;
    while (currentWeek.length < 7) {
      currentWeek.push({
        dateNumber: nextD++,
        inMonth: false,
        dateString: '',
        appointments: []
      });
    }
    grid.push(currentWeek);
  }

  return grid;
});

// Booking Form State
const bookingForm = reactive({
  counselor: 'Dr. Sarah Lin (Eco-Psychologist)',
  date: '2026-10-20',
  timeSlot: '09:00 - 10:00', // Note: This slot is intentionally pre-seeded as conflict to test engine!
  clientName: currentUser.value?.username || 'Baiyang Huang',
  clientEmail: currentUser.value?.email || 'bhua0035@student.monash.edu',
  topic: 'Climate grief and active hope integration'
});

const conflictAlert = ref('');
const suggestedAvailableSlots = ref([]);

// Real-time conflict validation when inputs change
const validateLiveConflict = () => {
  if (checkBookingConflict(bookingForm.counselor, bookingForm.date, bookingForm.timeSlot)) {
    conflictAlert.value = `${bookingForm.counselor} is already booked on ${bookingForm.date} for ${bookingForm.timeSlot}.`;
    // Compute available slots
    suggestedAvailableSlots.value = allTimeSlots.filter(
      slot => !checkBookingConflict(bookingForm.counselor, bookingForm.date, slot)
    );
  } else {
    conflictAlert.value = '';
    suggestedAvailableSlots.value = [];
  }
};

const selectSuggestedSlot = (slot) => {
  bookingForm.timeSlot = slot;
  validateLiveConflict();
};

const handleBookingSubmit = () => {
  const result = bookAppointment({ ...bookingForm });
  if (!result.success) {
    conflictAlert.value = result.message;
    suggestedAvailableSlots.value = allTimeSlots.filter(
      slot => !checkBookingConflict(bookingForm.counselor, bookingForm.date, slot)
    );
  } else {
    conflictAlert.value = '';
    alert(`Booking Confirmed! Your session with ${bookingForm.counselor} on ${bookingForm.date} at ${bookingForm.timeSlot} has been secured.`);
    // Close modal via bootstrap
    const modalEl = document.getElementById('bookingModal');
    if (modalEl && window.bootstrap) {
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  }
};

const cancelAppointment = (id) => {
  if (confirm('Cancel this appointment?')) {
    appointmentsList.value = appointmentsList.value.filter(a => a.id !== id);
  }
};
</script>

<style scoped>
.calendar-day-box {
  transition: background-color 0.2s ease;
}
.calendar-day-box:hover {
  background-color: #f1f8e9;
}
</style>
