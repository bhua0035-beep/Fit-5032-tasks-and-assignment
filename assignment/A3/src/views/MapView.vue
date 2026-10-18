<template>
  <div class="container-fluid px-3 px-lg-5 my-4">
    <!-- Header -->
    <div class="row mb-3">
      <div class="col-12">
        <h1 class="h2 fw-bold text-success mb-1">Melbourne Youth Climate & Eco-Anxiety Hubs Map</h1>
        <p class="text-muted mb-0">
          Find drop-in counseling centers, urban greening projects, and community resilience spaces. Compare route and trip estimates.
        </p>
      </div>
    </div>

    <!-- Map Search, Filter & Routing Control Panel (BR E.2) -->
    <div class="row g-3 mb-3">
      <!-- Feature 1: Place Search & Category Filtering -->
      <div class="col-lg-6">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-success text-white py-2">
            <strong class="small">Feature 1: Interactive Place Search & Category Filter</strong>
          </div>
          <div class="card-body">
            <div class="row g-2 mb-2">
              <div class="col-sm-8">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="searchKeyword" 
                  placeholder="Search hub name or location (e.g. Carlton, Brunswick)..."
                  @input="filterHubs"
                >
              </div>
              <div class="col-sm-4">
                <select class="form-select form-select-sm" v-model="selectedCategory" @change="filterHubs">
                  <option value="">All Categories</option>
                  <option value="Counseling">Counseling & Grief Circles</option>
                  <option value="Urban Greening">Urban Greening & Gardens</option>
                  <option value="Coastal Action">Coastal Resilience</option>
                  <option value="Campus Hub">Campus Hubs</option>
                </select>
              </div>
            </div>

            <!-- Quick Hub Badges -->
            <div class="d-flex flex-wrap gap-1">
              <button 
                v-for="hub in filteredHubs" 
                :key="hub.id" 
                type="button" 
                class="btn btn-sm btn-outline-success py-0 px-2"
                :class="{ active: selectedHub?.id === hub.id }"
                @click="selectHub(hub)"
              >
                📍 {{ hub.name.split(' ')[0] }} ({{ hub.category }})
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature 2: Route Navigation & Trip Information -->
      <div class="col-lg-6">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header bg-primary text-white py-2 d-flex justify-content-between align-items-center">
            <strong class="small">Feature 2: Route Estimates & Trip Information</strong>
            <button class="btn btn-sm btn-light py-0 px-2" @click="useCurrentLocation" title="Detect GPS coordinates">
              🎯 Use My GPS Location
            </button>
          </div>
          <div class="card-body">
            <div class="row g-2 align-items-center mb-2">
              <div class="col-sm-5">
                <label class="form-label small text-muted mb-0">Starting Point:</label>
                <select class="form-select form-select-sm" v-model="originPoint">
                  <option :value="originCustom" v-if="hasCustomOrigin">{{ customOriginLabel }}</option>
                  <option :value="origins.flinders">Flinders St Station (Melbourne CBD)</option>
                  <option :value="origins.melbCentral">Melbourne Central Station</option>
                  <option :value="origins.monash">Monash University Clayton Campus</option>
                </select>
              </div>
              <div class="col-sm-4">
                <label class="form-label small text-muted mb-0">Destination:</label>
                <select class="form-select form-select-sm" v-model="selectedHubId" @change="handleHubDropdownChange">
                  <option v-for="hub in hubsData" :key="hub.id" :value="hub.id">{{ hub.name }}</option>
                </select>
              </div>
              <div class="col-sm-3 pt-3">
                <button class="btn btn-sm btn-primary w-100 py-1" @click="calculateRoute">
                  🧭 Navigate
                </button>
              </div>
            </div>

            <!-- Live Trip Info Banner -->
            <div v-if="tripInfo" class="alert alert-info py-2 px-3 mb-0 small">
              <div class="d-flex justify-content-between">
                <span><strong>Trip Distance:</strong> {{ tripInfo.distanceKm }} km</span>
                <span><strong>🚶 Walk:</strong> ~{{ tripInfo.walkMinutes }} mins</span>
                <span><strong>🚲 Bike:</strong> ~{{ tripInfo.bikeMinutes }} mins</span>
                <span><strong>🚋 Transit:</strong> ~{{ tripInfo.transitMinutes }} mins</span>
              </div>
            </div>
            <div v-else class="text-muted small">
              Click <strong>Navigate</strong> above to compute distance, trip duration, and draw route polyline on the map.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Map & Route Details Split View -->
    <div class="row g-3">
      <div class="col-lg-8">
        <div id="leaflet-map" class="map-container shadow-sm border"></div>
      </div>

      <div class="col-lg-4">
        <!-- Selected Hub Card -->
        <div class="card shadow-sm border-0 mb-3" v-if="selectedHub">
          <div class="card-header bg-light d-flex justify-content-between align-items-center">
            <h5 class="card-title h6 mb-0 text-success fw-bold">{{ selectedHub.name }}</h5>
            <span class="badge bg-success">{{ selectedHub.category }}</span>
          </div>
          <div class="card-body">
            <p class="small text-muted mb-2"><strong>Address:</strong> {{ selectedHub.address }}</p>
            <p class="small mb-2"><strong>Hours:</strong> {{ selectedHub.hours }}</p>
            <p class="small mb-2"><strong>Services:</strong> {{ selectedHub.services }}</p>
            <p class="small mb-3"><strong>Current Activity:</strong> {{ selectedHub.activity }}</p>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-success flex-grow-1" @click="calculateRouteTo(selectedHub)">
                🧭 Get Directions
              </button>
              <router-link to="/calendar" class="btn btn-sm btn-outline-success">
                Book Session
              </router-link>
            </div>
          </div>
        </div>

        <!-- Illustrative Route Guidance Card -->
        <div class="card shadow-sm border-0" v-if="tripInfo && routeDirections.length">
          <div class="card-header bg-secondary text-white py-2">
            <strong class="small">Illustrative Route Guidance</strong>
          </div>
          <ul class="list-group list-group-flush small" style="max-height: 250px; overflow-y: auto;">
            <li v-for="(step, idx) in routeDirections" :key="idx" class="list-group-item">
              <span class="badge bg-secondary me-2">{{ idx + 1 }}</span>
              {{ step }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet Default Icon Path issues in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Melbourne Climate & Eco-Anxiety Hubs Data
const hubsData = [
  {
    id: 1,
    name: 'Carlton Climate Action & Grief Support Hub',
    lat: -37.8001,
    lng: 144.9671,
    category: 'Counseling',
    address: '154 Drummond St, Carlton VIC 3053',
    hours: 'Mon-Fri: 9:00am - 6:00pm',
    services: '1-on-1 Eco-Psychology, Climate Circles, Breathwork',
    activity: 'Youth Grief Drop-in Circle every Tuesday 2pm'
  },
  {
    id: 2,
    name: 'Brunswick Community Greening & Compost Hub',
    lat: -37.7685,
    lng: 144.9622,
    category: 'Urban Greening',
    address: '28 Albert St, Brunswick VIC 3056',
    hours: 'Wed-Sun: 10:00am - 4:00pm',
    services: 'Permaculture Gardening, Merri Creek Rewilding',
    activity: 'Seedling Exchange & Soil Therapy Workshop'
  },
  {
    id: 3,
    name: 'St Kilda Coastal Resilience & Dune Center',
    lat: -37.8640,
    lng: 144.9720,
    category: 'Coastal Action',
    address: 'St Kilda Pier Foreshore, St Kilda VIC 3182',
    hours: 'Daily: 8:00am - 7:00pm',
    services: 'Marine Biodiversity, Coastal Cleanups, Beach Mindfulness',
    activity: 'Sunset Dune Restoration & Meditation'
  },
  {
    id: 4,
    name: 'Footscray Community Arts Climate Space',
    lat: -37.8015,
    lng: 144.9080,
    category: 'Counseling',
    address: '45 Moreland St, Footscray VIC 3011',
    hours: 'Tue-Sat: 10:00am - 5:00pm',
    services: 'Eco-Anxiety Art Therapy, Youth Activism Mentoring',
    activity: 'Expressive Clay & Climate Journaling Session'
  },
  {
    id: 5,
    name: 'Monash Clayton Sustainability Pavilion',
    lat: -37.9105,
    lng: 145.1328,
    category: 'Campus Hub',
    address: 'Wellington Rd, Clayton VIC 3800',
    hours: 'Mon-Fri: 8:30am - 6:30pm',
    services: 'Student Climate Circles, Campus Greening, Peer Support',
    activity: 'Monash Eco-Anxiety Peer Support Circle'
  },
  {
    id: 6,
    name: 'Fitzroy Youth Wellbeing & Circular Economy Hub',
    lat: -37.8010,
    lng: 144.9790,
    category: 'Urban Greening',
    address: '110 Napier St, Fitzroy VIC 3065',
    hours: 'Mon-Sat: 10:00am - 6:00pm',
    services: 'Zero-Waste Kitchen, Clothes Swap, Active Travel Support',
    activity: 'Zero-Waste Cooking & Community Lunch'
  }
];

// Preset Origins
const origins = {
  flinders: { lat: -37.8180, lng: 144.9671, name: 'Flinders St Station' },
  melbCentral: { lat: -37.8102, lng: 144.9628, name: 'Melbourne Central' },
  monash: { lat: -37.9105, lng: 145.1328, name: 'Monash Clayton Campus' }
};

let map = null;
let markersLayer = null;
let routePolyline = null;
let originMarker = null;

const searchKeyword = ref('');
const selectedCategory = ref('');
const filteredHubs = ref([...hubsData]);
const selectedHub = ref(hubsData[0]);
const selectedHubId = ref(1);

const originPoint = ref(origins.flinders);
const originCustom = reactive({ lat: 0, lng: 0, name: 'My Current Location' });
const hasCustomOrigin = ref(false);
const customOriginLabel = ref('GPS Location');

const tripInfo = ref(null);
const routeDirections = ref([]);

onMounted(() => {
  initMap();
});

const initMap = () => {
  // Center on Melbourne
  map = L.map('leaflet-map').setView([-37.8136, 144.9631], 12);

  // High-Quality OpenStreetMap Tile Layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | EcoYouth Action'
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  renderMarkers();
};

const renderMarkers = () => {
  if (!markersLayer) return;
  markersLayer.clearLayers();

  filteredHubs.value.forEach(hub => {
    const marker = L.marker([hub.lat, hub.lng]);
    const popupContent = `
      <div style="font-family: sans-serif; min-width: 200px;">
        <h6 style="color: #2e7d32; margin-bottom: 4px; font-weight: bold;">${hub.name}</h6>
        <span style="background: #e8f5e9; color: #2e7d32; font-size: 11px; padding: 2px 6px; border-radius: 4px;">${hub.category}</span>
        <p style="font-size: 12px; margin: 6px 0 4px 0; color: #555;">${hub.address}</p>
        <p style="font-size: 11px; color: #333; margin-bottom: 8px;"><strong>Hours:</strong> ${hub.hours}</p>
        <p style="font-size: 11px; color: #2e7d32;"><strong>Current:</strong> ${hub.activity}</p>
      </div>
    `;
    marker.bindPopup(popupContent);
    marker.on('click', () => {
      selectedHub.value = hub;
      selectedHubId.value = hub.id;
    });
    markersLayer.addLayer(marker);
  });
};

const filterHubs = () => {
  filteredHubs.value = hubsData.filter(hub => {
    const matchKeyword = !searchKeyword.value || 
      hub.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      hub.address.toLowerCase().includes(searchKeyword.value.toLowerCase());
    const matchCat = !selectedCategory.value || hub.category === selectedCategory.value;
    return matchKeyword && matchCat;
  });
  renderMarkers();
};

const selectHub = (hub) => {
  selectedHub.value = hub;
  selectedHubId.value = hub.id;
  map.setView([hub.lat, hub.lng], 14, { animate: true });
};

const handleHubDropdownChange = () => {
  const hub = hubsData.find(h => h.id === selectedHubId.value);
  if (hub) selectHub(hub);
};

const useCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        originCustom.lat = pos.coords.latitude;
        originCustom.lng = pos.coords.longitude;
        customOriginLabel.value = `GPS (${originCustom.lat.toFixed(4)}, ${originCustom.lng.toFixed(4)})`;
        hasCustomOrigin.value = true;
        originPoint.value = originCustom;
        alert(`Success! GPS detected your location in Melbourne. Click 'Navigate' to route to ${selectedHub.value?.name}.`);
      },
      () => {
        // Fallback default coordinate in Melbourne
        originCustom.lat = -37.8136;
        originCustom.lng = 144.9631;
        customOriginLabel.value = 'Melbourne CBD (Default GPS)';
        hasCustomOrigin.value = true;
        originPoint.value = originCustom;
        alert('Using Melbourne CBD coordinates for GPS origin.');
      }
    );
  }
};

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
};

