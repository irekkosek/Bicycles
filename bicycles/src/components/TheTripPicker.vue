<script setup lang="ts">
import { ref } from "vue";

const isTripPickerExpanded = ref(false);

const trips = [
  {
    from: "Gliwice",
    to: "Mikołów",
    distance: "24.5km",
  },
  {
    from: "Gliwice",
    to: "Mikołów",
    distance: "28.4km",
  },
  {
    from: "Gliwice",
    to: "Mikołów",
    distance: "32.1km",
  },
];
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

    <div v-if="!isTripPickerExpanded" class="trip-picker__items">
      <div class="trip-item">
        <div class="trip-item__name">
          {{ trips[0].from }} - {{ trips[0].to }}
        </div>
        <div class="trip-item__distance">{{ trips[0].distance }}</div>
      </div>
    </div>

    <div v-else class="trip-picker__items">
      <div
        v-for="({ from, to, distance }, index) in trips"
        :key="index"
        class="trip-item"
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
  gap: 2rem;

  &--collapsed {
    height: 15%;
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

  .trip-picker__items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;

    .trip-item {
      width: 90%;

      border: 1px solid;
      border-image-slice: 1;
      //   border-radius: 0.625rem;
      border-image-source: linear-gradient(
        93deg,
        #b55ddf 24.42%,
        #4a95cc 78.81%
      );
      background: #fff;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.08);

      display: flex;
      justify-content: space-between;

      padding: 0.8rem;

      transition: all 0.5s ease-in-out;

      &:hover {
        cursor: pointer;
        background: linear-gradient(93deg, #b55ddf 24.42%, #4a95cc 78.81%);
        color: #fff;
      }
    }
  }
}
</style>
