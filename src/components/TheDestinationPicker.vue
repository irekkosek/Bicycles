<script setup lang="ts">
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import { TheParametersPicker } from ".";
import { ref, watchEffect } from "vue";
import { fetchGeocodingResults } from "../api/getElement";

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

const createLoop = () => {
  routeObject.value[1] = { ...routeObject.value[0], name: "End" };
};

const emit = defineEmits(["destination-chosen", "destination-not-chosen"]);

const isParamPickerVisible = ref(false);

const search = async (event: any, what: string) => {
  const propositions = 5;
  const data = await fetchGeocodingResults(event.query, "name", propositions);

  filteredCities.value = data.map((element: any) => ({
    name: what,
    pointName: element.properties.name,
    lat: element.geometry.coordinates[1],
    lon: element.geometry.coordinates[0],
  }));
};

watchEffect(() => {
  if (
    !routeObject.value[0] ||
    !routeObject.value[1] ||
    !routeObject.value[0].pointName ||
    !routeObject.value[1].pointName
  ) {
    emit("destination-not-chosen");
    isParamPickerVisible.value = false;
    return;
  } else {
    isParamPickerVisible.value = true;
  }
});

const mapAndSendParameters = (parameters: any) => {
  const combined = [routeObject.value[0], ...stops.value, routeObject.value[1]];
  emit("destination-chosen", combined, parameters);
};

const overlayPanelComponent = ref();

const toggle = (event: any) => {
  overlayPanelComponent.value.toggle(event);
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
          @complete="($event) => search($event, 'Start')"
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
            @complete="($event) => search($event, 'Waypoint')"
            optionLabel="pointName"
            forceSelection
            multiple
            :delay="100"
          />
        </OverlayPanel>
      </div>
    </div>

    <AutoComplete
      v-model="routeObject[1]"
      placeholder="Dokąd?"
      :suggestions="filteredCities"
      @complete="($event) => search($event, 'End')"
      optionLabel="pointName"
      forceSelection
      :delay="100"
    />
  </div>

  <Transition name="slide-up">
    <TheParametersPicker
      v-if="isParamPickerVisible"
      @parameters-chosen="mapAndSendParameters"
    />
  </Transition>
</template>

<style scoped lang="scss">
.destination-picker {
  position: relative;
  z-index: 3;
  padding: 2.5rem;

  background: linear-gradient(180deg, #387ef9 0%, #bf8bed 100%);
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
