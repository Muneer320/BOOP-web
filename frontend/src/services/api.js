import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiService = {
  checkStatus: () => axios.get(`${API_BASE_URL}/`),

  getSettings: () => axios.get(`${API_BASE_URL}/settings`),

  getTemplates: () => axios.get(`${API_BASE_URL}/templates`),

  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  getFile: (fileId) =>
    api.get(`/files/${fileId}`, {
      responseType: "blob",
    }),
  deleteFile: (fileId) => api.delete(`/files/${fileId}`),

  getTopics: () => api.get("/topics"),
  getTopicWords: (topic) => api.get(`/topics/${topic}/words`),

  generatePuzzle: (data) =>
    api.post("/generate-puzzle", data, {
      responseType: "blob",
      headers: {
        Accept: "application/octet-stream",
      },
    }),
};
