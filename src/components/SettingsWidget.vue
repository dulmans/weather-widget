<template>
    <div class="ww-settings">
        <span v-if="showError" class="ww-locate_list__error">You have already added this city</span>
        <draggable class="ww-locate-items__contain" tag="div">
            <locate-list-item
            v-for="(listItem, index) in listItems"
            :listItem="listItem"
            :index="index"
            :key="listItem.id"
            :class="[{'ww-active__item': listItem.id === currentItem}]"
            @switchItem="$emit('switchItem', $event)"
            @deleteItem="$emit('deleteItem', $event)"
            />
        </draggable>
        <div class="ww-settings__input">
            <span class="ww-settings-input__description">Add Location:</span>
            <input-locate-save
            :appIdOWM="appID"
            @submitInput="$emit('createItem', $event)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import draggable from "vuedraggable";


import LocateList from '../types/LocateList';

import InputLocateSave from './InputLocateSave.vue';
import LocateListItem from './LocateListItem.vue';

export default defineComponent({
    components:{InputLocateSave, LocateListItem, draggable},
    props:{
        listItems:{
            type: Array as PropType<LocateList[]>,
            required: false
        },
        currentItem:{
            type: Number as PropType<number>,
            required: false
        },
        appID:{
            type: String,
            required: false
        },
        showError:{
            type: Boolean as PropType<boolean>,
            required: false
        }
    },
    setup () {


        return {}
    }
})
</script>