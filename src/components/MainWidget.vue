<template>
    <div class="ww-main">
        <div class="ww-temp__section"></div>
        <div class="ww-description__section"></div>
        <div class="ww-more_info__section"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import CurrentWeatherObject from '../types/CurrentWeatherObject' // Тип объекта currentWeather


export default defineComponent({
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

<style scoped>

</style>