<script setup lang="ts">
import { TheDestinationPicker, TheTripPicker } from "../components";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

const zoom = 15;
</script>

<template>
  <!-- <TheLogo /> -->
  <TheDestinationPicker />
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
  <TheTripPicker />
</template>

<style lang="scss" scoped>
.map {
  height: 100vh;
  width: 100vw;
  position: relative;
  z-index: 0;
}
</style>
