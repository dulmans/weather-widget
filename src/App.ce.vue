<template>
  <div class="ww-app">
    <my-modal v-if="displayType === 'switch-item'">
      <modal-switch-item
      :cityInfoObj="{current: currentWeatherInfo.locate.city, switchTo: locateList[modalSwitchItemIndex].locateInfo.city}"
      @clickYes="switchItemClick"
      @clickNo="displayType = 'main'"
      />
    </my-modal>

    <widget-header
    :currentLocate="currentWeatherInfo.locate"
    v-model:displayTypes="displayType"
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
import CoordsAllowedFunc from './types/CoordsAllowedFunc';
import DisplayType from './types/DisplayType';
import LocateList from './types/LocateList';
import GetApiJson from './types/GetApiJson';
import CompassSector from './types/CompassSector';

import MainWidget from './components/MainWidget.vue';
import WidgetHeader from './components/WidgetHeader.vue';
import MyButton from './components/UI/MyButton.vue';
import MyModal from './components/UI/MyModal.vue';
import ModalSwitchItem from './components/ModalSwitchItem.vue';


export default defineComponent({
  components: {
    MainWidget,
    WidgetHeader,
    MyButton,
    MyModal,
    ModalSwitchItem
},

  setup(){
    const appIdOWM: string = 'c01eddb28c0ce3174c7282f5172965f1';

    const displayType = ref<DisplayType>('main');

    const currentIdItem = ref(0);

    const currentWeatherInfo = ref<CurrentWeatherObject>({
      locate: {
        city: '',
        country: ''
      },
      icon: '01d',
      temp: 0,
      feelsLike: 0,
      description: '',
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

    const modalSwitchItemIndex = ref(0);


    const switchItemClick = () => {
      currentIdItem.value = locateList.value[modalSwitchItemIndex.value].id;
      displayType.value = 'main';
    }

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
      const response:GetApiJson = await getWeatherAPI(coordsFunc.latitude, coordsFunc.longitude);
      if(locateList.value.length !== 0){
        for(const [index, checkName] of locateList.value.entries()){
          if(checkName.locateInfo.city === response.name){
            if(currentIdItem.value === checkName.id){
              return;
            }
            else{
              modalSwitchItemIndex.value = index;
              displayType.value = 'switch-item';
              return;
            }
          }
        }
        /* Модалка переключить актив на текущее местоположение */
      }
      else{
        /* Модалка "правильно ли мы определили город" */
      }
    };

    const scenarioUnAllowedLocate = () => {
      if(locateList.value.length === 0){
        /* Открываем модальное окно с предложением ввести город самостоятельно */
      }
    };


    return {
      currentWeatherInfo,
      scenarioAllowedLocate,
      scenarioUnAllowedLocate,
      locateList,
      displayType,
      modalSwitchItemIndex,
      switchItemClick,
      currentIdItem,
      getWeatherAPI
    }
  },

  watch: {
    async currentIdItem(){
      localStorage.setItem('currentId', String(this.currentIdItem));
      const getCurrentLocate = () => {
          for(const checkCurrent of this.locateList){
            if(this.currentIdItem === checkCurrent.id){
              return checkCurrent;
            }
          }
          this.currentIdItem = this.locateList[0].id;
          return this.locateList[0];
      };
      const currentLocate:LocateList = getCurrentLocate();

      const getWeatherJSON = async () => {
        const lat = currentLocate?.coords?.latitude ?? 0;
        const lon = currentLocate?.coords?.longitude ?? 0;
        return await this.getWeatherAPI(lat, lon);
      };
      const getWeather:GetApiJson = await getWeatherJSON();

      if(getWeather){
        const compassSector:CompassSector[] = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
        const windDirection:CompassSector = compassSector[Math.round(getWeather.wind.deg / 22.5)];

        const descript = () => {
          const descArr = getWeather.weather[0].description.split('');
          descArr[0] = descArr[0].toUpperCase();
          return descArr.join('') ?? '';
        };

        this.currentWeatherInfo = {
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
    },
    locateList(){
      localStorage.setItem('locateList', JSON.stringify(this.locateList));
    }
  },

  mounted(){
    // ТЕСТОВЫЙ БЛОК...
    const testOb:LocateList[] = [
      {
        id: 1,
        locateInfo: {
            city: 'Tutayev',
            country: 'RU'
        },
        coords: {
            latitude: 57.8853,
            longitude: 39.5406
        },
        current: false,
      },
      {
        id: 2,
        locateInfo: {
            city: 'Moscow',
            country: 'RU'
        },
        coords: {
            latitude: 55.7522,
            longitude: 37.6156
        },
        current: true,
      }
    ]
    localStorage.setItem('locateList', JSON.stringify(testOb));
    localStorage.setItem('currentId', '2');
    //... ТЕСТОВЫЙ БЛОК

    if(localStorage?.currentId){
      this.currentIdItem = Number(localStorage?.currentId);
    };
    if(localStorage?.locateList){
      this.locateList = JSON.parse(localStorage?.locateList);
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
    font-weight: 400;
  }

  svg{
    fill: $main-color;
  }

  .ww-app{
    position: relative;
    width: 300px;
    height: 250px;
    border: 3px solid rgba(128, 128, 128, 0.3);
    border-radius: 8px;
    font-size: 18px;
    padding: 15px 20px;
    &:hover .ww-header__icons .icon-setting{
      opacity: 1;
    }
  }

  .ww-button{
    background: none;
    cursor: pointer;
    border: 2px solid rgba(128, 128, 128, 0.3);
    padding: 3px 5px;
    border-radius: 3px;
    transition: box-shadow .2s ease, transform .1s linear;
    &:hover{
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
    }
    &:active{
      transform: scale(0.95)
    }
  }

  .ww-answer__yes, .ww-answer__no{
    font-weight: 700;
  }

  .ww-answer__yes {
    color: darkgreen;
  }
  .ww-answer__no {
    color: darkred;
  }
  .ww-btn-yes {
    background: rgb(0, 100, 0, 0.2);
  }
  .ww-btn-no {
    background: rgba(139, 0, 0, 0.2);
  }

  .ww-strong{
    font-weight: 700;
    font-size: 1.1em;
  }

  .ww-modal{
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background: rgba(255,255,255,1);
    .ww-modal__switch_item{
      text-align: center;
      .ww-btn-no{
        margin: 15px 0 5px;
      }
    }
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

  .icon-setting{
    transition: opacity .15s ease-in-out, transform .4s ease-in;
    opacity: 0;
    &:hover{
      transform: rotate(180deg);
    }
  }
  .icon-close{
    transition: transform .4s ease;
    &:hover{
      transform: scale(0.8);
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