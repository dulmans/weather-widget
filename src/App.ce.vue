<template>
  <div class="ww-app">
    <my-modal v-if="displayType === 'switch-item' || displayType === 'switch-locate'">
      <modal-switch
      v-if="displayType === 'switch-item'"
      :displayTypes="displayType"
      :cityInfoObj="{current: currentWeatherInfo.locate.city, switchTo: locateList[modalSwitchItemIndex].locateInfo.city}"
      @clickYes="switchItemClick"
      @clickNo="displayType = 'main'"
      />

      <modal-switch
      v-else-if="displayType === 'switch-locate'"
      :displayTypes="displayType"
      :cityInfoObj="{current: currentWeatherInfo.locate.city, switchTo: toSwitchObject?.locateInfo.city}"
      @clickYes="switchItemClick"
      @clickNo="displayType = 'main'"
      />
    </my-modal>

    <my-modal v-if="showModalInputLocate.showModal">
      <modal-inputs-city
      :appID="appIdOWM"
      @submitInput="createAndAcitveFirstLocate"
      />
    </my-modal>

    <widget-header
    :currentLocate="currentWeatherInfo.locate"
    v-model:displayTypes="displayType"
    />

    <main-widget
    :current="currentWeatherInfo"
    v-if="displayType === 'main'"
    />

    <settings-widget
    v-else-if="displayType === 'setting'"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import axios from 'axios';

import CurrentWeatherObject from './types/CurrentWeatherObject';
import DisplayType from './types/DisplayType';
import LocateList from './types/LocateList';
import GetApiJson from './types/GetApiJson';
import CompassSector from './types/CompassSector';
import Coords from './types/Coords';
import ShowModalInputLocate from './types/ShowModalInputLocate';

import MainWidget from './components/MainWidget.vue';
import WidgetHeader from './components/WidgetHeader.vue';
import MyButton from './components/UI/MyButton.vue';
import MyModal from './components/UI/MyModal.vue';
import ModalSwitch from './components/ModalSwitch.vue';
import CurrentCityCounty from './types/CurrentCityCounty';
import ModalInputsCity from './components/ModalInputsCity.vue';
import SettingsWidget from './components/SettingsWidget.vue';


