<template>
  <b-container class="mt-5">
    <b-row>
      <b-col cols="12" md="6" lg="4" class="mx-auto">
        <b-card title="Login" class="mb-3">
          <b-form @submit.prevent="handleLogin">

            <b-form-group label="Email:" label-for="email">
              <b-form-input type="email" id="email" v-model="email"
                            required placeholder="Enter email"></b-form-input>
            </b-form-group>

            <b-form-group label="Steam ID:" label-for="steamid">
              <b-form-input id="email" v-model="steamid"
                            required placeholder="Enter steam id"></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary">Login</b-button>

            <div class="mt-3">
              <p class="text-center">Not a member yet? <b-button
                variant="link" @click="redirectToSignup">Sign Up</b-button></p> </div>

          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import {
  BContainer, BRow, BCol, BCard, BForm, BFormGroup, BFormInput, BButton,
} from 'bootstrap-vue';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3004/user',
  headers: {
    Authorization: 'Bearer TrustMeImTheFrontEndBro',
    'Content-Type': 'application/json',
  },
});

@Component({
  components: {
    BContainer, BRow, BCol, BCard, BForm, BFormGroup, BFormInput, BButton,
  },
})
export default class LoginPage extends Vue {
  email = '';

  steamid = '';

  showPassword= false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  handleLogin() {
    api.get(`/${this.steamid}`)
      .then((response) => {
        // Check if the user exists in the response
        if (response.data) {
          // Extract user information from the response
          const {
            id, steamId, username, avatarUrl,
          } = response.data;

          localStorage.setItem('id', id);
          localStorage.setItem('steamID', steamId);
          localStorage.setItem('username', username);
          localStorage.setItem('avatarURL', avatarUrl);
          window.alert('Successfully Logged in!');
          window.location.href = 'http://localhost:8080/';
        } else {
          // Handle the case where the user does not exist
          window.alert('User not found, please login');
        }
      })
      .catch((error) => {
        // Handle errors, show error messages, etc.
        console.error('Error checking user:', error);
      });
  }

  redirectToSignup() {
    window.location.href = 'http://localhost:3004/auth/steam';
  }
}
</script>

<style scoped>

.text-center {
  text-align: center;
}
</style>
