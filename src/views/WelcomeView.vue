<script setup lang="ts">
import { TheDestinationPicker, TheTripPicker } from "../components";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
//import L from "leaflet";
import { fetchPOI } from "../api";
import { fetchElement } from "../api/getElement";

const zoom = 15;

const isTripPickerVisible = ref(false);

const map = ref(null)

// var map = L.map('map').setView([42.35, -71.08], 3);

// // load a tile layer
// L.tileLayer('http://tiles.mapc.org/basemap/{z}/{x}/{y}.png',
//   {
//     attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
//     maxZoom: 17,
//     minZoom: 9
//   }).addTo(map);

// // load GeoJSON from an external file
// fetch("countries.geojson").then(res => res.json()).then(data => {
//   // add GeoJSON layer to the map once the file is loaded
//   L.geoJson(data).addTo(map);
// });

/*const test = async () => {

  const map = L.map('map');
  const lat = 50.29117904070245;
  const lon = 18.680356029431803;
  const radius = 1;
  const limit = 10;
  const data = await fetchPOI(lat, lon, radius, limit)
  L.geoJson(data).addTo(map);
  console.log(map)
}*/
const test2 = async () => {
  const name = "Rydułtowy";
  const fields = "name";
  const limit = 10;
  const data = await fetchElement(name, fields, limit)
  console.log(data)
}
test2()
watch(() => isTripPickerVisible.value, () => {
  //test()
})
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
