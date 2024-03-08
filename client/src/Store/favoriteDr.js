import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  state: {
    favoriteDr: [],
    loader: true,
  },
  mutations: {
    setFavoriteDr(state, payload) {
      state.favoriteDr = payload;
    },
  },
  actions: {
    async getFavoriteDr({ commit, state }) {
      await axios
        .get("/students/favorites")
        .then((response) => {
          if (response.status === 200) {
            commit("setFavoriteDr", response.data.data);
            state.loader = false;
          }
        })
        .catch(() => {
          useToast().error("حدث خطأ أثناء تحميل المفضلة");
        });
    },
  },
  getters: {
    getFavoriteDr: (state) => state.favoriteDr,
  },
};
