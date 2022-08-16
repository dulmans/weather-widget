<template>
    <div class="ww-modal__switch_item" v-if="displayTypes === 'switch-item'">
        <h2>
            Switch location from <span class="ww-answer__no">{{cityInfoObj?.current}}</span>
            to <span class="ww-answer__yes">{{cityInfoObj?.switchTo}}</span>?
        </h2>

        <my-button
        class="ww-btn-no"
        @click="$emit('clickNo')"
        >No, let it be <span class="ww-strong">{{cityInfoObj?.current}}</span></my-button>

        <my-button
        class="ww-btn-yes"
        @click="$emit('clickYes')"
        >Yes, switch to <span class="ww-strong">{{cityInfoObj?.switchTo}}</span></my-button>
    </div>

    <div class="ww-modal__switch_locate" v-else-if="displayTypes === 'switch-locate'">
        <h2>
            Set the weather of the current location: <span class="ww-answer__yes">{{cityInfoObj?.switchTo}}</span> ?
        </h2>

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
/* Импортируем модули */
import { defineComponent, PropType } from 'vue';

/* Импортируем type-файлы .TS */
import SwitchItemProp from '../types/SwitchItemProp';
import DisplayType from '../types/DisplayType';

/* Импортируем компоненты .VUE */
import MyButton from './UI/MyButton.vue';

export default defineComponent({
    components: { MyButton },
    props: {
        cityInfoObj:{
            type: Object as PropType<SwitchItemProp>,
            require: true
        }, // Объект, который содержит информацию о текущей локации и возможной локации юзера
        displayTypes: {
            type: String as PropType<DisplayType>,
            require: true
        } // Пропс, который содержит текущий активный display
    }
})
</script>