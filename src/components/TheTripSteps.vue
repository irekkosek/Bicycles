<script setup lang="ts">
import { ref } from "vue";

const isTripStepsExpanded = ref(false);

const steps = [
  {
    label: "Jedź prosto",
    additionalInfo: "2.5 km",
    icon: "/src/assets/arrow-up-icon.svg",
  },
  {
    label: "Skręć w prawo w",
    additionalInfo: "ul. Pszczyńska",
    icon: "/src/assets/turn-right-icon.svg",
  },
  {
    label: "Skręć w prawo w",
    additionalInfo: "ul. ks. Franciszka Bojdoła",
    icon: "/src/assets/turn-right-icon.svg",
  },
  {
    label: "Pijalnia Czekolady Wedel",
    type: "stop",
  },
  {
    label: "Jedź prosto",
    additionalInfo: "23.4 km",
    icon: "/src/assets/arrow-up-icon.svg",
  },
  {
    label: "Galeria Pik Mikołów",
    type: "stop",
  },
];
</script>

<template>
  <div
    class="trip-steps card"
    :class="
      !isTripStepsExpanded ? 'trip-steps--collapsed' : 'trip-steps--expanded'
    "
  >
    <div
      class="trip-steps__expander"
      @click="
        isTripStepsExpanded
          ? (isTripStepsExpanded = false)
          : (isTripStepsExpanded = true)
      "
    />

    <div class="trip-steps__items">
      <div
        v-for="({ label, additionalInfo, icon, type }, index) in steps"
        :key="index"
        :class="`trip-item trip-item--${type}`"
      >
        <img v-if="type !== 'stop'" :src="icon" />
        <div class="trip-item__name">{{ label }}: {{ additionalInfo }}</div>
        <img
          v-if="type === 'stop'"
          src="../assets/location-icon.svg"
          class="trip-item__icon"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.trip-steps {
  position: absolute;
  bottom: 0px;

  box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.08);

  transition: cubic-bezier(0.19, 1, 0.22, 1);
  transition-duration: 1s;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;

  .trip-steps__items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;

    max-height: 80%;

    overflow: scroll;
    .trip-item {
      width: 90%;

      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 0.5rem;

      padding: 0.8rem;

      &--stop {
        background: linear-gradient(93deg, #b55ddf 24.42%, #4a95cc 78.81%);
        color: #fff;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.08);
        justify-content: space-between;
        border-radius: 0.625rem;

        img {
          width: 20px;
        }
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
    height: 60%;
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
