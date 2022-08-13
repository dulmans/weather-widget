<template>
    <div class="ww-modal">
        <div class="ww-modal__content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'my-modal',
    setup () {


        return {}
    }
})
</script>

<style scoped>

</style>