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
      @submitInput="createAndActiveItem"
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
    :listItems="locateList"
    :currentItem="currentIdItem"
    :appID="appIdOWM"
    :showError="showErrorCreateCity"
    @createItem="createAndActiveItem"
    @switchItem="switchItemClick"
    @deleteItem="deleteItemLocateList"
    @updateLists="updateItemLists"
    />

  </div>
</template>

<script lang="ts">
/* Импортируем модули */
import { defineComponent, ref} from 'vue';
import axios, { AxiosResponse } from 'axios';

/* Импортируем type-файлы .TS */
import CurrentWeatherObject from './types/CurrentWeatherObject';
import DisplayType from './types/DisplayType';
import LocateList from './types/LocateList';
import GetApiJson from './types/GetApiJson';
import CompassSector from './types/CompassSector';
import Coords from './types/Coords';
import ShowModalInputLocate from './types/ShowModalInputLocate';

/* Импортируем компоненты .VUE */
import MainWidget from './components/MainWidget.vue';
import WidgetHeader from './components/WidgetHeader.vue';
import MyButton from './components/UI/MyButton.vue';
import MyModal from './components/UI/MyModal.vue';
import ModalSwitch from './components/ModalSwitch.vue';
import CurrentCityCountry from './types/CurrentCityCountry';
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
/* =================================================================== */
  /* ПЕРЕМЕННЫЕ */
    /* ============= */
    /* ПОСТОЯННЫЕ ПЕРЕМЕННЫЕ: (основные переменные, которые необходимы для работы виджета) */
    /* ============= */
    const appIdOWM: string = 'c01eddb28c0ce3174c7282f5172965f1'; // API-токен OpenWeatherMap
    const displayType = ref<DisplayType>('main'); // Страница виджета по-умолчанию
    const currentIdItem = ref<number>(0); // Переменная, которая отвечает за активный ID-элемент
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
    }); // Переменная, которая хранит в себе всю информацию об активном элемента виджета
    const showModalInputLocate = ref<ShowModalInputLocate>({
      showModal: false as boolean,
      timeoutMounted: true as boolean
    }); // Переменная, отвечающая за отображение модального окна собственноручного ввода локации
    const locateList = ref<LocateList[]>([]); // Переменная, в которую подгружается список элементов из кэша

    /* ============= */
    /* ВРЕМЕННЫЕ ПЕРЕМЕННЫЕ: (необходимые для какой-то функции/ отображения элемента) */
    /* ============= */
    const toSwitchObject = ref<LocateList>({id: 0, locateInfo:{city: '', country: ''}, coords:{latitude:0, longitude: 0}});
    const modalSwitchItemIndex = ref(0);
    const showErrorCreateCity = ref<boolean>(false);
/* =================================================================== */


