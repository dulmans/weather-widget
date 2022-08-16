<template>
    <div class="ww-locate__list-item">

        <div class="ww-locate__list-item-title">
            <div class="ww-drndrop__item ww-item__icon">
                <my-drgndrop-icon />
            </div>

            <div
            class="ww-locate-info__item"
            @click="$emit('switchItem', listItem.id)"
            >{{listItem.locateInfo.city}}, {{listItem.locateInfo.country}}</div>
        </div>

        <div
        class="ww-locate-delete__item ww-item__icon"
        @click="$emit('deleteItem', listItem.id)"
        >
            <my-trashbox-icon />
        </div>

    </div>
</template>

<script lang="ts">
/* Импортируем модули */
import { defineComponent, PropType } from 'vue'

/* Импортируем type-файлы .TS */
import LocateList from '../types/LocateList';

/* Импортируем компоненты .VUE */
import MyTrashboxIcon from './UI/icons/MyTrashboxIcon.vue';
import MyDrgndropIcon from './UI/icons/MyDrgndropIcon.vue';


export default defineComponent({
    components:{MyTrashboxIcon, MyDrgndropIcon},
    props: {
        listItem:{
            type: Object as PropType<LocateList>,
            required: true
        } // Объект, содержащий информации об элементе избранной локации
    }
})
</script>