import { createApp } from "vue";
import App from "./App.vue";

// !Vue Router
import router from "./router";

// !Main CSS
import "./assets/css/main.css";

// !store
import index from "./Store/index";

// !Vuex
import Vuex from "vuex";

// !Subscribe
import "./Store/subscriber";

// !Axios
import axios from "axios";
// axios.defaults.baseURL = "https://fasila.onrender.com/api/v1";
// axios.defaults.baseURL = "http://188.166.44.65:3000/api/v1";
axios.defaults.baseURL = "https://maespyramids.chickenkiller.com/api/v1";

// ! JQuery, Bootstrap
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// !Animate CSS
import "animate.css/animate.min.css";

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

// !Cookies
import Cookies from "js-cookie";

// dispatch accessToken and refreshToken to store
index.dispatch("auth/attempt", {
  accessToken: Cookies.get("accessToken"),
  refreshToken: Cookies.get("refreshToken"),
}).then(() => {
  const app = createApp(App);
  app.use(router);
  app.use(index);
  app.use(Toast);
  app.use(Vuex);
  app.mount("#app");
});