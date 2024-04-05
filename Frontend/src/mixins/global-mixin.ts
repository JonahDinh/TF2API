/* eslint-disable max-len */
/**
 * Mixins are a flexible way to distribute reusable functionalities for Vue components.
 * https://vuejs.org/v2/guide/mixins.html
 * The following mixin will only be imported to ALL components in this project (even the 3rd party components)
 * all the following methods and variables will be available to ALL components as this mixin will be imported in main.js
 */

// mixins.js
import { Component, Prop, Vue } from 'vue-property-decorator';

const BASE_API = 'http://localhost:3006';
const BASE_API2 = 'http://localhost:3004';
const STUDENT_API = `${BASE_API}/students`;
const PRODUCT_API = `${BASE_API}/products`;
const WEAPON_API = `${BASE_API2}/weapons`;
const MAP_API = `${BASE_API2}/maps`;
const CLASS_API = `${BASE_API2}/classes`;

const FETCH_HEADERS:any = {
  'X-Requested-With': 'XmlHttpRequest',
  'Content-Type': 'application/json; charset=utf-8',
};

@Component
export default class GlobalMixin extends Vue {
  @Prop(Boolean) readonly debug!:boolean

  @Prop(Boolean) readonly disabled!:boolean

  // immutable constant data variables
  BASE_API = BASE_API

  STUDENT_API = STUDENT_API

  PRODUCT_API = PRODUCT_API

  WEAPON_API = WEAPON_API

  MAP_API = MAP_API

  CLASS_API = CLASS_API

  // regular data variable
  isBusy = false

  // Declared as computed property getter
  get isDisabled():boolean {
    return this.isBusy || this.disabled;
  }

  mounted() { // when ANY component loads
    if (this.debug) {
      // output the props and data variables to the console
      console.log(this.$props);
      console.log(this.$data);
    }
  }

  // method to set the internal isBusy and emit to the parent component the busy state
  setBusy(state:boolean) {
    this.isBusy = state;
    this.$emit('busy', state);
  }

  created() {
    const globalStore = Vue.observable({
      steamID: null,
    });

    Vue.prototype.$globalStore = globalStore;
  }

  // function that will determine which request method and how to send the data to the api
  callAPI(url:string, method = 'get', dataToSend = {}) {
    const fetchOptions: any = {
      method: 'GET',
      credentials: 'include', // allows api to set cookies in the browser
      referrerPolicy: 'strict-origin-when-cross-origin',
      headers: { ...FETCH_HEADERS },
    };
    // ensure valid/allowed request methods
    // eslint-disable-next-line no-param-reassign
    method = method.toUpperCase();
    if (['POST', 'PUT', 'DELETE'].includes(method)) fetchOptions.method = method;
    // convert JS object to JSON string – GET request cannot have a body property so append it to the URL
    if (fetchOptions.method !== 'GET') fetchOptions.body = JSON.stringify(dataToSend);
    // eslint-disable-next-line no-param-reassign
    else if (Object.keys(dataToSend).length) url += `?${(new URLSearchParams(dataToSend)).toString()}`;

    // return a promise we can use .then, .catch and .finally in our component
    return fetch(url, fetchOptions)
      .then(async (res) => {
        const resInfo:any = { url: res.url, status: res.status, statusText: res.statusText };
        if (res.status === 204) return Promise.resolve(resInfo);
        if (res.ok) return res.json();

        const error = new Error(`${res.status}: ${res.statusText}`);
        resInfo.data = await res.json();
        throw Object.assign(error, resInfo);
      });
  }
}
