<template>
  <b-container class="business-card">
    <b-row align-v="center" align-h="center">
      <b-col sm="8" md="6">
        <FlipCard>
          <b-card slot="front" title="Chase Ingebritson">
            <b-card-text>
              <p><b-icon-twitter /> GOmonkeymanGO</p>
              <p><b-icon-geo-alt /> Minneapolis, MN</p>
              <p><b-icon-envelope /> chase@inge.me</p>
            </b-card-text>
          </b-card>
          <b-card slot="back" title="Test Back">
            <b-card-text>
              <p><b-icon-twitter /> GOmonkeymanGO</p>
              <p><b-icon-geo-alt /> Minneapolis, MN</p>
              <p><b-icon-envelope /> chase@inge.me</p>
            </b-card-text>
          </b-card>
        </FlipCard>
        <!-- <b-card title="Chase Ingebritson">
          <b-card-text>
            <p><b-icon-twitter /> GOmonkeymanGO</p>
            <p><b-icon-geo-alt /> Minneapolis, MN</p>
            <p><b-icon-envelope /> chase@inge.me</p>
          </b-card-text>
        </b-card> -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import VueQrcode from 'vue-qrcode'
import FlipCard from '@/components/FlipCard.vue'

@Component({
  components: {
    FlipCard
  }
})
export default class BusinessCard extends Vue {
}
</script>

<style scoped lang="scss">
  .business-card {
    height: 100vh;

    & > .row {
      height: 100%;
    }
  }
</style>
