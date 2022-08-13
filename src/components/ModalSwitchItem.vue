<template>
    <div class="ww-modal__switch_item">
        <h2>Switch location from <span class="ww-answer__no">{{cityInfoObj?.current}}</span> to <span class="ww-answer__yes">{{cityInfoObj?.switchTo}}</span>?</h2>
        <my-button
        class="ww-btn-no"
        @click="$emit('clickNo')"
        >No, let it be <span class="ww-strong">{{cityInfoObj?.current}}</span></my-button>
        <my-button
        class="ww-btn-yes"
        @click="$emit('clickYes')"
        >Yes, switch to <span class="ww-strong">{{cityInfoObj?.switchTo}}</span></my-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import SwitchItemProp from '../types/SwitchItemProp';

import MyButton from './UI/MyButton.vue';

export default defineComponent({
    components: { MyButton },
    props:{
        cityInfoObj:{
            type: Object as PropType<SwitchItemProp>,
        }
    },
    setup () {


        return {}
    }
})
</script>