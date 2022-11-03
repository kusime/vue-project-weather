<template>
  <main class="container text-white self-center mt-20">
    <!--    search toolbar-->
    <div
      class="mx-auto pt-4 mb-8 relative flex max-w-screen-md justify-center z-40 shadow-2xl drop-shadow"
    >
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
    <transition name="animate">
      <div v-if="localCityStore.length !== 0" class="">
        <!--        container -->
        <div class="flex flex-col space-y-10 mt-20">
          <!--          card container-->
          <!--          // https://cn.vuejs.org/guide/built-ins/transition-group.html#enter-leave-transitions-->
          <transition-group name="fade">
            <div
              v-for="record in localCityStore"
              :key="record.id"
              :id="String(record.id)"
              class="w-full flex justify-center relative hover:translate-y-[-4px] duration-500 hover:shadow-2xl shadow-xl hover:cursor-pointer"
            >
              <transition name="fade">
                <Suspense>
                  <template #default>
                    <AsyncWeatherCard
                      :id="record.id"
                      :city="record.city"
                      :country="record.country"
                      :lat="record.lat"
                      :lon="record.lon"
                      class="w-full"
                      @click.exact="
                        gotoSubscribe(
                          record.lat,
                          record.lon,
                          record.city,
                          record.country
                        )
                      "
                    >
                      <template #delete>
                        <div
                          class="z-40 absolute top-[14px] right-[14px]"
                          @click.stop="removeCity(record.id)"
                        >
                          <i
                            class="duration-500 fa-solid fa-trash text-blue-900 bg-white rounded-full p-3 hover:translate-y-[-3px] hover:bg-weather-primary hover:text-white"
                          ></i>
                        </div>
                      </template>
                    </AsyncWeatherCard>
                  </template>
                  <template #fallback>
                    <div
                      class="w-full flex bg-blue-900 p-10 text-[3rem] rounded-2xl w-full justify-center space-x-6 items-center text-white"
                    >
                      <svg
                        class="animate-spin -ml-1 mr-3 w-10 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <div class="text-center animate-pulse duration-150">
                        Loading {{ `${record.city} ${record.country}` }} ...
                      </div>
                    </div>
                  </template>
                </Suspense>
              </transition>
            </div>
          </transition-group>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import apiState from "@/stores/apiState";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import localState from "@/stores/localState";
import AsyncWeatherCard from "@/components/async/AsyncWeatherCard.vue";

const local = localState();
const { localCityStore } = storeToRefs(local);
const api = apiState();
const { autoCompleteResults, error, autoActive, queue } = storeToRefs(api);
// useRouter to pass the params to the other route
const router = useRouter();

function gotoSubscribe(
  lat: number | string,
  lon: number | string,
  city: string | string[],
  country: string | string[]
) {
  router.push({
    name: "cityPage",
    query: {
      lat,
      lon,
      preview: "false",
    },
    params: {
      city,
      country,
    },
  });
}

function trigger(e: Event) {
  const ele = e.target as HTMLInputElement;
  api.goAutoCompleteSearch(ele.value);
}

function removeCity(id: number | string) {
  local.removeUnit(id);
}

function goto(selectedResult: any) {
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
      ...(local.checkAlreadyExists(lat, lon)
        ? {
            preview: "false",
          }
        : { preview: "true" }),
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
