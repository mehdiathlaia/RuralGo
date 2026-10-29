<template>
  <div class="card" v-if="trip?.driver">
    <h3>Conductor assignat</h3>

    <p><b>Nom:</b> {{ trip.driver.name }}</p>
    <p><b>Vehicle:</b> {{ trip.driver.vehicle }}</p>
    <p><b>Matrícula:</b> {{ trip.driver.plate }}</p>
    <p><b>Arribada estimada:</b> {{ trip.driver.eta }} min</p>
  </div>
</template>

<script setup>
import { useTripStore } from '../store/tripStore';
const store = useTripStore();
const trip = store.trip;
</script>
