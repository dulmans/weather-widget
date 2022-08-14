<template>
    <form class="ww-input__form" @submit.prevent="submitInput">
        <my-input
        v-model.trim="inputValue"
        :class="[{'ww-unvalid': unValid}]"
        @input="unValid = false"
        />
        <my-enter-button
        type="submit"
        />
        <span v-if="unValid" class="ww-error__text">Please enter a valid city name</span>
    </form>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import axios from 'axios';

import GetApiJson from '../types/GetApiJson';

import MyInput from './UI/MyInput.vue';
import MyEnterButton from './UI/MyEnterButton.vue';

export default defineComponent({
    components: { MyInput, MyEnterButton },
    emits: ['submitInput'],
    props:{
        appIdOWM:{
            type: String as PropType<string>,
            required: true
        }
    },
    setup(props, {emit}) {
        const inputValue = ref<string>("");
        const unValid = ref<boolean>(false);

        const getWeatherAPI = async (citySearch:string):Promise<GetApiJson | boolean> => {
            let checkValid:boolean = true;
            const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?', {
                params: {
                    q: citySearch,
                    limit: 1,
                    appid: props.appIdOWM,
                    units: 'metric'
                }
            })
            .catch(() => {
                unValid.value = true;
                checkValid = false;
            });
            if(checkValid) return response?.data;
            return false;
        };

        const submitInput = async () => {
            if(inputValue.value.length > 1){
                const response = await getWeatherAPI(inputValue.value);
                if(response){
                    emit('submitInput', response);
                    inputValue.value = '';
                    return;
                }
            }
            unValid.value = true;
        };

        return { inputValue, submitInput, unValid };
    },
})
</script>