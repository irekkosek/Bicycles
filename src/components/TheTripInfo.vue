<script setup lang="ts">
import Button from "primevue/button";

const props = defineProps<{
  chosenTrip: {
    from: string;
    to: string;
    time: string;
    distance: string;
    kcal: string;
  };
}>();

const emit = defineEmits(["trip-cancelled"]);
</script>
<template>
  <div class="trip-info">
    <Button
      @click="emit('trip-cancelled')"
      class="close-button"
      icon="pi pi-times"
      text
      rounded
      aria-label="Cancel"
    />
    <div class="trip-info__title">
      {{ props.chosenTrip.from }} - {{ props.chosenTrip.to }}
    </div>
    <div class="trip-info__details">
      <span class="trip-info__details-item"
        >{{ (parseInt(props.chosenTrip.time) / 3600).toFixed(2) }} h</span
      >
      <span class="trip-info__details-item trip-info__details-item--bolded"
        >{{ (parseInt(props.chosenTrip.distance) / 1000).toFixed(2) }} km</span
      >
      <span class="trip-info__details-item"
        >{{ props.chosenTrip.kcal }} kcal</span
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.trip-info {
  border-radius: 1.375rem;
  background: linear-gradient(180deg, #387ef9 0%, #bf8bed 100%);
  width: 20rem;
  height: 11rem;
  position: absolute;
  z-index: 1;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0px 2px 4px 4px rgba(0, 0, 0, 0.15);

  display: flex;

  flex-direction: column;

  .close-button {
    align-self: flex-end;
    margin: 0.5rem;
    padding: 0.2rem;
    height: 2rem;
    width: 2rem;
  }

  &__title {
    color: #fff;

    text-align: center;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    padding: 0 1rem 1rem 1rem;
    border-bottom: 1px solid #fff;
  }

  &__details {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    padding: 1rem;

    &-item {
      text-align: center;
      font-style: normal;
      line-height: normal;
      font-size: 1rem;
      font-weight: 300;
      color: #fff;

      &--bolded {
        font-size: 1.5rem;
        font-weight: 400;
      }
    }
  }
}
</style>
