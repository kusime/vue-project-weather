<template>
  <header
    class="z-30 opacity-80 fixed top-0 left-0 right-0 bg-weather-primary shadow-lg flex justify-center"
  >
    <nav
      class="container flex flex-col md:flex-row items-center gap-4 text-white py-6"
    >
      <RouterLink :to="{ name: 'home' }">
        <div class="ml-10 flex items-center gap-3">
          <i class="fa-solid fa-sun text-2xl"></i>
          <p class="text-2xl">The Local Weather</p>
        </div>
      </RouterLink>

      <div class="flex gap-3 flex-1 justify-end items-center mr-10">
        <i
          class="fa-solid fa-circle-info text-xl hover:text-sky-500 duration-500"
          @click="showDetails"
        ></i>
        <i
          class="fa-solid fa-plus text-xl hover:text-sky-500 duration-500"
          @click="addNewCity"
        ></i>
      </div>
    </nav>
  </header>
  <LayoutModal>
    <div v-if="content === 'details'">
      <h1 class="text-2xl font-bold">About</h1>
      <p>
        The Local Weather allows you to track the current and future weather of
        hte cities of your choosing
      </p>
      <h1 class="text-2xl font-bold mt-4">How it works</h1>
      <ul>
        <li>
          1. Search for your citi by entering the name into the search bar
        </li>
        <li>
          2. Select a city within the results , this will tke you to the current
          weather fot you selection
        </li>
        <li>
          3. Track the city by clicking on the "+" in the top right this will
          save the city to view at the later time on the home age
        </li>
        <li></li>
      </ul>

      <h1 class="text-2xl font-bold mt-4">Removing a city</h1>
      <p>
        If you no longer with to track a city ,simply select the city within the
        home page at the bottom of the page there will be an option to delete
        the city.
      </p>
    </div>

    <div v-if="content === 'addSuccess'">
      <h1 class="text-2xl p-30 p-20 text-center">City tracking success !</h1>
    </div>

    <div v-if="content === 'addFailure'">
      <p class="text-2xl p-30 text-center">
        Tracking city <span class="text-red-700">Failed</span>
      </p>
      <p class="text-xl text-center mt-4 p-30">
        Tips: '+' button only available in city page
      </p>
    </div>

    <div v-if="content === 'addAlready'">
      <h1 class="text-2xl p-30 text-center">
        Tracking city <span class="text-red-700">Failed</span>
      </h1>
      <p class="text-xl text-center mt-4 p-30">
        Current city is already been tracked !
      </p>
    </div>
  </LayoutModal>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import modalState from "@/stores/modalState";
import localState from "@/stores/localState";
import LayoutModal from "@/components/layout/LayoutModal.vue";
import { ref } from "vue";
const modal = modalState();
const local = localState();
const route = useRouter();

let content = ref<"details" | "addSuccess" | "addFailure" | "addAlready">(
  "details"
);

function showDetails() {
  content.value = "details";
  modal.openModal();
}

function addNewCity() {
  // const route = useRouter()
  // [Vue warn]: inject() can only be used inside setup() or functional components
  // https://blog.csdn.net/qq_18470967/article/details/121023827
  const currentRoute = route.currentRoute.value;
  console.log(currentRoute);
  if (currentRoute.path === "/") {
    content.value = "addFailure";
    modal.openModal();
    return;
  }

  content.value = "addSuccess";

  const { city, country } = currentRoute.params;
  const { lat, lon } = currentRoute.query;
  // log all params

  // eslint-disable-next-line no-undef
  const toBeAdded: StoreUnit = {
    id: Math.random(),
    city,
    country,
    lat,
    lon,
  };
  const addStatus = local.addUnit(toBeAdded);
  content.value = addStatus === "already" ? "addAlready" : "addSuccess";
  modal.openModal();
}
</script>
