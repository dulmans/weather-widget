<template>
  <div class="weather">
    {{vued}}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup(){
    const vued = ref('1')
    return {vued}
  }
});
</script>

<style lang="scss">
  .weather{
    width: 200px;
    height: 200px;
    background: red;
  }
</style>
