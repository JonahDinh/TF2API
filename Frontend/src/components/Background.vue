<!-- Add these styles to your global styles (e.g., in your main.css or styles.css) -->
<style>
html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Optional: Prevent vertical scrollbar */
}
</style>

<!-- eslint-disable -->
<template>
  <div class="background-page" :style="{backgroundImage: 'url(' + imageUrl + ')',
                                        position: 'relative', display: 'flex', flexDirection: 'column',
                                        backgroundSize: 'cover', width: '100%', height: '100%'}">
    <b-container fluid class="h-100">
      <slot></slot>
    </b-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'BackgroundPage',
  props: {
    imageUrl: {
      type: String as PropType<string>,
      required: true,
    },
  },
});
</script>
