<template>
  <div class="flex w-full items-center flex-row rounded-2xl bg-blue-900 p-10">
    <slot name="delete"></slot>
    <!--      left container -->
    <div class="flex">
      <div class="flex-col flex items-center justify-center space-y-6">
        <!--        City and country-->
        <h1 class="text-[2.5rem] p-3">{{ `${city} ${country}` }}</h1>
        <!--          max-min -->
        <div class="flex flex-row items-center justify-start gap-3">
          <p>{{ currentWeather.main["temp_max"] }} °C</p>
          <p class="text-orange-600">/</p>
          <p>{{ currentWeather.main["temp_min"] }} °C</p>
        </div>
      </div>
    </div>

    <!--      right container-->
    <div class="flex flex-1 justify-end items-center">
      <!--      icon-->
      <img
        :src="`https:///openweathermap.org/img/wn/${currentWeather.weather[0]['icon']}@2x.png`"
        alt="Weather"
        class="w-[100px] h-[100px] mr-5"
      />
      <div class="max-w-sm flex-col flex items-end mr-6 space-y-6">
        <!--        temperature-->
        <!--        temp-->
        <p class="text-white text-5xl">
          {{ Math.floor(currentWeather.main["temp"]) }}°C
        </p>
        <p class="text-white text-2xl">
          {{ currentWeather.weather[0]["description"] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import apiState from "@/stores/apiState";
// https://blog.csdn.net/lijiahui_/article/details/122725791
// eslint-disable-next-line no-undef
// https://segmentfault.com/q/1010000042014549
// https://github.com/vuejs/core/issues/7010
interface StoreUnit {
  id: string | number;
  lat: string | number;
  lon: string | number;
  city: string | string[];
  country: string | string[];
}

const props = defineProps<StoreUnit>();
console.log(props);

const api = apiState();
const currentWeather = await api.goWeatherSearch(
  props.lat,
  props.lon,
  "weather"
);
</script>

<style scoped></style>
