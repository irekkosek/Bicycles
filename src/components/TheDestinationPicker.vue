<script setup lang="ts">
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import OverlayPanel from "primevue/overlaypanel";
import { TheParametersPicker } from ".";
import { onMounted, ref } from "vue";
import { fetchGeocodingResults } from "../api/getElement";

const props = defineProps<{ currentTrip: any }>();

const from = ref("");
const to = ref("");
const filteredCities = ref();
const newStop = ref("");

const createLoop = () => {
  to.value = from.value;
  checkIfBothSelected();
};

onMounted(() => {
  if (!props.currentTrip) return;
  from.value = props.currentTrip.from ?? "";
  to.value = props.currentTrip.to ?? "";
  checkIfBothSelected();
});

const emit = defineEmits(["destination-chosen", "destination-not-chosen"]);

const isParamPickerVisible = ref(false);

const search = async (event: any) => {
  const propositions = 10;
  const data = await fetchGeocodingResults(event.query, "name", propositions);
  filteredCities.value = data.map(
    (item: any) => `${item.properties.name}, ${item.properties.near}`
  );
};

const overlayPanelComponent = ref();

const toggle = (event: any) => {
  overlayPanelComponent.value.toggle(event);
};

const checkIfBothSelected = () => {
  if (from.value && to.value && from.value.length > 0 && to.value.length > 0) {
    emit("destination-chosen", { from: from.value, to: to.value });
    isParamPickerVisible.value = true;
  } else {
    emit("destination-not-chosen");
    isParamPickerVisible.value = false;
  }
};

const checkIfAnyIsNull = () => {
  if (!from.value || !to.value) {
    emit("destination-not-chosen");
    isParamPickerVisible.value = false;
  }
};
</script>

<template>
  <div class="destination-picker card card--gradient">
    <div class="flex-row">
      <span class="from-picker">
        <AutoComplete
          v-model="from"
          placeholder="Skąd?"
          :suggestions="filteredCities"
          @complete="search"
          @item-select="checkIfBothSelected"
          @change="checkIfAnyIsNull"
          forceSelection
          :delay="100"
        />
        <transition name="bounce">
          <img
            v-if="from && from.length"
            src="../assets/loop.svg"
            class="loop-icon"
            @click="createLoop"
          />
        </transition>
      </span>

      <div class="add-stop">
        <Button
          class="add-stop__button"
          icon="pi pi-plus"
          aria-label="add-stop"
          rounded
          @click="toggle"
        />
        <OverlayPanel ref="overlayPanelComponent">
          <AutoComplete
            v-model="newStop"
            placeholder="Dodaj przystanek"
            :suggestions="filteredCities"
            @complete="search"
            forceSelection
            multiple
            :delay="100"
          />
        </OverlayPanel>
      </div>
    </div>

    <AutoComplete
      v-model="to"
      placeholder="Dokąd?"
      :suggestions="filteredCities"
      @complete="search"
      @item-select="checkIfBothSelected"
      @change="checkIfAnyIsNull"
      forceSelection
      :delay="100"
    />
  </div>

  <Transition name="slide-up">
    <TheParametersPicker v-if="isParamPickerVisible" />
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
