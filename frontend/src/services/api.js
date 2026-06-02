import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiService = {
  checkStatus: () => api.get("/"),

  getSettings: () => api.get("/settings"),

  getTemplates: () => api.get("/templates"),

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

  playGenerate: (words, gridSize = 15, allowBackwards = true) =>
    api.post("/play/generate", {
      words,
      grid_size: gridSize,
      allow_backwards: allowBackwards,
    }),
};

export { apiService };
