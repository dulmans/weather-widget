<template>
    <div class="ww-settings">
        <span v-if="showError" class="ww-locate_list__error">You have already added this city</span>

            <draggable
            :list="listItems"
            :move="checkMove"
            class="ww-locate-items__contain"
            item-key="id"
            tag="div"
            ghost-class="ghost"
            @end="$emit('updateLists', currentList)"
            >
                <template #item="{ element }">
                    <locate-list-item
                    :listItem="element"
                    :class="[{'ww-active__item': element.id === currentItem}]"
                    @switchItem="$emit('switchItem', $event)"
                    @deleteItem="$emit('deleteItem', $event)"
                    />
                </template>
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
/* Импортируем модули */
import { defineComponent, PropType, ref } from 'vue';
import draggable from "vuedraggable";
/*
 */
/* Импортируем type-файлы .TS */
import LocateList from '../types/LocateList';

/* Импортируем компоненты .VUE */
import InputLocateSave from './InputLocateSave.vue';
import LocateListItem from './LocateListItem.vue';

export default defineComponent({
    components: { InputLocateSave, LocateListItem, draggable },
    props: {
        listItems:{
            type: Array as PropType<LocateList[]>,
            required: false
        }, // Массив, содержащий избранные локации
        currentItem:{
            type: Number as PropType<number>,
            required: false
        }, // ID активного элемента
        appID:{
            type: String as PropType<string>,
            required: false
        }, // API-токен OWM
        showError:{
            type: Boolean as PropType<boolean>,
            required: false
        } // Отвечает за скрытие/ отображения сообщения об ошибке
    },
    setup () {
        const currentList = ref<LocateList[]>([]); // Переменная, которая содержит временный массив обновлённых после Drag And Drop`а элементов

        const checkMove = (event: any):void => {
            currentList.value = event.relatedContext.list;
            return;
        }; // Функция, которая отвечает за обновление массива элементов при Drag And Drop`е

        return {checkMove, currentList}
    }
})
</script>