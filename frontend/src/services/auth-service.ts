import { indexedStorageDB } from "@/utils/local-forage";
import axios from "./axios";
const signup = (
  name: string,
  userName: string,
  email: string,
  password: string
) => {
  return axios
    .post("/auth/signup", {
      name,
      userName,
      email,
      password,
    })
    .then((response) => {
      return response.data;
    });
};

const updateMe = (name: string, bio: string) => {
  return axios
    .patch("/user/updateMe", {
      name,
      bio,
    })
    .then((response) => {
      return response.data;
    });
};
const login = (email: string, password: string) => {
  return axios
    .post("/auth/signin", {
      email,
      password,
    })
    .then((response) => {
      return response.data;
    });
};

const externalLogin = (token: string, method: string) => {
  return axios
    .post("/auth/externalLogin", {
      token,
      method,
    })
    .then((response) => {
      return response.data;
    });
};

const logout = () => {
  indexedStorageDB.clear();
};

const authService = {
  signup,
  login,
  externalLogin,
  logout,
  updateMe,
};

export default authService;
