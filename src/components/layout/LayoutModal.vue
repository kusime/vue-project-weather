<template>
  <teleport to="body">
    <transition name="animate">
      <div
        v-if="modalActive"
        class="z-50 rounded-2xl w-full fixed bg-black bg-opacity-30 h-screen left-0 top-0 px-8 flex justify-center items-center"
      >
        <!--    // modal contant-->
        <div
          class="p-4 bg-white self-start max-w-screen-md flex flex-col rounded-2xl self-center"
        >
          <slot></slot>
          <button
            class="text-white rounded-2xl drop-shadow hover:shadow-2xl shadow-black mt-8 bg-weather-primary py-2 px-6 hover:-translate-y-1 duration-200"
            @click="modal.closeModal()"
          >
            Close
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import modalState from "@/stores/modalState";
import { storeToRefs } from "pinia";

const modal = modalState();
const { modalActive } = storeToRefs(modal);
</script>
