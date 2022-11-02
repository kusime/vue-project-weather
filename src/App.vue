<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import LayoutNavigator from "@/components/layout/LayoutNavigator.vue";

// load the local state when the application is mounted
import { onMounted } from "vue";
import localState from "@/stores/localState";

onMounted(() => {
  const local = localState();
  local.getState();
  // local.addNewCity({id:'41'})
  // setTimeout(()=>{
  //   local.removeNewCity('41')
  // },2000)
});
</script>

<template>
  <div class="overflow-hidden flex flex-col min-h-screen bg-sky-700">
    <LayoutNavigator />

    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
