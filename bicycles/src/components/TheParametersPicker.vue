<script setup lang="ts">
import Steps from "primevue/steps";
import { ref } from "vue";
const isParamPickerExpanded = ref(false);

const items = ref([
  {
    label: "Bike type",
  },
  {
    label: "Trip goal",
  },
  {
    label: "Time",
  },
]);
</script>

<template>
  <div
    class="parameters-picker card"
    :class="
      !isParamPickerExpanded
        ? 'parameters-picker--collapsed'
        : 'parameters-picker--expanded'
    "
  >
    <Steps :model="items" />
    <div
      class="parameters-picker__expander"
      @click="
        isParamPickerExpanded
          ? (isParamPickerExpanded = false)
          : (isParamPickerExpanded = true)
      "
    />
  </div>
</template>

<style lang="scss" scoped>
.parameters-picker {
  position: absolute;
  top: 0px;

  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.08);

  transition: cubic-bezier(0.19, 1, 0.22, 1);
  transition-duration: 1s;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 2rem;

  &--collapsed {
    height: 25%;
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
