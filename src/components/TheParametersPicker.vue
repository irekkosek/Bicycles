<script setup lang="ts">
import { ref, watch, defineEmits } from "vue";
import TabMenu, { TabMenuChangeEvent } from "primevue/tabmenu";
import SelectButton from "primevue/selectbutton";

const isParamPickerExpanded = ref(false);

const items = ref([
  {
    name: "Typ rowera",

    props: [
      { value: "balanced", name: "Górski", type: "planType" },
      { value: "quietest", name: "Miejski", type: "planType" },
      { value: "fastest", name: "Szosowy", type: "planType" },
    ],
  },
  {
    name: "Cel wycieczki",

    props: [
      {
        value: "attractions,castles,museums,ruins",
        name: "Zwiedzanie",
        type: "poiTypes",
      },
      {
        value: "viewpoiTypesnts,parkandridesites",
        name: "Góry",
        type: "poiTypes",
      },
      {
        value: "supermarkets,cinemas,libraries",
        name: "Wycieczka po mieście",
        type: "poiTypes",
      },
      {
        value: "pubs,restaurants,cafes",
        name: "Gastronomia",
        type: "poiTypes",
      },
    ],
  },
  {
    name: "Czas podróży",

    props: [
      { value: "1800", name: "< 1h", type: "duration" },
      { value: "5400", name: "1-2h", type: "duration" },
      { value: "9000", name: "3-4h", type: "duration" },
      { value: "12600", name: "5-6h", type: "duration" },
      { value: "16200", name: "> 8h", type: "duration" },
    ],
  },
  {
    name: "Dystans",

    props: [
      { value: "10000", name: "< 10km", type: "distance" },
      { value: "15000", name: "10-20km", type: "distance" },
      { value: "25000", name: "20-30km", type: "distance" },
      { value: "35000", name: "30-40km", type: "distance" },
      { value: "45000", name: "> 40km", type: "distance" },
    ],
  },
]);

const activeTab = ref(0);

const changeCurrentTabIndex = ({ index }: TabMenuChangeEvent) =>
  (activeTab.value = index);

const selectedParameters = ref(null);

const emit = defineEmits(["parameters-chosen"]);

watch(selectedParameters, () => {
  emit("parameters-chosen", selectedParameters.value);
});
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
    <div
      v-if="isParamPickerExpanded"
      class="parameters-picker__items-container"
    >
      <SelectButton
        v-model="selectedParameters"
        :options="items[activeTab].props"
        optionLabel="name"
        multiple
        aria-labelledby="multiple"
      />
    </div>

    <TabMenu
      :model="items"
      class="parameters-picker__menu"
      @tab-change="changeCurrentTabIndex"
    >
      <template #item="{ item, props }">
        <a v-bind="props.action" class="flex align-items-center gap-2">
          <span class="parameters-picker__menu__item">{{ item.name }}</span>
        </a>
      </template>
    </TabMenu>
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
  z-index: 2;
  top: 0px;

  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.08);

  transition: cubic-bezier(0.19, 1, 0.22, 1);
  transition-duration: 1s;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 2rem;

  &__menu {
    a {
      padding: 0.8rem;
    }
    &__item {
      font-size: 0.8rem;
      font-style: normal;
      font-weight: 300;
      line-height: normal;
    }
  }

  &__items-container {
    display: flex;
    flex-direction: row;
    padding: 1rem;
    gap: 1rem;
  }

  &--collapsed {
    height: 23%;
  }
  &--expanded {
    height: 55%;
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
