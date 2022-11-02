<template>
  <!--  global container-->
  <div
    class="translate-y-[-18px] overflow-hidden flex flex-col justify-center min-h-screen self-center w-full"
  >
    <!--    preview indicator-->
    <teleport to="body">
      <div
        v-if="preview"
        class="z-30 opacity-80 fixed bottom-0 left-0 right-0 w-full self-center flex justify-center text-white bg-weather-secondary py-5"
      >
        You are currently previewing this city , click the "+" icon to tracking
        this city.
      </div>
    </teleport>

    <!--    city title-->
    <h1 class="text-[4.5rem] self-center text-white translate-y-[1rem]">
      {{ route.params.city }}
    </h1>
    <!--    card container-->
    <div class="flex flex-row justify-center items-center">
      <!--    left container-->
      <div class="flex flex-col space-y-2 items-center">
        <!--      temperature field-->
        <div class="flex flex-row space-x-6 items-center justify-center">
          <!--        temp-->
          <p class="text-[14.875rem] text-white">
            {{ Math.floor(currentWeather.main["temp"]) }}
          </p>
          <!--          status and unit-->
          <div
            class="flex flex-col gap-[0.75rem] items-stretch justify-center text-[3rem] text-white"
          >
            <div class="flex flex-row justify-between items-center">
              <p class="text-[5rem]">°C</p>
              <img
                :src="`http://openweathermap.org/img/wn/${currentWeather.weather[0]['icon']}@2x.png`"
                alt="Weather"
              />
            </div>
            <p class="self-center">
              {{ currentWeather.weather[0]["description"] }}
            </p>
          </div>
        </div>

        <!--        Details-->
        <div
          class="translate-y-[-33px] flex flex-row items-center gap-3 space-x-5 text-white text-[31px]"
        >
          <!--          date-->
          <p class="">
            {{ api.convertTimeStampToDate(currentWeather.dt) }}
          </p>
          <!--          max-min -->
          <div class="flex flex-row items-center gap-3">
            <p>{{ currentWeather.main["temp_max"] }} °C</p>
            <p class="text-orange-600">/</p>
            <p>{{ currentWeather.main["temp_min"] }} °C</p>
          </div>
        </div>
      </div>
    </div>

    <!--    forecastWeather-->
    <transition name="fade">
      <Suspense>
        <template #default>
          <AsyncForecast />
        </template>
        <template #fallback>
          <div class="text-white text-4xl self-center">
            Forecast information is loading ...
          </div>
        </template>
      </Suspense>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import apiState from "@/stores/apiState";
import AsyncForecast from "@/components/async/AsyncForecast.vue";

const api = apiState();
const route = useRoute();

const { lat, lon, preview } = route.query;
console.log("preview > " + preview);
const currentWeather = await api.goWeatherSearch(lat, lon, "weather");

// console.log(currentWeather);
</script>
