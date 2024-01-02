<script setup lang="ts">
import { ref } from "vue";
import {
  TheDestinationPicker,
  TheTripPicker,
  TheTripInfo,
  TheTripSteps,
} from "../components";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

const zoom = 15;

const isTripPickerVisible = ref(false);
const isTripPicked = ref(false);

const chosenTrip = ref();
const tripDestinations = ref({ from: "", to: "" });

const startNavigating = (e: any) => {
  isTripPicked.value = true;
  chosenTrip.value = e;
};

const stopNavigating = () => {
  isTripPicked.value = false;
};

const searchForTrips = (e: any) => {
  isTripPickerVisible.value = true;
  tripDestinations.value = e;
};
</script>

<template>
  <TheDestinationPicker
    v-if="!isTripPicked"
    @destination-chosen="searchForTrips"
    @destination-not-chosen="isTripPickerVisible = false"
    :current-trip="chosenTrip"
  />
  <Transition name="fade-in">
    <TheTripInfo
      v-if="isTripPicked"
      :chosen-trip="chosenTrip"
      @trip-cancelled="stopNavigating"
    />
  </Transition>

  <div class="map">
    <l-map
      ref="map"
      v-model:zoom="zoom"
      :options="{ zoomControl: false }"
      :center="[50.29117904070245, 18.680356029431803]"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
    </l-map>
  </div>

  <Transition name="slide-down">
    <TheTripPicker
      v-if="isTripPickerVisible && !isTripPicked"
      :trip-destinations="tripDestinations"
      @trip-picked="startNavigating"
    />
  </Transition>

  <Transition name="slide-down">
    <TheTripSteps v-if="isTripPicked" />
  </Transition>
</template>

<style lang="scss" scoped>
.map {
  height: 100vh;
  width: 100vw;
  position: absolute;
  z-index: 0;
  top: 0;
}
</style>
