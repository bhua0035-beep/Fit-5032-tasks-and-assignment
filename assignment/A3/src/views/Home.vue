<template>
  <div class="home-view">
    <!-- Hero Banner Section -->
    <section class="hero-section py-5 bg-light border-bottom" aria-labelledby="hero-title">
      <div class="container py-4">
        <div class="row align-items-center g-5">
          <div class="col-lg-7">
            <span class="badge bg-success text-uppercase px-3 py-2 mb-3">Melbourne Youth Climate Resilience</span>
            <h1 id="hero-title" class="display-4 fw-bold text-success mb-3">
              Empowering Youth for Climate Action & Mental Wellbeing
            </h1>
            <p class="lead text-muted mb-4">
              Navigating eco-anxiety through connection, counseling, and grassroots climate solutions. Join thousands of young Australians transforming climate distress into purposeful collective action.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <router-link to="/calendar" class="btn btn-success btn-lg px-4 shadow-sm">
                🗓️ Book Counseling
              </router-link>
              <router-link to="/resources" class="btn btn-outline-success btn-lg px-4">
                📚 Coping Library
              </router-link>
            </div>
          </div>
          <div class="col-lg-5 text-center">
            <div class="card shadow-lg border-0 bg-success text-white p-4 rounded-4">
              <div class="card-body">
                <div class="display-1 mb-2" aria-hidden="true">🌱</div>
                <h3 class="fw-bold">Active Hope in Action</h3>
                <p class="small opacity-75">
                  "Eco-anxiety is not a pathology; it is an empathetic response to our changing world. Hope comes alive when we gather together."
                </p>
                <div class="d-flex justify-content-around mt-4 pt-3 border-top border-light border-opacity-25">
                  <div>
                    <h4 class="fw-bold mb-0">2,400+</h4>
                    <small>Youth Supported</small>
                  </div>
                  <div>
                    <h4 class="fw-bold mb-0">85+</h4>
                    <small>Melbourne Events</small>
                  </div>
                  <div>
                    <h4 class="fw-bold mb-0">4.8★</h4>
                    <small>Program Rating</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact & Quick Navigation Pillars -->
    <section class="py-5" aria-labelledby="pillars-heading">
      <div class="container">
        <div class="text-center mb-5">
          <h2 id="pillars-heading" class="fw-bold text-dark">Our Integrated Support Framework</h2>
          <p class="text-muted">Explore the four key pillars of our community climate services</p>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-3">
            <div class="card h-100 shadow-sm border-0 border-top border-4 border-success">
              <div class="card-body">
                <div class="fs-1 mb-3 text-success" aria-hidden="true">📖</div>
                <h5 class="fw-bold">Interactive Coping Library</h5>
                <p class="text-muted small">
                  Access 15+ peer-reviewed coping guides, breathwork audio, and action kits with full column search and PDF export.
                </p>
                <router-link to="/resources" class="stretched-link text-success fw-semibold">
                  Browse Resources &rarr;
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-3">
            <div class="card h-100 shadow-sm border-0 border-top border-4 border-warning">
              <div class="card-body">
                <div class="fs-1 mb-3 text-warning" aria-hidden="true">🤝</div>
                <h5 class="fw-bold">1-on-1 Peer Counseling</h5>
                <p class="text-muted small">
                  Book sessions with certified eco-psychologists and mentors with automated conflict constraint management.
                </p>
                <router-link to="/calendar" class="stretched-link text-warning fw-semibold">
                  Schedule Session &rarr;
                </router-link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>
