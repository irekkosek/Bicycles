<script setup lang="ts">
import { ref } from "vue";
import { TheDestinationPicker, TheTripPicker } from "../components";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
//import L from "leaflet";
//import { fetchPOI } from "../api";
import { fetchElement } from "../api/getElement";

const zoom = 15;

const isTripPickerVisible = ref(false);
</script>

<template>
  <TheDestinationPicker
    @destination-chosen="isTripPickerVisible = true"
    @destination-not-chosen="isTripPickerVisible = false"
  />
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
    <TheTripPicker v-if="isTripPickerVisible" />
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
