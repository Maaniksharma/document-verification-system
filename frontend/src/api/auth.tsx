import axiosInstance from "./axiosInstance";
import { message } from "antd";
import { handleAxiosError } from "./generic";

export interface Credentials {
  email: string;
  password: string;
  role: "reader" | "officer" | "admin";
}

export async function adminLogin(credentials: Credentials) {
  try {
    const response = await axiosInstance.post("/admin/login", credentials);
    message.success("login successful");
    return response.data;
  } catch (e: unknown) {
    handleAxiosError(e);
  }
}

export async function readerLogin(credentials: Credentials) {
  try {
    const response = await axiosInstance.post("/reader/login", credentials);
    message.success("login successful");
    return response.data;
  } catch (e: unknown) {
    handleAxiosError(e);
  }
}
