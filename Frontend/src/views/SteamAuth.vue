<template>
  <div>
    <button @click="signInWithSteam">Sign in with Steam</button>
  </div>
</template>

<script>
export default {
  methods: {
    signInWithSteam() {
      const steamAuthUrl = 'https://steamcommunity.com/openid/login?openid.ns=1.0&openid.mode=checkid_setup&openid.return_to=http://localhost:8080&openid.realm=http://localhost:8080&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.ns.sreg=http://openid.net/extensions/sreg/1.1&openid.sreg.required=steamid,contactemail&openid.ns.ext1=http://openid.net/srv/ax/1.0&openid.ext1.mode=fetch_request&openid.ext1.type.email=http://axschema.org/contact/email&openid.ext1.type.steamid=http://axschema.org/contact/steamid&key=A5C43134FAA40E4B2F301226D0E62065';
      window.location.href = steamAuthUrl;
    },
  },
};
</script>
