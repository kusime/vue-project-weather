<template>
  <div class="overflow-hidden">
    <transition name="animate">
      <Suspense>
        <template #default>
          <AsyncCityView />
        </template>
        <template #fallback>
          <div
            class="absolute top-4 min-h-screen w-full min-h-screen text-[11rem] text-white flex justify-center items-center overflow-hidden"
          >
            Requesting ...
          </div>
        </template>
      </Suspense>
    </transition>
  </div>
</template>

<script setup lang="ts">
import AsyncCityView from "@/components/async/AsyncCityView.vue";
</script>
