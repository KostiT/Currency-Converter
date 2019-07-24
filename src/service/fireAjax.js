import axios from "axios";
export default function fireAjax(method, api_url, data, headers) {
  if (method === "GET") {
    return axios.get(api_url, { headers });
  } else if (method === "POST") {
    return axios.post(api_url, data, { headers });
  }
}