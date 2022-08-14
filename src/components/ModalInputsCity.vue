<template>
    <div class="ww-modal__inputs-city">
        <div class="ww-modal__inputs-city_text">We were unable to determine your location. &#128532;<br>Enter the name of your city.</div>
        <input-locate-save
        :appIdOWM="appID"
        @submitInput="$emit('submitInput', $event)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

import InputLocateSave from './InputLocateSave.vue';

export default defineComponent({
    components: { InputLocateSave },
    props:{
        appID: {
            type: String as PropType<string>,
            required: true
        },
    },
    setup () {

        return {}
    }
})
</script>