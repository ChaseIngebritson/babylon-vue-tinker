<template>
  <div ref="flipCard" class="flip-card" @click="flipCard()">
    <div ref="front" class="front" :class="[ flipped ? direction : '' ]">
      <slot name="front" />
    </div>
    <div ref="back" class="back" :class="[ flipped ? '' : direction ]">
      <slot name="back" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class FlipCard extends Vue {
  @Prop({ default: 'left' }) readonly direction!: string

  private flipped = false

  flipCard () {
    this.flipped = !this.flipped
  }
}
</script>

<style scoped lang="scss">
  .up { transform: rotateX(180deg) }
  .down { transform: rotateX(-180deg) }
  .left { transform: rotateY(-180deg) }
  .right { transform: rotateY(180deg) }

  .flip-card {
    position: relative;
  }

  .front, .back {
    transition: transform 1s;
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }

  .back {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
  }
</style>
