import { http } from "@/utils/http";

export default {
  get() {
    return http.request("get", "api");
  },
  post(data) {
    return http.request("post", "/api", { data });
  },
  delete(id) {
    return http.request("delete", "/api/" + id);
  },
  put(id, data) {
    return http.request("put", "/api/" + id, { data });
  }
};
