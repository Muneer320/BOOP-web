import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API service methods
export const apiService = {
  // Health check
  checkStatus: () => api.get("/status"),

  // Settings
  getSettings: () => api.get("/settings"),

  // Templates
  getTemplates: () => api.get("/templates"),
  getTemplate: (templateId) => api.get(`/templates/${templateId}`),

  // Files/Assets
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

  // Word Topics
  getTopics: () => api.get("/topics"),
  getTopicWords: (topic) => api.get(`/topics/${topic}/words`),

  // Generate Puzzle
  generatePuzzle: (data) =>
    api.post("/generate-puzzle", data, {
      responseType: "blob",
      headers: {
        Accept: "application/octet-stream",
      },
    }),
};
