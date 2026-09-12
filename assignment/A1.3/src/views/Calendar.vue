<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12 text-center mb-3">
        <h2>🌿 Youth Climate Action Events</h2>
        <p class="lead text-muted">Stay updated on eco-anxiety wellbeing events in your community.</p>
      </div>
    </div>

    <!-- Month Navigation -->
    <div class="row mb-3">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body py-3">
            <div class="d-flex justify-content-between align-items-center">
              <button class="btn btn-outline-success" @click="prevMonth">&#8592; Prev</button>
              <h4 class="mb-0 text-success fw-bold">{{ monthName }} {{ year }}</h4>
              <button class="btn btn-outline-success" @click="nextMonth">Next &#8594;</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <!-- Day headers -->
            <div class="row g-0 text-center">
              <div
                v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
                :key="day"
                class="col calendar-header py-2 fw-bold text-white bg-success"
              >
                {{ day }}
              </div>
            </div>

            <!-- Calendar cells -->
            <div
              v-for="(week, wi) in calendarWeeks"
              :key="wi"
              class="row g-0"
            >
              <div
                v-for="(cell, di) in week"
                :key="di"
                class="col calendar-cell border p-2"
                :class="{
                  'bg-light text-muted': !cell.currentMonth,
                  'today-cell': cell.isToday,
                  'has-event': getEvents(cell.date).length > 0
                }"
              >
                <div class="date-number fw-bold mb-1" :class="cell.isToday ? 'text-success' : ''">
                  {{ cell.day || '' }}
                </div>
                <div
                  v-for="event in getEvents(cell.date)"
                  :key="event.id"
                  class="event-badge badge rounded-pill text-wrap text-start w-100 mb-1"
                  :class="event.badgeClass"
                  role="button"
                  @click="selectEvent(event)"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Detail Modal (click on event) -->
    <div v-if="selectedEvent" class="row mt-4">
      <div class="col-md-8 offset-md-2">
        <div class="card border-success shadow">
          <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <strong>{{ selectedEvent.title }}</strong>
            <button class="btn btn-sm btn-outline-light" @click="selectedEvent = null">✕ Close</button>
          </div>
          <div class="card-body">
            <p><strong>📅 Date:</strong> {{ selectedEvent.date }}</p>
            <p><strong>📍 Location:</strong> {{ selectedEvent.location }}</p>
            <p><strong>🕐 Time:</strong> {{ selectedEvent.time }}</p>
            <p><strong>📝 Description:</strong> {{ selectedEvent.description }}</p>
            <span :class="selectedEvent.badgeClass" class="badge rounded-pill">{{ selectedEvent.type }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events List -->
    <div class="row mt-4">
      <div class="col-12">
        <h5 class="text-success fw-bold mb-3">📋 Upcoming Events This Month</h5>
        <div class="row g-3">
          <div v-for="event in upcomingEvents" :key="event.id" class="col-md-4">
            <div class="card h-100 border-0 shadow-sm" style="border-left: 4px solid #198754 !important;">
              <div class="card-body">
                <span :class="event.badgeClass" class="badge rounded-pill mb-2">{{ event.type }}</span>
                <h6 class="card-title fw-bold">{{ event.title }}</h6>
                <p class="card-text small text-muted mb-1">📅 {{ event.date }}</p>
                <p class="card-text small text-muted mb-1">📍 {{ event.location }}</p>
                <p class="card-text small">{{ event.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const today = new Date()
const currentMonth = ref(today.getMonth())
const year = ref(today.getFullYear())
const selectedEvent = ref(null)

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const monthName = computed(() => monthNames[currentMonth.value])

// Sample events - eco-anxiety youth theme
const events = ref([
  {
    id: 1,
    title: 'Mindful Nature Walk',
    date: `${year.value}-${String(currentMonth.value + 1).padStart(2,'0')}-05`,
    location: 'Botanical Gardens, Melbourne',
    time: '9:00 AM – 11:00 AM',
    description: 'A guided mindful walk in nature to reconnect with the environment and reduce eco-anxiety.',
    type: 'Wellbeing',
    badgeClass: 'bg-success'
  },
  {
    id: 2,
    title: 'Youth Climate Panel',
    date: `${year.value}-${String(currentMonth.value + 1).padStart(2,'0')}-10`,
    location: 'Monash University, Clayton',
    time: '2:00 PM – 4:30 PM',
    description: 'Youth-led panel discussion on local climate action and mental health impacts.',
    type: 'Workshop',
    badgeClass: 'bg-primary'
  },
  {
    id: 3,
    title: 'Community Tree Planting',
    date: `${year.value}-${String(currentMonth.value + 1).padStart(2,'0')}-14`,
    location: 'Riverside Park, Richmond',
    time: '8:00 AM – 12:00 PM',
    description: 'Join fellow youth volunteers to plant native trees and restore local ecosystems.',
    type: 'Action',
    badgeClass: 'bg-warning text-dark'
  },
  {
    id: 4,
    title: 'Eco-Anxiety Support Circle',
    date: `${year.value}-${String(currentMonth.value + 1).padStart(2,'0')}-18`,
    location: 'Online (Zoom)',
    time: '6:00 PM – 7:30 PM',
    description: 'A safe facilitated peer support group for young people experiencing eco-anxiety.',
    type: 'Wellbeing',
    badgeClass: 'bg-success'
  },
  {
    id: 5,
    title: 'Solar Workshop for Youth',
    date: `${year.value}-${String(currentMonth.value + 1).padStart(2,'0')}-22`,
    location: 'Brunswick Community Hub',
    time: '10:00 AM – 1:00 PM',
    description: 'Hands-on workshop exploring solar energy solutions for everyday youth activists.',
    type: 'Workshop',
    badgeClass: 'bg-primary'
  },
  {
    id: 6,
    title: 'Beach Cleanup Drive',
    date: `${year.value}-${String(currentMonth.value + 1).padStart(2,'0')}-27`,
    location: 'St Kilda Beach, Melbourne',
    time: '7:30 AM – 10:00 AM',
    description: 'Help clean up coastal pollution while connecting with a passionate youth community.',
    type: 'Action',
    badgeClass: 'bg-warning text-dark'
  }
])

function getEvents(dateStr) {
  if (!dateStr) return []
  return events.value.filter(e => e.date === dateStr)
}

function selectEvent(event) {
  selectedEvent.value = event
}

// Build calendar weeks
const calendarWeeks = computed(() => {
  const firstDay = new Date(year.value, currentMonth.value, 1).getDay()
  const daysInMonth = new Date(year.value, currentMonth.value + 1, 0).getDate()
  const daysInPrev = new Date(year.value, currentMonth.value, 0).getDate()

  const cells = []

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i
    const m = currentMonth.value === 0 ? 12 : currentMonth.value
    const y = currentMonth.value === 0 ? year.value - 1 : year.value
    cells.push({ day: d, currentMonth: false, date: null, isToday: false })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year.value}-${String(currentMonth.value + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const isToday =
      d === today.getDate() &&
      currentMonth.value === today.getMonth() &&
      year.value === today.getFullYear()
    cells.push({ day: d, currentMonth: true, date: dateStr, isToday })
  }

  // Next month leading days
  const remainder = 7 - (cells.length % 7)
  if (remainder < 7) {
    for (let d = 1; d <= remainder; d++) {
      cells.push({ day: d, currentMonth: false, date: null, isToday: false })
    }
  }

  // Chunk into weeks
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
})

const upcomingEvents = computed(() =>
  events.value.filter(e => e.date >= `${year.value}-${String(currentMonth.value + 1).padStart(2,'0')}-01`)
    .slice(0, 3)
)

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    year.value--
  } else {
    currentMonth.value--
  }
  selectedEvent.value = null
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    year.value++
  } else {
    currentMonth.value++
  }
  selectedEvent.value = null
}
</script>

<style scoped>
.calendar-header {
  font-size: 0.85rem;
}

.calendar-cell {
  min-height: 90px;
  font-size: 0.8rem;
  vertical-align: top;
}

.date-number {
  font-size: 0.9rem;
}

.today-cell {
  background-color: #d1f5e0 !important;
  border: 2px solid #198754 !important;
}

.has-event {
  background-color: #f8fff9;
}

.event-badge {
  font-size: 0.65rem;
  cursor: pointer;
  white-space: normal;
  line-height: 1.3;
  padding: 3px 6px;
}

.event-badge:hover {
  opacity: 0.85;
}
</style>
