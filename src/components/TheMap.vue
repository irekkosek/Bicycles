<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  TheDestinationPicker,
  TheTripPicker,
  TheTripInfo,
  TheTripSteps,
} from "../components";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import {
  ItineraryPoint,
  fetchRouteMC,
  formatTypeMC,
  langType,
  routeType,
} from "../api";

const props = defineProps<{ currentTrip?: any }>();
const emit = defineEmits(["navigation-stopped"]);

const zoom = 15;

const isTripPickerVisible = ref(false);
const isTripPicked = ref(false);

const chosenTrip = ref();
const tripDestinations = ref({ from: "", to: "" });

const geojson = ref(undefined);

onMounted(() => {
  if (!props.currentTrip) return;
  chosenTrip.value = props.currentTrip;
  isTripPicked.value = true;
});

const startNavigating = (e: any) => {
  isTripPicked.value = true;
  chosenTrip.value = e;
};

const stopNavigating = () => {
  isTripPicked.value = false;
  emit("navigation-stopped");
};

const searchForTrips = async (e: any) => {
  isTripPickerVisible.value = true;
  tripDestinations.value = e;
  const itineraryPoints: ItineraryPoint[] = [
    {
      lat: 50.28864098522382,
      lon: 18.67781622133728,
      name: "Start",
    },
    {
      lat: 50.29103321922287,
      lon: 18.680361790311053,
      name: "End",
    },
    {
      lat: 50.29132578635057,
      lon: 18.673654418094117,
      name: "Waypoint",
    },
  ];
  const route = routeType.bikeRoad;
  const lang = langType.en;
  const outputFormat = formatTypeMC.geojson;
  const avoidToll = false;
  const data = await fetchRouteMC(
    itineraryPoints,
    route,
    lang,
    outputFormat,
    avoidToll
  );
  geojson.value = data.geometry;
};

const isRouteLiked = ref(false);

const addRouteToFav = () => {
  // save route to favourites (gpx file)
  isRouteLiked.value = !isRouteLiked.value;
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
      <l-geo-json
        :geojson="geojson"
        :options="{ style: { color: '#ff7800', weight: 5, opacity: 0.65 } }"
      />
    </l-map>
  </div>
  <div v-if="isTripPicked" class="action-buttons">
    <img
      @click="addRouteToFav"
      :src="
        isRouteLiked
          ? 'src/assets/violet-heart-icon.svg'
          : 'src/assets/violet-heart-oulined-icon.svg'
      "
    />
    <img src="../assets/download-icon.svg" />
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
