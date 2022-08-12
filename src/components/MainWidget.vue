<template>
    <div class="ww-main">
        <div class="ww-temp__section">
            <div class="ww-sky__img"
                v-bind:style="{background: `url(http://openweathermap.org/img/wn/${current?.icon}@2x.png) center center/auto 100% no-repeat`}"
                ></div>
            <div class="ww-temp__text">{{Math.round(current?.temp ?? 0)}}°C</div>
        </div>
        <div class="ww-description__section">
            <span>Feels like {{Math.round(current?.feelsLike ??  0)}}°C. {{current?.description}}</span>
        </div>
        <div class="ww-more_info__section">
            <div class="ww-more_info__string">
                <div class="ww-more_info__item">
                    <my-navigate-icon class="ww-icons"
                    v-bind:style="{transform: `rotate(${(current?.wind?.deg ?? 0) + 180 + 314}deg)`}"/>
                    <span class="ww-main__text">{{current?.wind?.speed}}m/s {{current?.wind?.direction}}</span>
                </div>
                <div class="ww-more_info__item">
                    <my-pressure-icon class="ww-icons"/>
                    <span class="ww-main__text">{{current?.pressure}}hPa</span>
                </div>
            </div>

            <div class="ww-more_info__string">
                <div class="ww-more_info__item">
                    <span class="ww-main__text">Humidity: {{current?.humidity}}%</span>
                </div>
                <div class="ww-more_info__item">
                    <span class="ww-main__text">Visibility: {{((current?.visibility ?? 0) / 1000).toFixed(1)}}km</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import CurrentWeatherObject from '../types/CurrentWeatherObject';

import MyNavigateIcon from './UI/MyNavigateIcon.vue';
import MyPressureIcon from './UI/MyPressureIcon.vue';


export default defineComponent({
    components: { MyNavigateIcon, MyPressureIcon },
    props:{
        current:{
            type: Object as PropType<CurrentWeatherObject>,
            require: true
        }
    },
    setup () {

        return {}
    }
})
</script>