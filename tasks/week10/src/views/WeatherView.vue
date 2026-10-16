<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

const weatherData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const temperature = computed(() => {
  if (!weatherData.value) return null

  return Math.round(weatherData.value.main.temp)
})

const iconUrl = computed(() => {
  const iconCode = weatherData.value?.weather?.[0]?.icon

  return iconCode ? `https://openweathermap.org/img/wn/${iconCode}@2x.png` : ''
})

const weatherDescription = computed(() => weatherData.value?.weather?.[0]?.description ?? '')

const fetchWeatherData = async (latitude, longitude) => {
  if (!apiKey) {
    errorMessage.value =
      'OpenWeather API key is missing. Add VITE_OPENWEATHER_API_KEY to your .env.local file.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: latitude,
        lon: longitude,
        appid: apiKey,
        units: 'metric'
      }
    })

    weatherData.value = response.data
  } catch (error) {
    weatherData.value = null

    if (error.response?.status === 401) {
      errorMessage.value = 'The OpenWeather API key is invalid or has not been activated yet.'
    } else {
      errorMessage.value = 'Unable to retrieve weather data. Please try again.'
    }

    console.error('Error fetching weather data:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchCurrentLocationWeather = () => {
  if (!navigator.geolocation) {
    errorMessage.value = 'Geolocation is not supported by this browser.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      fetchWeatherData(coords.latitude, coords.longitude)
    },
    (error) => {
      isLoading.value = false
      errorMessage.value =
        error.code === error.PERMISSION_DENIED
          ? 'Location access was denied. Allow location access and try again.'
          : 'Unable to determine your current location.'
    }
  )
}

onMounted(fetchCurrentLocationWeather)
</script>

<template>
  <section class="page-section weather-page">
    <div class="container">
      <div class="weather-card mx-auto p-4 p-md-5">
        <p class="eyebrow mb-2">Week 10 API activity</p>
        <h1 class="display-6 fw-bold mb-3">Weather App</h1>
        <p class="text-secondary mb-4">Current weather for your location.</p>

        <button
          class="btn btn-outline-primary"
          type="button"
          :disabled="isLoading"
          @click="fetchCurrentLocationWeather"
        >
          Refresh current location
        </button>

        <p v-if="isLoading" class="status-message mt-4 mb-0" role="status">
          Loading weather data...
        </p>

        <div v-else-if="errorMessage" class="alert alert-warning mt-4 mb-0" role="alert">
          {{ errorMessage }}
        </div>

        <main v-else-if="weatherData" class="weather-result mt-4" aria-live="polite">
          <h2 class="h3 mb-3">{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
          <div class="d-flex align-items-center justify-content-center gap-3">
            <img
              v-if="iconUrl"
              class="weather-icon"
              :src="iconUrl"
              :alt="`${weatherDescription} weather icon`"
            />
            <p class="temperature mb-0">{{ temperature }} &deg;C</p>
          </div>
          <p class="weather-description mb-0 text-capitalize">{{ weatherDescription }}</p>
        </main>
      </div>
    </div>
  </section>
</template>

<style scoped>
.weather-page {
  min-height: 70vh;
  display: grid;
  place-items: center;
}

.weather-card {
  max-width: 760px;
  border: 1px solid #dce3ec;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 1rem 2.5rem rgba(19, 34, 56, 0.1);
}

.weather-result {
  padding: 1.5rem;
  border-radius: 0.75rem;
  background: #f3f7fc;
  text-align: center;
}

.weather-icon {
  width: 96px;
  height: 96px;
}

.temperature {
  color: #132238;
  font-size: clamp(2rem, 7vw, 3.5rem);
  font-weight: 700;
}

.weather-description,
.status-message {
  color: #52657a;
}
</style>
