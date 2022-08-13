<template>
    <div class="ww-header">
        <h2 :class="[{'ww-load': Boolean(currentLocate?.city === 'load')}, 'ww-header__title']">
            <span v-if="displayTypes === 'main'">{{currentLocate?.city}}, {{currentLocate?.country}}</span>
            <span v-if="displayTypes === 'setting'">Settings</span>
        </h2>
        <div class="ww-header__icons">
            <my-setting-icon v-if="displayTypes === 'main'"
                            class="icon-setting"
                            @click="$emit('update:displayTypes', 'setting')"
            />
            <my-close-icon v-else-if="displayTypes === 'setting'"
                            class="icon-close"
                            @click="$emit('update:displayTypes', 'main')"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

import CurrentCityCounty from '../types/CurrentCityCounty';
import DisplayType from '../types/DisplayType';

import MySettingIcon from './UI/MySettingIcon.vue';
import MyCloseIcon from './UI/MyCloseIcon.vue';

export default defineComponent({
    components: {
        MySettingIcon,
        MyCloseIcon
    },
    props:{
        currentLocate:{
            type: Object as PropType<CurrentCityCounty>
        },
        displayTypes: {
            type: String as PropType<DisplayType>
        }
    },

    setup () {
        return {}
    }
})
</script>