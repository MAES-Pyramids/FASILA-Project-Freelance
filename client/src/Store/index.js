import Vuex from "vuex";
import auth from "./auth";
import favoriteDr from "./favoriteDr";

export default new Vuex.Store({
  state: {
    token: "",
  },
  mutations: {},
  actions: {},
  modules: {
    auth,
    favoriteDr,
  },
});
