<script setup lang="ts">
import { ref } from "vue";

const trips = ref([
  {
    from: "Mikołów",
    to: "Gliwice",
    distance: "24",
    stops: ["Pijalnia Czekolady Wedel", "Palmiarnia Gliwice"],
    expanded: false,
  },
  {
    from: "Mikołów",
    to: "Gliwice",
    distance: "22.5",
    stops: ["MDK Gliwice", "Palmiarnia Gliwice"],
    expanded: false,
  },
  {
    from: "Mikołów",
    to: "Gliwice",
    distance: "27.3",
    stops: ["Pijalnia Czekolady Wedel", "Pracownia Artystyczna", "Sushi Bar"],
    expanded: false,
  },
]);
</script>
<template>
  <div class="favourites-view">
    <h2>Favourites</h2>
    <div class="favourites-view__items favourites-view__items--centered">
      <div v-for="(trip, index) in trips" :key="index" class="fav-item">
        <div class="fav-item__title" @click="trip.expanded = !trip.expanded">
          <div class="fav-item__name">{{ trip.from }} - {{ trip.to }}</div>
          <div class="fav-item__distance">{{ trip.distance }} km</div>
        </div>

        <div v-if="trip.expanded" class="favourites-view__items">
          <div
            v-for="(stop, i) in trip.stops"
            :key="`stop-${i}-${index}`"
            class="fav-item fav-item__stop fav-item--gradient"
          >
            {{ stop }}
            <img src="../assets/location-icon.svg" />
          </div>
          <div class="fav-item__stop__action-buttons">
            <img src="../assets/violet-heart-icon.svg" />
            <img src="../assets/download-icon.svg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
h2 {
  position: sticky;
}
.favourites-view__items {
  max-height: 82vh;
  overflow: scroll;
}
</style>
