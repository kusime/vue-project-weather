import { defineStore } from "pinia";
import { ref } from "vue";

// map localState to
const localState = defineStore("localState", () => {
  // https://stackoverflow.com/questions/67823122/how-to-use-ref-with-typescript
  // const localStorageStore = ref([]) as Ref<StoreUnit[]>
  const localCityStore = ref<StoreUnit[]>([]);
  const key = "savedCities";

  function getState() {
    const get = localStorage.getItem(key);
    if (get !== null) {
      console.log("getter >>", get);
      localCityStore.value = JSON.parse(get);
    }
    // console log get is null
    console.log("getter is null");
  }

  function _setState() {
    localStorage.setItem(key, JSON.stringify(localCityStore.value));
  }

  // https://dotnetpattern.com/typescript-optional-parameters

  function checkAlreadyExists(
    lat: number | string,
    lon: number | string
  ): true | false {
    return localCityStore.value.some((unit) => {
      return lat === unit.lat && lon === unit.lon;
    });
  }

  function addUnit(unitToBeAdd: StoreUnit): "already" | "success" {
    console.log("unitToBeAdd >>", unitToBeAdd);

    if (checkAlreadyExists(unitToBeAdd.lat, unitToBeAdd.lon)) {
      return "already";
    }

    localCityStore.value.push(unitToBeAdd);
    _setState();
    return "success";
  }

  function removeUnit(id: string | number) {
    console.log("removeNewCity >", id);
    localCityStore.value = localCityStore.value.filter((unit) => {
      // Return a value that coerces to true to keep the element, or to false otherwise.
      return unit.id !== id;
    });
    _setState();
  }

  return { addUnit, removeUnit, getState, checkAlreadyExists, localCityStore };
});
export default localState;
