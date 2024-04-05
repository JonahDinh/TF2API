<template>
  <Background image-url="/images/tf2background.jpg">
    <div>
      <img
        alt="TF2 logo"
        src="/images/Team-Fortress-2-Logo-Transparent-File.png"
        style="max-width: 30%; height: auto; margin-bottom: 20px;">
      <div class>
        <h1>Learn About the Game</h1>
        <b-button to="/about" >
          <IconButton
            icon="info">
            Info
          </IconButton>
        </b-button>
      </div>
      <div>
        <h1>View the Classes</h1>
        <b-button to="/classes" >
          <IconButton
            icon="person">
            Clasees
          </IconButton>
        </b-button>
      </div>
      <div>
        <h1>Customize Weapons and Maps</h1>
        <b-button to="/weapons" >
          <IconButton
            icon="bullseye">
            Classes
          </IconButton>
        </b-button>
        <b-button to="/maps" >
          <IconButton
            icon="compass">
            Maps
          </IconButton>
        </b-button>
      </div>
    </div>
  </Background>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import IconButton from '@/components/IconButton.vue';
import Background from '@/components/Background.vue';

@Component({
  components: {
    Background,
    IconButton,
  },
})
export default class HomeView extends Vue {
  backgroundImageUrl = '/images/tf2background.jpg';
}
</script>
