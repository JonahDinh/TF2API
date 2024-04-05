<template>
  <b-button :variant="variant" @click="$emit('party')">
    <b-icon :icon="icon" :animation="animation"/>
    <slot>
    </slot>
  </b-button>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class IconButton extends Vue {
  @Prop() private readonly variant! : string;

  @Prop({ default: 'app' }) private readonly icon! : string;

  @Prop({ default: 'spin' }) private readonly animationStyle! : string;

  @Prop() private readonly animate! : boolean;

  get animation() : string {
    return this.animate ? this.animationStyle : '';
  }
}
</script>