/* =================================================================== */
  /* ФУНКЦИИ */
    /* ============= */
    /* НЕЗАВИСИМЫЕ ФУНКЦИИ: (которые независимы от других функций) */
    /* ============= */
    const getWeatherAPI = async (latIn: number, lonIn: number):Promise<GetApiJson> => {
      const response:AxiosResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather?', {
          params: {
            lat: latIn,
            lon: lonIn,
            limit: 1,
            appid: appIdOWM,
            units: 'metric'
          }
        });
      return response?.data;
    }; // Функция, которая выполняет API-запросы на OWM и получает полную информацию о погоде по запрашиваемой локации

    const LocateListConstruct = (liC:CurrentCityCountry, cC:Coords):LocateList => {
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
    }; // Функция-конструктор, которая конструирует элемент локации дял дальнейшей записи его в кэш

    const createLocateListItem = (item:LocateList):void => {
      locateList.value.push(item);
      locateList.value = locateList.value.slice();
    }; // Функция, которая принимает в себя сконструированный элемент локации и добавляет его в общий массив и в кэш

    const deleteItemLocateList = (event:number):void => {
      if(locateList.value.length === 1){
        locateList.value = locateList.value.filter(x => x.id !== event);
        showModalInputLocate.value.showModal = true;
        return;
      }
      else if(currentIdItem.value == event){
        locateList.value = locateList.value.filter(x => x.id !== event);
        currentIdItem.value = locateList.value[0].id;
        return;
      };
      locateList.value = locateList.value.filter(x => x.id !== event);
    }; // Функция, которая отвечает за удаление элементов из списка избранных локаций

    const updateItemLists = (event:LocateList[]):void => {
      localStorage.setItem('locateList', JSON.stringify(event));
      return;
    }; // Функция, которая обновляет порядок элементов (который пользователь сам сделал, перемещая избранные локации) в кэше


    /* ============= */
    /* ЗАВИСИМЫЕ ФУНКЦИИ: (которые зависят от других функций) */
    /* ============= */
    const switchItemClick = (event:number):void => {
      if(displayType.value === 'switch-item'){
        currentIdItem.value = locateList.value[modalSwitchItemIndex.value].id;
      }
      else if(displayType.value === 'switch-locate'){
        createLocateListItem(toSwitchObject.value);
        currentIdItem.value = toSwitchObject.value.id;
      }
      else if(displayType.value === 'setting' && event !== currentIdItem.value){
        currentIdItem.value = event;
      };
      displayType.value = 'main';
    }; // Функция, которая реагирует на произвольные события и переключает активный элемент, в зависимости от displayType, от которого получен event

    const createAndActiveItem = (event:GetApiJson):void => {
      if(locateList.value.length !== 0){
        for(const locateItem of locateList.value){
          if(locateItem.locateInfo.city === event.name){
            showErrorCreateCity.value = true
            setTimeout(() => {
              showErrorCreateCity.value = false;
            }, 2500);
            return;
          };
        };
      };
      const tempObject:LocateList = LocateListConstruct({city: event.name, country: event.sys.country},
                                            {latitude: event.coord?.lat ?? 0, longitude: event.coord?.lon ?? 0});
      createLocateListItem(tempObject);
      currentIdItem.value = tempObject.id;
      showModalInputLocate.value.showModal = false;
    }; // Функция, которая в качестве значения получает response-ответ OWM, создаёт элемент и делает его активным элементов виджета

    const scenarioAllowedLocate = async ({coords}:  any):Promise<void> => {
      showModalInputLocate.value.timeoutMounted = false;
      showModalInputLocate.value.showModal = false;
      const coordsFunc:Coords = {
        latitude: coords.latitude ?? 0,
        longitude: coords.longitude ?? 0
      };
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
            };
          };
        };
        toSwitchObject.value = tempObject;
        displayType.value = 'switch-locate';
        return;
      }
      else{
        locateList.value.push(tempObject);
        locateList.value = locateList.value.slice();
        currentIdItem.value = tempObject.id;
        return;
      };
    }; // Сценарий, при котором юзер соглашается на определение его местоположения

    const scenarioUnAllowedLocate = () => {
      if(locateList.value.length === 0){
        showModalInputLocate.value.showModal = true;
      };
      return;
    }; // Сценарий, при котором юзер не соглашается на определение его местоположения
/* =================================================================== */
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
      createAndActiveItem,
      deleteItemLocateList,
      showErrorCreateCity,
      updateItemLists,
    }
  },



