<template>
  <b-container class="business-card">
    <b-row align-v="center" align-h="center">
      <b-col sm="8" md="4">
        <FlipCard>
          <b-card
            class="card"
            slot="front"
            img-src="https://picsum.photos/600/300/?image=25"
            img-alt="Test Cactus"
            no-body>
            <Wave class="wave" />
            <b-card-body>
              <b-card-title>Chase Ingebritson</b-card-title>
              <b-card-sub-title>Software Engineer</b-card-sub-title>
              <b-card-text class="socials">
                <p><b-icon-twitter variant="primary" /> @GOmonkeymanGO</p>
                <p><b-icon-geo-alt variant="primary" /> Minneapolis, MN</p>
                <p><b-icon-envelope variant="primary" /> chase@inge.me</p>
              </b-card-text>
            </b-card-body>
          </b-card>

          <b-card
            slot="back"
            title="Test Back"
            bg-variant="primary"
            text-variant="white"
            no-body>
            <div class="qr-container">
              <div class="qr-sub-container">
                <b-img :src="qr" class="code" />
              </div>
            </div>
            <b-card-body>
              <b-card-text class="socials">
                <p><b-icon-twitter /> @GOmonkeymanGO</p>
                <p><b-icon-geo-alt /> Minneapolis, MN</p>
                <p><b-icon-envelope /> chase@inge.me</p>
              </b-card-text>
            </b-card-body>
          </b-card>
        </FlipCard>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import QRCode from 'qrcode'
import FlipCard from '@/components/FlipCard.vue'
import Wave from '@/components/Wave.vue'

@Component({
  components: {
    FlipCard,
    Wave
  }
})
export default class BusinessCard extends Vue {
  private publicPath: string = process.env.BASE_URL || ''
  private qr = ''

  async created () {
    const qr = await this.generateQR(this.publicPath)
    if (qr) this.qr = qr
  }

  async generateQR (text: string) {
    try {
      return await QRCode.toDataURL(text, {
        color: {
          dark: '#007bff',
          light: '#ffffff'
        },
        margin: 2,
        scale: 10
      })
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style scoped lang="scss">
  .business-card {
    background-color: #f9f9f9;
  }
  .card-subtitle {
    margin-bottom: 0.75rem;
  }

  .business-card {
    height: 100vh;

    & > .row {
      height: 100%;
    }
  }

  .wave {
    margin-top: -65px;
    margin-bottom: 0;
  }

  .socials {
    p {
      margin-bottom: 0.5rem;
    }
  }

  .qr-container {
    width: 100%;
    padding: 10% 10% 0 10%;

    .qr-sub-container {
      padding: 25px;
      background-color: white;
      border-radius: 5px;
    }

    .code {
      width: 100%;
    }
  }
</style>
