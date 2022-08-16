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
/* Импортируем модули */
import { defineComponent, PropType, ref } from 'vue';
import axios from 'axios';

/* Импортируем type-файлы .TS */
import GetApiJson from '../types/GetApiJson';

/* Импортируем компоненты .VUE */
import MyInput from './UI/MyInput.vue';
import MyEnterButton from './UI/MyEnterButton.vue';

export default defineComponent({
    components: { MyInput, MyEnterButton },
    emits: ['submitInput'],
    props: {
        appIdOWM:{
            type: String as PropType<string>,
            required: true
        } // API-токен OWM
    },
    setup(props, {emit}) {
        const inputValue = ref<string>(""); // Переменная, хранящая значение инпута
        const unValid = ref<boolean>(false); // Отвечает за UI отображение ошибки при вводе

        const getWeatherAPI = async (citySearch: string):Promise<GetApiJson | boolean> => {
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
        }; // Выполняем API запрос и создаём избранный элемент, либо возвращаем ошибку

        const submitInput = async ():Promise<void> => {
            if(inputValue.value.length > 1){
                const response = await getWeatherAPI(inputValue.value);
                if(response){
                    emit('submitInput', response);
                    inputValue.value = '';
                    return;
                }
            }
            unValid.value = true;
            return;
        }; // Функция, которая обрабатывает событие submit

        return { inputValue, submitInput, unValid };
    }
})
</script>