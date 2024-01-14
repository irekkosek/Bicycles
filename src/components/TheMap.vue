<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  TheDestinationPicker,
  TheTripPicker,
  TheTripInfo,
  TheTripSteps,
} from "../components";
import {
  LMap,
  LTileLayer,
  LGeoJson,
  LMarker,
  LIcon,
} from "@vue-leaflet/vue-leaflet";
import { fetchRouteMC, formatTypeMC, langType, routeType, fetchNearestPoint } from "../api";

const props = defineProps<{ currentTrip?: any }>();
const emit = defineEmits(["navigation-stopped"]);

const zoom = 15;

const isTripPickerVisible = ref(false);
const isTripPicked = ref(false);

const chosenTrip = ref();
const tripDestinations = ref();
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
  console.log(tripDestinations.value);

  const route = routeType.bikeRoad;
  const lang = langType.en;
  const outputFormat = formatTypeMC.geojson;
  const avoidToll = false;
  const data = await fetchRouteMC(
    tripDestinations.value,
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

const mapClicked = async (event: LMap.LeafletMouseEvent) =>{
  try {
    const latLng = event.latlng;
    const result = await fetchNearestPoint(latLng.lng, latLng.lat);
    TheDestinationPicker.routeObject.value[0] = result;
  } catch (error) {
    console.error('Błąd podczas pobierania najbliższego punktu:', error);
  }
}
</script>

<template>
  <TheDestinationPicker
    v-if="!isTripPicked"
    @destination-chosen="searchForTrips"
    @destination-not-chosen="
      () => {
        isTripPickerVisible = false;
        geojson = undefined;
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
      :center="[50.29117904070245, 18.680356029431803]"
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
        </l-icon
      ></l-marker>
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
