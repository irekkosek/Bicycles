<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import TabMenu from "primevue/tabmenu";
import { ref } from "vue";

const router = useRouter();

const items = ref([
  {
    name: "Home",
    image: "src/assets/home-icon.svg",
    command: () => router.push("/"),
  },
  {
    name: "Favourites",
    image: "src/assets/heart-icon.svg",
    command: () => router.push("/favourites"),
  },
]);
</script>

<template>
  <div id="app">
    <main>
      <router-view></router-view>
      <div class="menu">
        <TabMenu :model="items">
          <template #item="{ item, props }">
            <a
              v-ripple
              v-bind="props.action"
              class="flex align-items-center gap-2 menu__icon"
            >
              <img :alt="item.name" :src="item.image" style="width: 22px" />
              <span class="font-bold">{{ item.name }}</span>
            </a>
          </template>
        </TabMenu>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  position: fixed;
  z-index: 100;
  bottom: 0;
  width: 100vw;
  filter: drop-shadow(0px 0px 14px rgba(70, 70, 70, 0.24));
}
.menu__icon {
  display: flex;
  gap: 15px;
}
</style>
