<script setup lang="ts">
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import ProgressSpinner from "primevue/progressspinner";
import { ref, watchEffect, defineProps, watch } from "vue";
import { fetchGeocodingResults } from "../api/getElement";
import { fetchLoopRouteCSM, fetchRouteCSM } from "../api";
import { TheTripPicker } from ".";

const props = defineProps<{ waypoints: any }>();

const filteredCities = ref();
const stops = ref([]);
const routeObject = ref([
  {
    name: "Start",
    pointName: "",
    lat: 0,
    lon: 0,
  },
  {
    name: "End",
    pointName: "",
    lat: 0,
    lon: 0,
  },
]);

const isParamPickerVisible = ref(false);
const isTripPickerVisible = ref(false);

const emit = defineEmits([
  "destination-chosen",
  "destination-not-chosen",
  "emit-geo-json",
]);

watch(
  () => props.waypoints,
  async (newValue) => {
    if (!newValue) return;
    stops.value.push(newValue as never);
    await mapAndSendParameters();
  }
);

const createLoop = () => {
  routeObject.value[1] = { ...routeObject.value[0], name: "End" };
};

const searchForNewPoint = async (event: any, what: string) => {
  const propositions = 4;
  const data = await fetchGeocodingResults(
    event.query,
    "near,name",
    propositions
  );

  filteredCities.value = data.map((element: any) => ({
    name: what,
    pointName: element.properties.name,
    lat: element.geometry.coordinates[1],
    lon: element.geometry.coordinates[0],
  }));

  const unique = [
    ...new Set(
      filteredCities.value.map(
        ({ pointName }: { pointName: string }) => pointName
      )
    ),
  ];

  filteredCities.value = unique.map((pointName) => {
    return filteredCities.value.find((el: any) => el.pointName === pointName);
  });
};

const tripDestinations = ref();
const isLoaderVisible = ref(false);

const possibleTrips = ref();

const typeOfTrip = ref("");

const searchForTrips = async (destinations: any[]) => {
  isLoaderVisible.value = true;
  isTripPickerVisible.value = false;
  emit("emit-geo-json", undefined);
  tripDestinations.value = destinations;

  let data;

  // look for loop or normal route
  if (
    tripDestinations.value.length === 2 &&
    tripDestinations.value[0].pointName === tripDestinations.value[1].pointName
  ) {
    typeOfTrip.value = "loop";
    const pointForLooping = tripDestinations.value[0];

    data = await fetchLoopRouteCSM(
      `${pointForLooping.lon},${pointForLooping.lat}`
    );
    possibleTrips.value = data;
  } else {
    typeOfTrip.value = "normal";
    const mapped = tripDestinations.value.map((destination: any) => {
      return {
        lat: destination.lat,
        lon: destination.lon,
        name: "",
      };
    });
    data = await fetchRouteCSM(mapped);
    possibleTrips.value = data;
  }

  possibleTrips.value = possibleTrips.value.map((trip: any) => {
    return {
      ...trip,
      properties: {
        from: routeObject.value.find((element) => element.name === "Start")!
          .pointName,
        to: routeObject.value.find((element) => element.name === "End")!
          .pointName,
      },
    };
  });
  isTripPickerVisible.value = true;
  isLoaderVisible.value = false;
};

watchEffect(async () => {
  if (
    !routeObject.value[0] ||
    !routeObject.value[1] ||
    !routeObject.value[0].pointName ||
    !routeObject.value[1].pointName
  ) {
    isParamPickerVisible.value = false;
    return;
  } else {
    isParamPickerVisible.value = true;
    await mapAndSendParameters();
  }
});

watch(
  () => stops.value,
  async () => {
    if (stops.value.length === 0) return;
    await mapAndSendParameters();
  }
);

const mapAndSendParameters = async () => {
  const combined = [routeObject.value[0], ...stops.value, routeObject.value[1]];
  await searchForTrips(combined);
};

const overlayPanelComponent = ref();

const toggle = (event: any) => {
  overlayPanelComponent.value.toggle(event);
};

const startNavigating = (event: any) => {
  const validGeoJson = possibleTrips.value[event].geometry;

  emit("emit-geo-json", validGeoJson);
  emit("destination-chosen", tripDestinations.value);
};
</script>

<template>
  <div class="destination-picker card card--gradient">
    <div class="flex-row">
      <span class="from-picker">
        <AutoComplete
          v-model="routeObject[0]"
          placeholder="Skąd?"
          :suggestions="filteredCities"
          forceSelection
          :delay="100"
          @complete="($event) => searchForNewPoint($event, 'Start')"
          optionLabel="pointName"
        />
        <transition name="bounce">
          <img src="../assets/loop.svg" class="loop-icon" @click="createLoop" />
        </transition>
      </span>

      <div
        v-if="
          routeObject[0] &&
            routeObject[1] &&
            routeObject[0].pointName &&
            routeObject[1].pointName
        "
        class="add-stop"
      >
        <Button
          class="add-stop__button"
          icon="pi pi-plus"
          aria-label="add-stop"
          rounded
          @click="toggle"
        />
        <OverlayPanel ref="overlayPanelComponent">
          <AutoComplete
            v-if="isParamPickerVisible"
            v-model="stops"
            placeholder="Dodaj przystanek"
            :suggestions="filteredCities"
            @complete="($event) => searchForNewPoint($event, 'Waypoint')"
            optionLabel="pointName"
            forceSelection
            multiple
            :delay="300"
          />
        </OverlayPanel>
      </div>
    </div>

    <AutoComplete
      v-model="routeObject[1]"
      placeholder="Dokąd?"
      :suggestions="filteredCities"
      @complete="($event) => searchForNewPoint($event, 'End')"
      optionLabel="pointName"
      forceSelection
      :delay="300"
    />
  </div>

  <Transition name="slide-down">
    <TheTripPicker
      v-if="isTripPickerVisible"
      :trip-destinations="possibleTrips"
      @trip-picked="startNavigating"
      :type-of-trip="typeOfTrip"
    />
  </Transition>
  <div v-if="isLoaderVisible" class="overlay">
    <ProgressSpinner class="overlay__spinner" />
  </div>
</template>

<style scoped lang="scss">
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  height: 100vh;
  width: 100vw;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.destination-picker {
  position: relative;
  z-index: 3;
  padding: 2.5rem;

  background: linear-gradient(380deg, #387ef9 0%, #bf8bed 100%);
  filter: drop-shadow(0px 0px 14px rgba(70, 70, 70, 0.24));
  top: -1.5rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .p-autocomplete .p-inputtext {
    width: 80vw;
    padding: 0.5rem;
    background: #fff;

    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.08);
  }
  .from-picker {
    position: relative;
  }
  .flex-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .loop-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.5rem;

    background-color: white;
    cursor: pointer;
    &:hover {
      animation: spin 1s ease-in-out infinite forwards;
    }
  }
}

@keyframes spin {
  0% {
    transform: translateY(-50%) rotate(0);
  }
  100% {
    transform: translateY(-50%) rotate(360deg);
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: translateY(-50%) scale(0);
  }
  50% {
    transform: translateY(-50%) scale(1.2);
  }
  100% {
    transform: translateY(-50%) scale(1);
  }
}
</style>
