<template>
    <div class="ww-header">
        <h2 class="ww-header__title">
            <span v-if="displayType === 'main'">{{currentLocate?.city}}, {{currentLocate?.country}}</span>
            <span v-if="displayType === 'setting'">Settings</span>
        </h2>
        <div class="ww-header__icons">
            <my-setting-icon v-if="displayType === 'main'"
                            class="icon-setting"
            />
            <my-close-icon v-else-if="displayType === 'setting'"
                            class="icon-close"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import CurrentLocate from '../types/CurrentLocate';
import DisplayType from '../types/DisplayTypeInHeader';
import MySettingIcon from './UI/MySettingIcon.vue';
import MyCloseIcon from './UI/MyCloseIcon.vue';

export default defineComponent({
    components: {
        MySettingIcon,
        MyCloseIcon
    },
    props:{
        currentLocate:{
            type: Object as PropType<CurrentLocate>,
        }
    },

    setup () {
        const displayType = ref<DisplayType>('main')

        return {displayType}
    }
})
</script>