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
    <div class="page-title">
      <h2>Favourites</h2>
      <img src="../assets/white-heart-icon.svg" />
    </div>
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
.page-title {
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem;
  h2 {
    margin: 0;
  }
  img {
    transform: scale(0.8);
  }
}

.favourites-view__items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;

  &--centered {
    align-items: center;
    margin: 2rem;
    max-height: 82vh;
    overflow: scroll;
  }

  .fav-item {
    width: 100%;

    border: 1px solid #b55ddf;
    border-radius: 0.625rem;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.08);

    display: flex;
    flex-direction: column;
    gap: 2rem;

    &__title {
      display: flex;
      justify-content: space-between;
      &:hover {
        cursor: pointer;
      }
    }

    padding: 0.8rem;

    transition: all 0.2s ease-in-out;

    &__stop {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      img {
        width: 20px;
      }
      &__action-buttons {
        display: flex;
        gap: 0.2rem;
        img {
          border-radius: 1.125rem;
          background: #fff;
          padding: 0.4rem;
          transform: scale(0.8);

          box-shadow: 0px 4px 5px 0px rgba(52, 52, 52, 0.25);

          transition: 0.3s;
          cursor: pointer;
          &:hover {
            background-color: #f1f1f1;
          }
        }
      }
    }

    &--gradient {
      background: linear-gradient(93deg, #b55ddf 24.42%, #4a95cc 78.81%);
      color: #fff;
      border: 1px solid #fff;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.08);
    }
  }
}
</style>
