<template>
  <div class="ww-app">
    <widget-header
    :currentLocate="currentWeatherInfo.locate"
    />
    <main-widget
    :current="currentWeatherInfo"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import axios from 'axios';
import CurrentWeatherObject from './types/CurrentWeatherObject';
import MainWidget from './components/MainWidget.vue';
import WidgetHeader from './components/WidgetHeader.vue';

export default defineComponent({
  components: {
    MainWidget,
    WidgetHeader,
},

  setup(){
    const appIdOWM: string = 'c01eddb28c0ce3174c7282f5172965f1';

    const currentWeatherInfo = ref<CurrentWeatherObject>({
      locate: {
        city: 'Tutaev',
        country: 'RU'
      },
      icon: '',
      temp: 0,
      feelsLike: 0,
      description: '',
      wind:{
          speed: 0,
          deg: 0
      },
      pressure: 0,
      humidity: 0,
      dewPoint: 0,
      visibility: 0
    });

    const getWeatherAPI = async (latIn: number, lonIn: number):Promise<void> => {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?', {
          params: {
            lat: latIn,
            lon: lonIn,
            appid: appIdOWM,
            units: 'metric'
          }
        });
        console.log(response.data);
    };



    return {
      currentWeatherInfo,
      getWeatherAPI,
    }
  },
  mounted(){
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position);
      this.getWeatherAPI(1,1)
    }, function(postionError){
      console.log(postionError);
    }, {enableHighAccuracy: true})
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
</style>
