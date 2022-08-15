<template>
    <div class="ww-locate__list-item">
        <div class="ww-locate__list-item-title">
            <div class="ww-drndrop__item ww-item__icon">
                <my-drgndrop-icon />
            </div>
            <div
            class="ww-locate-info__item"
            @click="$emit('switchItem', listItem.id)"
            >{{index}}{{listItem.locateInfo.city}}, {{listItem.locateInfo.country}}</div>
        </div>
        <div
        class="ww-locate-delete__item ww-item__icon"
        @click="$emit('deleteItem', listItem.id)"
        ><my-trashbox-icon /></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import LocateList from '../types/LocateList';

import MyTrashboxIcon from './UI/MyTrashboxIcon.vue';
import MyDrgndropIcon from './UI/MyDrgndropIcon.vue';


export default defineComponent({
    components:{MyTrashboxIcon, MyDrgndropIcon},
    props:{
        listItem:{
            type: Object as PropType<LocateList>,
            required: true
        },
        index:{
            type: Number,
        }
    },
    setup () {


        return {}
    }
})
</script>