/* =================================================================== */
  /* ОТСЛЕЖИВАЕМЫЕ ЭЛЕМЕНТЫ */
  watch: {
    async currentIdItem(){
      if(this.currentIdItem){
        localStorage.setItem('currentId', String(this.currentIdItem));
        const getCurrentLocate = () => {
            for(const checkCurrent of this.locateList){
              if(this.currentIdItem == checkCurrent.id){
                return checkCurrent;
              };
            };
            this.currentIdItem = this.locateList[0]?.id;
            return this.locateList[0];
        };
        const currentLocate:LocateList = getCurrentLocate();

        const getWeatherJSON = async ():Promise<GetApiJson> => {
          const lat: number = currentLocate?.coords?.latitude ?? 0;
          const lon: number = currentLocate?.coords?.longitude ?? 0;
          return await this.getWeatherAPI(lat, lon);
        };
        const getWeather:GetApiJson = await getWeatherJSON();

        if(getWeather){
          const compassSector:CompassSector[] =
          ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
          const windDirection:CompassSector = compassSector[Math.round(getWeather.wind.deg / 22.5)];

          const descriptionFirstUpperCase = ():string => {
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
            description: descriptionFirstUpperCase(),
            wind:{
                speed: getWeather.wind.speed,
                deg: getWeather.wind.deg,
                direction: windDirection
            },
            pressure: getWeather.main.pressure,
            humidity: getWeather.main.humidity,
            visibility: getWeather.visibility
          };
        };
      };
    }, // Следим за переменной активного элемента и обновляем его при обновлении переменной, а также сохраняем активный ID в кэше

    locateList(){
      localStorage.setItem('locateList', JSON.stringify(this.locateList));
    } // Следим за обновлением переменной избранных локаций и обновляет их в кэше
  },
/* =================================================================== */


/* =================================================================== */
  /* НАЧАЛЬНЫЕ СКРИПТЫ ПОСЛЕ ПОДГРУЗКИ ВСЕХ МОДУЛЕЙ */
  mounted(){
    if(localStorage?.locateList){
      this.locateList = JSON.parse(localStorage?.locateList);
    }; // Подгружаем избранные локации из кэша
    if(localStorage?.currentId){
      this.currentIdItem = Number(localStorage?.currentId);
    }; // Подгружаем активный ID элемента из кэша

    navigator.geolocation.getCurrentPosition(this.scenarioAllowedLocate,
                                            this.scenarioUnAllowedLocate,
                                            {enableHighAccuracy: true}); // Запрашиваем доступ к локации юзера

    if(this.locateList.length === 0){
      setTimeout(() => {
        if(this.showModalInputLocate.timeoutMounted && this.locateList.length === 0){
          this.showModalInputLocate.showModal = true;
        }
      }, 5000);
    }; // Если юзер не предоставил доступ к локации и не заблокировал его (просто закрыл браузерную модалку запроса), то спустя 5s. выводим модалку с сообщением, что мы не смогли определить локацию юзера и предлагаем самостоятельно ввести город
  }
/* =================================================================== */
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

  .ww-settings {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding-bottom: 28px;
    margin-top: 18px;
    .ww-locate_list__error{
      position: absolute;
      font-size: .8em;
      color:white;
      background: rgba(178, 34, 34, .65);
      border: 2px solid rgb(178, 34, 34);
      border-radius: 2px;
      font-weight: 600;
      padding: 5px;
      width: 100%;
      text-align: center;
      top: -30px
    }
    .ww-locate-items__contain {
      width: 100%;
      flex-grow: 1;
      overflow-y: auto;
      > *:not(:last-child){
        margin-bottom: 8px;
      }
      .ww-locate__list-item, .ww-locate__list-item-title{
        display: flex;
        align-items: center;
      }
      .ww-locate__list-item-title{
        overflow: hidden;
        margin-right: 5px;
        flex-grow: 1;
      }
      .ww-locate__list-item {
        width: 100%;
        justify-content: space-between;
        background: rgb(237, 235, 233);
        padding: 5px 10px;
        border: 2px;
        &.ww-active__item{
          border: 1px solid lightseagreen;
        }
        .ww-item__icon {
          line-height: 0;
          cursor: grab;
          transition: transform .07s ease-in;
          svg{
            height: 100%;
            width: 21px;
          }
          &:hover{
            opacity: .8;
          }
          &.ww-locate-delete__item{
            cursor: pointer;
            &:hover{
              transform: scale(.9);
            }
            &:active{
              opacity: 1;
              transform: scale(.6);
            }
          }
        }
        .ww-locate-info__item {
          font-size: .9em;
          margin-left: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-grow: 1;
          cursor: pointer;
        }
      }
    }
    .ww-settings__input {
      .ww-settings-input__description {
        font-weight: 600;
        font-size: .8em;
      }
    }

  }


</style>