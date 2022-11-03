import { defineStore } from "pinia";
import axios from "axios";
import type { LocationQueryValue } from "vue-router";

const apiState = defineStore("apiState", {
  state() {
    return {
      autoCompleteResults: [],
      autoActive: false,
      error: {
        auto: false,
        weather: false,
      },
      queue: {
        auto: 0,
        weather: 0,
      },
      keys: {
        weatherKey: "070e4899e86b02414c31a8cd90a88365",
        autoKey: "6bc2b66e2ff74a85bb32415262635cd0",
      },
    };
  },
  actions: {
    retrieveCurrentUTCTime(timeStander: number): string {
      // https://stackoverflow.com/questions/22347521/change-time-format-to-24-hours-in-javascript
      // https://stackoverflow.com/questions/17913681/how-do-i-use-tolocaletimestring-without-displaying-seconds
      return new Date(timeStander * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
    retrieveTimeStartNow(
      weatherUnits: { dt: number; main: { temp: string }; weather: any[] }[]
    ) {
      // new Date().getTime()/1000 will get UTC then + timezone UTC+8
      const currentTimeStamp = new Date().getTime() / 1000;
      console.log(currentTimeStamp);
      const result = weatherUnits.filter((current) => {
        // console.log(current);
        // @ts-ignore
        return Number(current["dt"]) >= currentTimeStamp;
      });
      console.log(result);
      return result;
    },
    convertTimeStampToDate(timeStamp: number): string {
      console.log(timeStamp);
      const ts = new Date(timeStamp * 1000);
      console.log(ts);
      return ts.toDateString();
    },

    retrieveLocationPointer(result: any): { lat: number; lon: number } {
      return { lat: result.lat, lon: result.lon };
    },
    retrieveCity(result: any): string {
      return result["name"]
        ? result["name"]
        : result["old_name"]
        ? result["old_name"]
        : result["address_line1"];
    },
    retrieveCountry(result: any): string {
      return result["country"]
        ? result["country"]
        : result["county"]
        ? result["county"]
        : "";
    },

    clearPrevious(id: number): void {
      console.log("clearPrevious called with id: " + id);
      // clear previous query
      clearTimeout(id);
    },

    async goWeatherSearch(
      lat: LocationQueryValue | LocationQueryValue[] | string | number,
      lon: LocationQueryValue | LocationQueryValue[] | string | number,
      types: "weather" | "forecast"
    ) {
      try {
        this.error.auto = false;

        return (
          await axios.get(`https://api.openweathermap.org/data/2.5/${types}`, {
            params: {
              appid: this.keys.weatherKey,
              lat,
              lon,
              units: "metric",
              lang: "zh_cn",
              // ...(types ==='forecast' ? {cnt: 7} : {})
            },
          })
        ).data;
      } catch {
        this.error.weather = true;
      }
    },

    goAutoCompleteSearch(queryPrams: string): void {
      console.log(">>>", queryPrams);
      if (this.queue.auto !== 0) {
        // clear the previous task
        this.clearPrevious(this.queue.auto);
      }

      if (queryPrams.length === 0) {
        // make sure the information represent the correct time
        this.autoActive = false;
        console.log(queryPrams);
        return;
      }

      if (this.error.auto) {
        // clear the error message
        this.error.auto = false;
      }

      // clear previous results
      this.autoCompleteResults = [];

      // retrieve the queue id
      this.queue.auto = setTimeout(async () => {
        console.log(
          "goAutoCompleteSearch called with queryPrams: " + queryPrams
        );
        try {
          // get the results
          this.autoCompleteResults = (
            await axios.get(
              `https://api.geoapify.com/v1/geocode/autocomplete`,
              {
                params: {
                  apiKey: this.keys.autoKey,
                  format: "json",
                  text: queryPrams,
                },
              }
            )
          ).data.results;
          // active the bar
          this.autoActive = true;
          // reset the queue mark as finished
          this.queue.auto = 0;
        } catch {
          // error handler
          // mark the error during the searching process
          this.autoActive = true;
          this.error.auto = true;
          // reset the queue mark as finished(error occurred)
          this.queue.auto = 0;
          setTimeout(() => {
            this.autoActive = true;
            this.error.auto = false;
          }, 300);
        }
        console.log(this.autoCompleteResults);
      }, 300);
    },
  },
});

export default apiState;
