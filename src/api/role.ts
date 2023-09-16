import { http } from "@/utils/http";

export default {
  get() {
    return http.request("get", "role");
  },
  post(data) {
    return http.request("post", "/role", { data });
  },
  delete(id) {
    return http.request("delete", "/role/" + id);
  },
  put(id, data) {
    return http.request("put", "/role/" + id, { data });
  }
};
