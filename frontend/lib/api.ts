import axios from "axios";

// Axios instance met basis URL configuratie
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Voeg interceptor toe om fouten beter te loggen
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // De server heeft geantwoord met een statuscode buiten het bereik van 2xx
      console.error("Server response error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // Het verzoek is gedaan maar er is geen antwoord ontvangen
      console.error("No response received:", error.request);
    } else {
      // Er is iets misgegaan bij het opzetten van het verzoek
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Type definities
export interface Child {
  id?: number;
  naam: string;
  geboortedatum: string;
  allergieen: string;
  voorkeurEten: string;
  startDatum: string;
  eindDatum: string;
  urenPerWeek: number;
  contactPersoon: string;
}

export interface Parent {
  id?: number;
  naam: string;
  geboortedatum: string;
  telefoonnummer: string;
  email: string;
}

// API functies voor kinderen
export const childrenApi = {
  getAll: async () => {
    const response = await api.get<Child[]>("/children");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Child>(`/children/${id}`);
    return response.data;
  },

  create: async (child: Child) => {
    const response = await api.post<Child>("/children", child);
    return response.data;
  },

  update: async (id: number, child: Child) => {
    const response = await api.put<Child>(`/children/${id}`, child);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/children/${id}`);
    return id;
  },
};

// API functies voor ouders
export const parentsApi = {
  getAll: async () => {
    const response = await api.get<Parent[]>("/parents");
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Parent>(`/parents/${id}`);
    return response.data;
  },

  create: async (parent: Parent) => {
    const response = await api.post<Parent>("/parents", parent);
    return response.data;
  },

  update: async (id: number, parent: Parent) => {
    const response = await api.put<Parent>(`/parents/${id}`, parent);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/parents/${id}`);
    return id;
  },
};

export default api;