const calculateRouteTo = (hub) => {
  selectedHub.value = hub;
  selectedHubId.value = hub.id;
  calculateRoute();
};

const calculateRoute = () => {
  const dest = selectedHub.value;
  const orig = originPoint.value;
  if (!dest || !orig) return;

  const distance = parseFloat(calculateDistanceKm(orig.lat, orig.lng, dest.lat, dest.lng));
  const walkMins = Math.round(distance / 4.8 * 60);
  const bikeMins = Math.round(distance / 16 * 60);
  const transitMins = Math.round(distance / 25 * 60) + 8;

  tripInfo.value = {
    distanceKm: distance,
    walkMinutes: walkMins,
    bikeMinutes: bikeMins,
    transitMinutes: transitMins
  };

  // Illustrative route guidance
  routeDirections.value = [
    `Depart from ${orig.name || 'Your Location'}.`,
    `Proceed towards ${dest.address.split(',')[0]} via Melbourne central bicycle / transit corridor.`,
    `Cover approximately ${distance} km of active travel or low-carbon public transport.`,
    `Arrive at ${dest.name} (${dest.address}). Check in for climate wellbeing activities.`
  ];

  // Draw Route Polyline on Map
  if (routePolyline) map.removeLayer(routePolyline);
  if (originMarker) map.removeLayer(originMarker);

  originMarker = L.circleMarker([orig.lat, orig.lng], {
    color: '#007bff',
    fillColor: '#007bff',
    fillOpacity: 0.9,
    radius: 8
  }).addTo(map).bindPopup(`<strong>Origin:</strong> ${orig.name || 'Your Location'}`).openPopup();

  // Create intermediate route coordinates for smooth visual display
  const midLat = (orig.lat + dest.lat) / 2 + 0.003;
  const midLng = (orig.lng + dest.lng) / 2 - 0.002;
  const latlngs = [
    [orig.lat, orig.lng],
    [midLat, midLng],
    [dest.lat, dest.lng]
  ];

  routePolyline = L.polyline(latlngs, {
    color: '#28a745',
    weight: 5,
    dashArray: '8, 8',
    lineJoin: 'round'
  }).addTo(map);

  map.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });
};
</script>