export default defineComponent({
  components: {
    MainWidget,
    WidgetHeader,
    MyButton,
    MyModal,
    ModalSwitch,
    ModalInputsCity,
    SettingsWidget
},

  setup(){
    const appIdOWM: string = 'c01eddb28c0ce3174c7282f5172965f1';

    const displayType = ref<DisplayType>('main');
    const currentIdItem = ref<number>(0);
    const currentWeatherInfo = ref<CurrentWeatherObject>({
      locate: {
        city: 'load',
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
    const locateList = ref<LocateList[]>([]);
    const toSwitchObject = ref<LocateList>({id: 0, locateInfo:{city: '', country: ''}, coords:{latitude:0, longitude: 0}});
    const modalSwitchItemIndex = ref(0);
    const showModalInputLocate = ref<ShowModalInputLocate>({
      showModal: false as boolean,
      timeoutMounted: true as boolean
    })


    const getWeatherAPI = async (latIn: number, lonIn: number):Promise<GetApiJson> => {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?', {
          params: {
            lat: latIn,
            lon: lonIn,
            limit: 1,
            appid: appIdOWM,
            units: 'metric'
          }
        });
      return response.data;
    };

    const LocateListConstruct = (liC:CurrentCityCounty, cC:Coords) => {
      const res:LocateList = {
        id: Date.now(),
        locateInfo: {
            city: liC.city,
            country: liC.country
        },
        coords: {
            latitude: cC.latitude,
            longitude: cC.longitude
        }
      };
      return res;
    };
    const createLocateListItem = (item:LocateList) => {
      locateList.value.push(item);
      locateList.value = locateList.value.slice();
    };

    const switchItemClick = () => {
      if(displayType.value === 'switch-item'){
        currentIdItem.value = locateList.value[modalSwitchItemIndex.value].id;
      }
      else if(displayType.value === 'switch-locate'){
        createLocateListItem(toSwitchObject.value);
        currentIdItem.value = toSwitchObject.value.id;
      }
      displayType.value = 'main';
    }
    const createAndAcitveFirstLocate = (event:GetApiJson) => {
      const tempObject:LocateList = LocateListConstruct({city: event.name, country: event.sys.country},
                                            {latitude: event.coord?.lat ?? 0, longitude: event.coord?.lon ?? 0});
      createLocateListItem(tempObject);
      currentIdItem.value = tempObject.id;
      showModalInputLocate.value.showModal = false;
    };

    const scenarioAllowedLocate = async ({coords}: any) => {
      showModalInputLocate.value.timeoutMounted = false;
      showModalInputLocate.value.showModal = false;

      const coordsFunc:Coords = {
        latitude: coords.latitude ?? 0,
        longitude: coords.longitude ?? 0
      }
      const response:GetApiJson = await getWeatherAPI(coordsFunc.latitude, coordsFunc.longitude);
      const tempObject:LocateList = LocateListConstruct({city: response.name, country: response.sys.country},
                                            {latitude: response.coord?.lat ?? 0, longitude: response.coord?.lon ?? 0});
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
        toSwitchObject.value = tempObject;
        displayType.value = 'switch-locate';
        return;
      }
      else{
        locateList.value.push(tempObject);
        locateList.value = locateList.value.slice();
        currentIdItem.value = tempObject.id;
        return;
      }
    };
    const scenarioUnAllowedLocate = () => {
      if(locateList.value.length === 0){
        showModalInputLocate.value.showModal = true;
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
      getWeatherAPI,
      toSwitchObject,
      showModalInputLocate,
      createLocateListItem,
      appIdOWM,
      createAndAcitveFirstLocate
    }
  },

  watch: {
    async currentIdItem(){
      if(this.currentIdItem){
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
      }
    },
    locateList(){
      localStorage.setItem('locateList', JSON.stringify(this.locateList));
    }
  },

  mounted(){
    // ТЕСТОВЫЙ БЛОК...
/*     const testOb:LocateList[] = [
      {
        id: 1,
        locateInfo: {
            city: 'Tutayev',
            country: 'RU'
        },
        coords: {
            latitude: 57.8853,
            longitude: 39.5406
        }
      },
      {
        id: 1,
        locateInfo: {
            city: 'Moscow',
            country: 'RU'
        },
        coords: {
            latitude: 55.7522,
            longitude: 37.6156
        }
      }
    ]
    localStorage.setItem('locateList', JSON.stringify(testOb));
    localStorage.setItem('currentId', '1'); */
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
    if(this.locateList.length === 0){
      setTimeout(() => {
        if(this.showModalInputLocate.timeoutMounted && this.locateList.length === 0){
          this.showModalInputLocate.showModal = true;
        }
    }, 5000)
    }
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

  .ww-load{
    pointer-events: none;
    background: $main-color;
    opacity: .3;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
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

  .ww-input__form{
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding-bottom: 20px;
    .ww-error__text{
      position: absolute;
      font-size: 12px;
      color: darkred;
      bottom: 0;
    }
  }

  .ww-input__btn{
    cursor: pointer;
    width: 30px;
    height: auto;
    background-color: transparent;
    transition: all .12s ease-in-out;
    svg {fill: $main-color;}
    &:hover{
      transform: scale(.95);
      opacity: .93;
    }
    &:active{
      transform: scale(.85);
      opacity: .9;
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
    padding: 10px;
    .ww-modal__switch_item, .ww-modal__switch_locate{
      text-align: center;
      .ww-btn-no{
        margin: 15px 0 5px;
      }
    }
    .ww-modal__inputs-city{
      .ww-modal__inputs-city_text{
        text-align: center;
        margin-bottom: 25px;
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

  .ww-input{
    padding: 5px;
    border: 2px solid $main-color;
    outline: none;
    transition: box-shadow .25s ease;
    &:hover{
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
    }
    &:focus{
      box-shadow: 0px 0px 12px 2px rgba(0, 0, 0, 0.4);
      border-color:lightseagreen;
    }
    &.ww-unvalid{
      background: rgba(139, 0, 0, .3);
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