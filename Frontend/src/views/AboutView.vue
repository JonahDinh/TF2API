<!-- eslint-disable max-len -->
<template>
  <b-container class="my-4 pb-5">
    <!-- User Profile Section -->
    <b-row v-if="isLoggedIn" class="shadow-sm bg-white rounded p-3">
      <b-col cols="4">
        <b-img :src="userInfo.avatarURL" alt="User Avatar" class="img-fluid rounded"></b-img>
      </b-col>
      <b-col cols="8">
        <h2>User Profile</h2>
        <p><strong>ID:</strong> {{ userInfo.steamID }}</p>
        <p><strong>Username:</strong> {{ userInfo.username }}</p>
      </b-col>
    </b-row>
    <b-alert v-else show variant="info">User is not logged in.</b-alert>
    <!-- Game Information Section -->
    <b-row class="mt-4">
      <b-col>
        <div id="tf2-info">
          <!-- Weapons Card -->
          <b-card class="mb-3">
            <b-card-header>Weapons</b-card-header>
            <b-card-body>
              <p>In Team Fortress 2, weapons are class-specific and tailored to the roles and abilities of each class. They range from combat weapons like shotguns and rifles to utility items like healing guns and sappers, with different weapons unlocking various play styles and strategies.</p>
            </b-card-body>
          </b-card>

          <!-- Classes Card -->
          <b-card class="mb-3">
            <b-card-header>Classes</b-card-header>
            <b-card-body>
              <p>TF2 features nine unique classes, each with distinct abilities. They are categorized into Offensive (Scout, Soldier, Pyro), Defensive (Demoman, Heavy, Engineer), and Support (Medic, Sniper, Spy) groups. Each class has a crucial role and contributes differently to the team.</p>
            </b-card-body>
          </b-card>

          <!-- Maps Card -->
          <b-card class="mb-3">
            <b-card-header>Maps</b-card-header>
            <b-card-body>
              <p>Maps in TF2 are designed for specific game modes such as Capture the Flag, Control Point, and Payload. Each map has a unique layout, impacting gameplay and strategy, with objectives varying based on the game mode.</p>
            </b-card-body>
          </b-card>
        </div>
      </b-col>
      <b-col cols="4">
        <b-img :src="imagePath" alt="Team Fortress 2 Image" class="img-fluid rounded shadow-sm h-100"></b-img>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      imagePath: '/images/tf2poster.jpg',
      userInfo: {
        steamID: null,
        username: null,
        avatarURL: null,
      },
    };
  },
  computed: {
    isLoggedIn() {
      if (localStorage.getItem('steamID') != null) {
        return true;
      }
      return false;
    },
  },
  methods: {
    fetchUserInfo() {
      // Assuming you're storing user info in localStorage when they log in
      this.userInfo.steamID = localStorage.getItem('steamID');
      this.userInfo.username = localStorage.getItem('username');
      this.userInfo.avatarURL = localStorage.getItem('avatarURL');
    },
  },
  created() {
    this.fetchUserInfo();
  },
};
</script>
