<template>
  <main class="container text-white self-center mt-20">
    <!--    search toolbar-->
    <div class="mx-auto pt-4 mb-8 relative flex max-w-screen-md justify-center">
      <input
        type="text"
        @input="trigger"
        placeholder="Search for a city or state"
        class="py-2 px-1 w-full bg-transparent border-b-2 focus:border-weather-secondary focus:outline-none focus:shadow-md"
      />

      <transition name="fade">
        <ul
          v-if="autoCompleteResults.length !== 0 && autoActive && !error.auto"
          class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        >
          <li
            v-for="result in autoCompleteResults"
            :key="result['place_id']"
            class="py-2 cursor-pointer"
            :id="result['place_id']"
            @click="goto(result)"
          >
            {{ `${api.retrieveCity(result)} , ${api.retrieveCountry(result)}` }}
          </li>
        </ul>
      </transition>

      <transition name="fade">
        <div
          v-if="
            (queue.auto !== 0 && autoActive) ||
            (queue.auto !== 0 && !autoActive)
          "
          class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        >
          Searching ...
        </div>
      </transition>

      <transition name="fade">
        <div
          v-if="
            autoCompleteResults.length === 0 &&
            autoActive &&
            !error.auto &&
            queue.auto === 0
          "
          class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        >
          Sorry, the city you are trying to look up is not available for current
          weather application
        </div>
      </transition>

      <transition name="fade">
        <div
          v-if="error.auto && autoActive"
          class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        >
          Sorry , we have encountered an error during search the city ...
        </div>
      </transition>
    </div>

    <!--    subscription list-->
    <transition name="fade"> </transition>
  </main>
</template>

<script setup lang="ts">
import apiState from "@/stores/apiState";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
const api = apiState();
const { autoCompleteResults, error, autoActive, queue } = storeToRefs(api);

function trigger(e: Event) {
  const ele = e.target as HTMLInputElement;
  api.goAutoCompleteSearch(ele.value);
}

// useRouter to pass the params to the other route
const router = useRouter();
function goto(selectedResult: object) {
  console.log(selectedResult);
  const { lat, lon } = api.retrieveLocationPointer(selectedResult);
  router.push({
    name: "cityPage",
    params: {
      city: api.retrieveCity(selectedResult),
      country: api.retrieveCountry(selectedResult),
    },
    // export declare type LocationQueryRaw = Record<string | number, LocationQueryValueRaw | LocationQueryValueRaw[]>;
    // export declare type LocationQueryValueRaw = LocationQueryValue | number | undefined;
    // export declare type LocationQueryValue = string | null;
    // so , the query can just be string or a number .. not a boolean..
    query: {
      lat,
      lon,
      preview: "true",
    },
  });
  // reset search result page state
  api.autoActive = false;
  api.autoCompleteResults = [];
}
</script>

<style scoped>
.animate-enter-from {
  @apply opacity-0;
}

.animate-enter-active {
  @apply duration-500 transition-all;
}

.animate-enter-to {
  @apply opacity-100;
}

.animate-leave-from {
  @apply opacity-100;
}

.animate-leave-active {
  @apply duration-150 transition-all;
}

.animate-leave-to {
  @apply opacity-0;
}
</style>
