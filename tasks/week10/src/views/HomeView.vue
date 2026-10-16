<template>
  <section class="page-section">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-7">
          <p class="eyebrow mb-2">NoMash Library</p>
          <h1 class="display-5 fw-bold mb-3">Library activities with Firebase</h1>
          <p class="lead text-secondary mb-4">
            This project continues the earlier Week 5 library work and adds the pass and credit
            activities for Firebase Authentication and Cloud Firestore.
          </p>
          <div class="d-flex flex-wrap gap-2">
            <RouterLink class="btn btn-primary btn-lg" to="/register">Create Firebase account</RouterLink>
            <RouterLink class="btn btn-outline-primary btn-lg" to="/week5-registration">Open Week 5 form</RouterLink>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="content-card p-4">
            <h2 class="h4">Included activities</h2>
            <ul class="mb-0">
              <li>Week 5 registration and JSON components</li>
              <li>Firebase registration and sign in</li>
              <li>Display the current Firebase user in the browser console</li>
              <li>Add book documents to Cloud Firestore</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
