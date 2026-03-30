import axios from "axios";

const API_BASE = "http://localhost:5000/api/route";

export async function optimizeAgentRoute(payload) {
  try {
    const { data } = await axios.post(`${API_BASE}/optimize`, payload);
    return data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Unable to optimize route",
      stops: [],
    };
  }
}