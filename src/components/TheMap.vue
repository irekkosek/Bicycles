<script setup lang="ts">
import { onMounted, ref } from "vue";
import { TheDestinationPicker, TheTripInfo } from "../components";
import {
  LMap,
  LTileLayer,
  LGeoJson,
  LMarker,
  LIcon,
  LTooltip,
} from "@vue-leaflet/vue-leaflet";

import { fetchNearestPoint, fetchPOI, fetchGpx, fetchCurrentPosition } from "../api";
import L from "leaflet";

const props = defineProps<{ currentTrip?: any }>();

const zoom = ref(15);

const isTripPickerVisible = ref(false);
const isTripPicked = ref(false);

const chosenTrip = ref();
const tripDestinations = ref();
const geojson = ref(undefined);
const center = ref([50,18]);
const map = ref();

const waypoint = ref({
  name: "Waypoint",
  pointName: "",
  lat: 0,
  lon: 0,
});
onMounted(() => {
  if (!props.currentTrip) return;
  chosenTrip.value = props.currentTrip;
  isTripPicked.value = true;
});

const stopNavigating = () => {
  isTripPicked.value = false;
  isTripPickerVisible.value = true;
  geojson.value = undefined;
};

const mapClicked = async (event: any) => {
  try {
    const latLng = event.latlng;
    const result = await fetchNearestPoint(latLng.lng, latLng.lat);
    waypoint.value = {
      name: "Waypoint",
      pointName: result.features[0].properties.name,
      lat: result.features[0].geometry.coordinates[1],
      lon: result.features[0].geometry.coordinates[0],
    };
  } catch (error) {
    console.error("Błąd podczas pobierania najbliższego punktu:", error);
  }
};

const currentItinerary = ref();
const currentRouteObject = ref();

const allTypes = ["balanced", "fastest", "quietest", "shortest", "leisure"];

const currentRouteIndex = ref(0);

const fitBounds = () => {
  let featureGroups = tripDestinations.value.map((marker: any) => {
    return L.marker([marker.lat, marker.lon]);
  });

  let group = new L.featureGroup(featureGroups);
  map.value.leafletObject.fitBounds(group.getBounds(), { padding: [50, 50] });

  setTimeout(async () => {
    const center = map.value.leafletObject.getCenter();
    pois.value = await fetchPOI(center.lat, center.lng, 10, 5);

    poisMarkers.value = pois.value.map((poi: any) => {
      return poi.features.map((poi: any) => {
        return {
          latLng: [poi.geometry.coordinates[1], poi.geometry.coordinates[0]],
          name: poi.properties.name,
          icon: poi.properties.iconUrl,
        };
      });
    });
    poisMarkers.value = poisMarkers.value.reduce(
      (result: string | any[], array: any) => result.concat(array),
      []
    );
  }, 1000);
};

const pois = ref();

const poisMarkers = ref();

const showRoute = (e: any) => {
  currentRouteObject.value = e;
  geojson.value = e.geometry;
  currentItinerary.value = e.myCustomProperties.itinerary;
};
const getPosition = async() => {
  const position = await fetchCurrentPosition();
  const result = [position.coords.latitude,position.coords.longitude];
  center.value = result;
}
const downloadGPX = async () => {
  const gpxUrl = `https://www.cyclestreets.net/journey/${
    currentItinerary.value
  }/cyclestreets${currentItinerary.value}${
    allTypes[currentRouteIndex.value]
  }.gpx`;
  const file = await fetchGpx(gpxUrl).then((res) => res.blob());

  const csv = file;
  const blob = new Blob([csv]);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", `route-${currentItinerary.value}.gpx`);

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  getPosition();
};
</script>

<template>
  <TheDestinationPicker
    v-if="!isTripPicked"
    :waypoints="waypoint"
    @route-index="currentRouteIndex = $event"
    @start-navigating="
      () => {
        isTripPickerVisible = false;
        chosenTrip = {
          from: currentRouteObject.myCustomProperties.from,
          to: currentRouteObject.myCustomProperties.to,
          distance: currentRouteObject.myCustomProperties.length,
          time: currentRouteObject.myCustomProperties.time,
          kcal: currentRouteObject.myCustomProperties.calories,
        };
        isTripPicked = true;
        poisMarkers = [];
      }
    "
    @emit-geo-json="showRoute"
    @destination-not-chosen="
      () => {
        isTripPickerVisible = true;
        isTripPicked = false;
      }
    "
    @destination-chosen="
      (e) => {
        tripDestinations = e;
        fitBounds();
      }
    "
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
      :center="center"
      @contextmenu="mapClicked"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-geo-json
        v-if="geojson"
        :geojson="geojson"
        :options="{ style: { color: '#ff7800', weight: 5, opacity: 0.65 } }"
      />
      <l-marker
        v-for="dest in tripDestinations ?? []"
        :lat-lng="[dest.lat, dest.lon]"
        :visible="geojson !== undefined"
      >
        <l-icon
          :icon-url="
            dest.name === 'Start'
              ? 'src/assets/map-marker-blue.svg'
              : dest.name === 'End'
              ? 'src/assets/map-marker-red.svg'
              : 'src/assets/map-marker-violet.svg'
          "
          :iconSize="[32, 37]"
          :iconAnchor="[16, 37]"
        >
        </l-icon>
        <l-tooltip>{{ dest.pointName }}</l-tooltip>
      </l-marker>
      <l-marker
        v-for="poi in poisMarkers ?? []"
        :lat-lng="poi.latLng"
        :visible="geojson !== undefined"
      >
        <l-icon :icon-url="poi.icon"> </l-icon>
        <l-tooltip>Możesz zwiedzić: {{ poi.name }}</l-tooltip>
      </l-marker>
    </l-map>
  </div>
  <div v-if="isTripPicked" class="action-buttons">
    <!-- <img
      @click="addRouteToFav"
      :src="
        isRouteLiked
          ? 'src/assets/violet-heart-icon.svg'
          : 'src/assets/violet-heart-oulined-icon.svg'
      "
    /> -->
    <img @click="downloadGPX" src="../assets/download-icon.svg" />
  </div>

  <!-- <Transition name="slide-down">
    <TheTripSteps v-if="isTripPicked" />
  </Transition> -->
</template>

<style lang="scss" scoped>
.map {
  height: 100vh;
  width: 100vw;
  position: absolute;
  z-index: 0;
  top: 0;
}
.action-buttons {
  position: absolute;
  left: 2rem;
  top: 13rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  img {
    height: 3rem;
    width: 3rem;
    border-radius: 1.125rem;
    background: #fff;
    padding: 0.4rem;
    transform: scale(0.8);

    box-shadow: 0px 4px 5px 0px rgba(52, 52, 52, 0.25);

    transition: 0.3s;
    cursor: pointer;
    &:hover {
      background-color: #f1f1f1;
    }
  }
}
</style>
