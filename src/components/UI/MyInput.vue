<template>
    <input
    type="text"
    class="ww-input"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'my-input',
    props: {
        modelValue: {
            type: String as PropType<string>,
            require: true
        }
    }
})
</script>