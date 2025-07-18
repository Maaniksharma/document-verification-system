import axios from "axios";
import { message } from "antd";

export function handleAxiosError(e: unknown) {
  if (axios.isAxiosError(e) && e.response) {
    message.error(e.response.data.message);
    console.error("Login failed:", e.response.data.message);
    if (e.response.status === 401 && window.location.pathname != "/") {
      window.location.href = "/";
    }
  } else {
    message.error("Something went wrong");
  }
}
