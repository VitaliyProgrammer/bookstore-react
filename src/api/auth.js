import { request } from "./http.js";
import { setToken } from "../auth/session.js";

// AuthenticationController: POST /auth/login і POST /auth/registration.
export async function login(email, password) {
  const { token } = await request("/auth/login", { method: "POST", body: { email, password } });
  setToken(token);
  return token;
}

export const register = dto => request("/auth/registration", { method: "POST", body: dto });
