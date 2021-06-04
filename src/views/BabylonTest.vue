<template>
  <div class="babylon-test">
    <Viewer class="viewer" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Viewer from '@/components/Viewer.vue'

@Component({
  components: {
    Viewer
  }
})
export default class BabylonTest extends Vue {
}
</script>

<style scoped lang="scss">
.viewer {
  width: 100vw;
  height: 100vh;
}
</style>
