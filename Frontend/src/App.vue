<template>
  <div id="app" class="app-container" style="height: 100%; overflow: scroll" >
    <b-nav pills align="start" class="fixed-top bg-dark p-2 pl-4">
      <b-button to="/" exact-active-class="active" variant="secondary"
                class="icon-button mr-2"> Home
        <b-icon icon="house" aria-hidden="true">Home</b-icon>
      </b-button>
      <b-button to="/about" exact-active-class="active"
                variant="secondary" class="icon-button mr-2">
        <b-icon icon="info" aria-hidden="true">About</b-icon> Information
      </b-button>
      <b-button to="/login" exact-active-class="active"
                variant="secondary" class="icon-button mr-2">
        <b-icon icon="emoji-sunglasses" aria-hidden="true"></b-icon> Login
      </b-button>
      <b-button @click="logoutAndRefresh" variant="secondary" class="icon-button mr-2">
        <b-icon icon="arrow-return-left" aria-hidden="true"></b-icon> Logout
      </b-button>
    </b-nav>

    <div style="height: 100%; padding-top: 50px; padding-bottom: 1em">
      <router-view/>
    </div>

    <b-nav pills align="center" class="fixed-bottom bg-dark p-2">
      <b-button to="/weapons" variant="secondary" class="icon-button mr-2">
        <b-icon icon="bullseye" aria-hidden="true"></b-icon>
        Weapons
      </b-button>
      <b-button to="/classes" variant="secondary" class="icon-button mr-2">
        <b-icon icon="person" aria-hidden="true"></b-icon>
        Classes
      </b-button>
      <b-button to="/maps" variant="secondary" class="icon-button">
        <b-icon icon="compass" aria-hidden="true"></b-icon>
        Maps
      </b-button>

    </b-nav>
  </div>
</template>

<script>
export default {
  created() {
    // Check if the URL contains an authorization code
    const authorizationCode = this.$route.query.code;

    if (authorizationCode) {
      // Handle the authorization code and perform token exchange
      this.handleSteamOAuth(authorizationCode);
    }
  },
  methods: {
    logoutAndRefresh() {
      localStorage.removeItem('id');
      localStorage.removeItem('steamID');
      localStorage.removeItem('username');
      localStorage.removeItem('avatarURL');
      this.$router.push('/login');
    },
  },
};
</script>
