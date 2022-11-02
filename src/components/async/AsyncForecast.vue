<template>
  <!--  // https://www.tailwindcsscomponent.com/horizontal-scroll-card-components-->
  <!--  https://tailwindcss.com/docs/overflow-->
  <div class="flex overflow-x-auto pb-10 scrollbar-hide mt-10">
    <div
      class="flex flex-nowrap lg:ml-40 md:ml-20 ml-10 items-center justify-center"
    >
      <div
        v-for="step in api.retrieveTimeStartNow(forecastWeather.list)"
        :key="step['dt']"
        class="inline-block px-3"
      >
        <div class="flex flex-col items-center justify-center p-5">
          <p class="whitespace-nowrap text-2xl text-white">
            {{ api.retrieveCurrentUTCTime(step["dt"]) }}
          </p>
          <img
            :src="`https://openweathermap.org/img/wn/${step.weather[0]['icon']}@2x.png`"
            alt="Weather"
            class="w-[88.45px] h-[88.45px]"
          />
          <p class="whitespace-nowrap text-2xl text-white">
            {{ `${step.main["temp"]} °C` }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiState from "@/stores/apiState";
import { useRoute } from "vue-router";

const api = apiState();
const route = useRoute();

const forecastWeather = await api.goWeatherSearch(
  route.query.lat,
  route.query.lon,
  "forecast"
);

// console.log(forecastWeather);
</script>

<style scoped></style>
