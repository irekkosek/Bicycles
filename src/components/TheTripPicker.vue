<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps<{ tripDestinations: { from: string; to: string } }>();

const isTripPickerExpanded = ref(false);
const trips = ref();

const getTrips = async () => {
  // API call for future
  // const response = await fetch(
  //   `http://localhost:3000/trips?from=${props.tripDestinations.from}&to=${props.tripDestinations.to}`
  // );
  // const data = await response.json();
  // trips.value = data;

  trips.value = [
    {
      from: props.tripDestinations.from,
      to: props.tripDestinations.to,
      distance: "24.5km",
      time: "2 h 23 min",
      kcal: "243",
    },
    {
      from: props.tripDestinations.from,
      to: props.tripDestinations.to,
      distance: "28.4km",
      time: "2 h 23 min",
      kcal: "243",
    },
    {
      from: props.tripDestinations.from,
      to: props.tripDestinations.to,
      distance: "32.1km",
      time: "2 h 23 min",
      kcal: "243",
    },
  ];
};

onMounted(() => {
  getTrips();
});

watch(
  () => props.tripDestinations,
  () => {
    getTrips();
  }
);

const emit = defineEmits(["trip-picked"]);
</script>

<template>
  <div
    class="trip-picker card"
    :class="
      !isTripPickerExpanded ? 'trip-picker--collapsed' : 'trip-picker--expanded'
    "
  >
    <div
      class="trip-picker__expander"
      @click="
        isTripPickerExpanded
          ? (isTripPickerExpanded = false)
          : (isTripPickerExpanded = true)
      "
    />

    <div class="trip-picker__items">
      <div
        v-for="({ from, to, distance, time, kcal }, index) in trips"
        :key="index"
        class="trip-item"
        @click="emit('trip-picked', { from, to, distance, time, kcal, index })"
      >
        <div class="trip-item__name">{{ from }} - {{ to }}</div>
        <div class="trip-item__distance">{{ distance }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.trip-picker {
  position: absolute;
  bottom: 0px;

  box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.08);

  transition: cubic-bezier(0.19, 1, 0.22, 1);
  transition-duration: 1s;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;

  .trip-picker__items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    .trip-item {
      width: 90%;

      font-size: 0.8rem;

      border: 1px solid #b55ddf;
      border-radius: 0.625rem;
      background: #fff;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.08);

      display: flex;
      justify-content: space-between;
      gap: 1rem;

      padding: 0.8rem;

      transition: all 0.2s ease-in-out;

      &:hover {
        cursor: pointer;
        background: linear-gradient(93deg, #b55ddf 24.42%, #4a95cc 78.81%);
        color: #fff;
      }
    }
  }

  &--collapsed {
    height: 20%;

    .trip-item:not(:first-child) {
      display: none;
    }
  }
  &--expanded {
    height: 40%;
  }

  &__expander {
    align-self: center;
    background: linear-gradient(
      180deg,
      rgba(74, 149, 204, 0.52) 0%,
      rgba(181, 93, 223, 0.51) 100%
    );
    width: 100px;
    height: 10px;
    border-radius: 20px;

    transition: 0.4s;
    &:hover {
      cursor: pointer;
      background: linear-gradient(
        180deg,
        rgba(74, 149, 204, 0.52) 0%,
        rgba(181, 93, 223, 0.51) 100%
      );
      opacity: 0.8;
    }
  }
}
</style>
