<template>
  <div class="ww-app">
    <widget-header
    :currentLocate="currentWeatherInfo.locate"
    v-model:displayTypes="displayType"
    />
    <!-- <widget-settings /> -->
    <main-widget
    :current="currentWeatherInfo"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import axios from 'axios';

import CurrentWeatherObject from './types/CurrentWeatherObject';
import CoordsAllowedFunc from './types/CoordsAllowedFunc';
import DisplayType from './types/DisplayType';
import LocateList from './types/LocateList';
import GetApiJson from './types/GetApiJson';
import CompassSector from './types/CompassSector';

import MainWidget from './components/MainWidget.vue';
import WidgetHeader from './components/WidgetHeader.vue';


export default defineComponent({
  components: {
    MainWidget,
    WidgetHeader,
  },

  setup(){
    const appIdOWM: string = 'c01eddb28c0ce3174c7282f5172965f1';

    const displayType = ref<DisplayType>('main')

    const currentWeatherInfo = ref<CurrentWeatherObject>({
      locate: {
        city: 'Tutaev',
        country: 'RU'
      },
      icon: '01d',
      temp: 0,
      feelsLike: 0,
      description: 'ds',
      wind:{
          speed: 0,
          deg: 0,
          direction: 'N'
      },
      pressure: 0,
      humidity: 0,
      visibility: 0
    });

    const locateList = ref<LocateList[] | []>([]);

    const getWeatherAPI = async (latIn: number, lonIn: number):Promise<GetApiJson> => {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?', {
          params: {
            lat: latIn,
            lon: lonIn,
            appid: appIdOWM,
            units: 'metric'
          }
        });
      return response.data;
    };

    const scenarioAllowedLocate = async ({coords}: any) => {
      const coordsFunc:CoordsAllowedFunc = {
        latitude: coords.latitude ?? 0,
        longitude: coords.longitude ?? 0
      }
      const responsse = await getWeatherAPI(coordsFunc.latitude, coordsFunc.longitude);
      console.log(responsse.name);

      if(localStorage?.locateList.length !== 0){

      }
    };

    const scenarioUnAllowedLocate = () => {
      console.log('UNALLOWED');
    };

    const checkCurrentLocate = computed(() => {
      if(locateList.value){
        for(const curren of locateList.value){
          if(curren?.current){
            return curren;
          }
        }
        return locateList.value[0];
      }
    });

    const getCurrentWeather = (getWeather: GetApiJson) => {
      if(getWeather){
        const compassSector:CompassSector[] = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
        const windDirection:CompassSector = compassSector[Math.round(getWeather.wind.deg / 22.5)];

        const descript = () => {
          const descArr=getWeather.weather[0].description.split('');
          descArr[0]=descArr[0].toUpperCase();
          return descArr.join('') ?? '';
        };

        currentWeatherInfo.value = {
          locate: {
            city: getWeather.name,
            country: getWeather.sys.country
          },
          icon: getWeather.weather[0].icon,
          temp: getWeather.main.temp,
          feelsLike: getWeather.main.feels_like,
          description: descript(),
          wind:{
              speed: getWeather.wind.speed,
              deg: getWeather.wind.deg,
              direction: windDirection
          },
          pressure: getWeather.main.pressure,
          humidity: getWeather.main.humidity,
          visibility: getWeather.visibility
        }
      }
    }

    const getJSONCurrentWeather = computed(async () => {
      const lat = checkCurrentLocate.value?.coords.latitude ?? 0;
      const lon = checkCurrentLocate.value?.coords.longitude ?? 0;
      getCurrentWeather(await getWeatherAPI(lat, lon));
    })


    return {
      currentWeatherInfo,
      getWeatherAPI,
      scenarioAllowedLocate,
      scenarioUnAllowedLocate,
      locateList,
      displayType,
      getJSONCurrentWeather,
      getCurrentWeather,
      checkCurrentLocate
    }
  },

  mounted(){
    const testOb:LocateList[] = [{
          id: 1,
          locateInfo: {
              city: 'Tut',
              country: 'RU'
          },
          coords: {
              latitude: 57.8853,
              longitude: 39.5406
          },
          current: false,
    }]
    localStorage.setItem('locateList', JSON.stringify(testOb))
    if(localStorage?.locateList){
      this.locateList = JSON.parse(localStorage?.locateList);
      this.getJSONCurrentWeather;
    };

    navigator.geolocation.getCurrentPosition(this.scenarioAllowedLocate,
                                            this.scenarioUnAllowedLocate,
                                            {enableHighAccuracy: true});
  }
});
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

  $main-color: #48484a;

  * {
    font-family: 'Space Grotesk', Arial, sans-serif;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
    box-sizing: border-box;
    color: $main-color;
  }

  svg{
    fill: $main-color;
  }

  .ww-app{
    width: 300px;
    height: 250px;
    border: 3px solid rgba(128, 128, 128, 0.3);
    border-radius: 8px;
    font-size: 18px;
    padding: 15px 20px;
  }

  .ww-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .ww-header__title span {
      font-size: 14px;
      font-weight: 600;
    }

    .ww-header__icons{
      max-width: 23px;
      max-height: 23px;
      cursor: pointer;
      svg{
        width: 100%;
        height: 100%;
      }
    }
  }

  .ww-main {
    .ww-temp__section {
      display: flex;
      justify-content: center;
      align-items: center;
      > *{flex-basis: 50%;}
      .ww-sky__img {
        height: 90px;
      }
      .ww-temp__text {
        font-size: 2.4em;
        font-weight: 700;
      }
    }
    .ww-description__section {
      margin-bottom: 20px;
    }

    .ww-more_info__section {
      > *:not(:last-child){
        margin-bottom: 7px;
      }
      .ww-more_info__string {
        display: flex;
        .ww-more_info__item {
          overflow: hidden;
          text-overflow: ellipsis;
          flex-basis: 50%;
          display: flex;
          align-items: center;
        }
      }
      .ww-main__text {
        font-size: 0.9em;
        white-space: nowrap;

      }
      .ww-icons {
        width: auto;
        height: 0.9em;
        margin-right: 4px;
      }
    }
  }

</style>