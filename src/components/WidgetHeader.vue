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
/* Импортируем модули */
import { defineComponent, PropType } from 'vue';

/* Импортируем type-файлы .TS */
import CurrentCityCountry from '../types/CurrentCityCountry';
import DisplayType from '../types/DisplayType';

/* Импортируем компоненты .VUE */
import MySettingIcon from './UI/icons/MySettingIcon.vue';
import MyCloseIcon from './UI/icons/MyCloseIcon.vue';

export default defineComponent({
    components: { MySettingIcon, MyCloseIcon },
    props: {
        currentLocate:{
            type: Object as PropType<CurrentCityCountry>,
            required: true
        }, // Объект, который содержит: название города и название страны
        displayTypes: {
            type: String as PropType<DisplayType>,
            required: true
        } // Пропс, который содержит текущий активный display
    }
})
</script>