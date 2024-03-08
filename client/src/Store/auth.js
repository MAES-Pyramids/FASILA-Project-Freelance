import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  namespaced: true,
  state: {
    accessToken: null,
    refreshToken: null,
    user: null,
  },
  getters: {
    authenticated(state) {
      return state.accessToken && state.refreshToken && state.user;
    },
    user(state) {
      return state.user;
    },
  },
  mutations: {
    SET_ACCESS_TOKEN(state, token) {
      state.accessToken = token;
    },
    SET_REFRESH_TOKEN(state, token) {
      state.refreshToken = token;
    },
    SET_USER(state, data) {
      state.user = data;
    },
  },
  actions: {
    async signIn({ dispatch }, credentials) {
      let response = await axios
        .post("/sessions", credentials)
        .then((result) => {
          if (result.status == 200) {
            if (result.data.role === "Student") {
              if (
                result.data.object.verified === true &&
                result.data.object.suspended.value === false
              ) {
                useToast().success("تم تسجيل الدخول بنجاح");
                window.location.href = "/";
                dispatch("attempt", result.data);
              }
            } else if (result.data.role === "Doctor") {
              useToast().success("تم تسجيل الدخول بنجاح");
              dispatch("attempt", result.data);
              window.location.href = "/Doctor";
            } else if (result.data.role === "Admin") {
              useToast().success("تم تسجيل الدخول بنجاح");
              window.location.href = "/Admin";
              dispatch("attempt", result.data);
            } else {
              return;
            }
          }
          return result;
        });

      return response;
    },
    async attempt({ commit, state }, token) {
      if (token) {
        commit("SET_ACCESS_TOKEN", token.accessToken);
        commit("SET_REFRESH_TOKEN", token.refreshToken);
      }
      if (!state.accessToken) {
        return;
      }

      try {
        let response = await axios.get("/sessions");
        commit("SET_USER", response.data);
      } catch (e) {
        commit("SET_ACCESS_TOKEN", null);
        commit("SET_REFRESH_TOKEN", null);
        commit("SET_USER", null);
      }
    },
    signOut({ commit }) {
      return axios
        .delete("/sessions")
        .then(() => {
          commit("SET_ACCESS_TOKEN", null);
          commit("SET_REFRESH_TOKEN", null);
          commit("SET_USER", null);
        })
        .then((result) => {
          return result;
        });
    },
  },
};
