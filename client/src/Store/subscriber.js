import store from "@/Store";
import axios from "axios";
import Cookies from "js-cookie";

store.subscribe((mutation) => {
  switch (mutation.type) {
    case "auth/SET_ACCESS_TOKEN":
      if (mutation.payload) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${mutation.payload}`;
        Cookies.set("accessToken", mutation.payload);
      } else {
        axios.defaults.headers.common["Authorization"] = null;
        Cookies.remove("accessToken");
      }
      break;
    case "auth/SET_REFRESH_TOKEN":
      if (mutation.payload) {
        axios.defaults.headers.common["x-refresh"] = `${mutation.payload}`;
        Cookies.set("refreshToken", mutation.payload);
      } else {
        axios.defaults.headers.common["x-refresh"] = null;
        Cookies.remove("refreshToken");
      }
      break;
  }
});

// Set up axios interceptors to include tokens in every request
axios.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (refreshToken) {
    config.headers["x-refresh"] = `${refreshToken}`;
  }

  return config;
});

// Response interceptor to handle token updates
axios.interceptors.response.use((response) => {
  const accessToken = response.headers["x-access-token"];

  if (accessToken) {
    store.commit("auth/SET_ACCESS_TOKEN", accessToken);
  }

  return response;
});
