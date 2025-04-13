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
export interface Parent {
  id?: number;
  naam: string;
  geboortedatum: string;
  telefoonnummer: string;
  email: string;
}

export interface Child {
  id?: number;
  naam: string;
  geboortedatum: string;
  allergies?: string | null;
  dietaryPreferences?: string | null;
  notes?: string | null;
  active: boolean;
  parent: Parent | { id: number };
}

export interface Attendance {
  id?: number;
  checkInTime: string;
  checkOutTime: string;
  child: Child | { id: number };
}

export interface Invoice {
  id?: number;
  amount: string;
  paid: boolean;
  invoiceDate: string;
  parent: Parent | { id: number };
  hoursPerWeek?: number;
}

// Validatiefunctie voor kind
export const validateChild = (child: Child): string[] => {
  const errors: string[] = [];

  // Validatie volgens API documentatie
  if (!child.naam) errors.push("Naam is verplicht");
  if (!child.geboortedatum) errors.push("Geboortedatum is verplicht");
  if (!child.parent || (typeof child.parent === "object" && !child.parent.id)) {
    errors.push("Ouder is verplicht");
  }

  return errors;
};

// API functies voor kinderen
export const childrenApi = {
  // GET /api/children - Alle kinderen ophalen
  getAll: async () => {
    try {
      const response = await api.get<Child[]>("/children");
      return response.data;
    } catch (error) {
      console.error("Error fetching all children:", error);
      throw error;
    }
  },

  // GET /api/children/{id} - Kind ophalen op ID
  getById: async (id: number) => {
    try {
      console.log(`Fetching child with ID: ${id}`);

      // Controleer of id een geldig nummer is
      if (isNaN(id) || id <= 0) {
        console.error(`Invalid child ID: ${id}`);
        throw new Error(`Invalid child ID: ${id}`);
      }

      // Gebruik fetch in plaats van axios voor meer controle
      const response = await fetch(`/api/children/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log(`Response status for child ${id}:`, response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response for child ${id}:`, errorText);
        throw new Error(
          `Failed to fetch child: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`Successfully fetched child ${id}:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching child with ID ${id}:`, error);
      throw error;
    }
  },

  // GET /api/children/parent/{parentId} - Kinderen van een ouder ophalen
  getByParent: async (parentId: number) => {
    try {
      const response = await api.get<Child[]>(`/children/parent/${parentId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching children for parent ID ${parentId}:`,
        error
      );
      throw error;
    }
  },

  // POST /api/children - Kind aanmaken
  create: async (child: Child) => {
    try {
      // Bereid de data voor volgens API documentatie
      const createData = {
        naam: child.naam,
        geboortedatum: child.geboortedatum,
        allergies: child.allergies ?? null,
        dietaryPreferences: child.dietaryPreferences ?? null,
        notes: child.notes ?? null,
        active: child.active ?? true,
        parent: {
          id: typeof child.parent === "object" ? child.parent.id : child.parent,
        },
      };

      console.log("Creating child with data:", createData);
      const response = await api.post<Child>("/children", createData);
      return response.data;
    } catch (error) {
      console.error("Error creating child:", error);
      throw error;
    }
  },

  // PUT /api/children/{id} - Kind bijwerken
  update: async (id: number, child: Child) => {
    try {
      // Bereid de data voor volgens API documentatie
      const updateData = {
        id: id, // Expliciet de ID meegeven
        naam: child.naam,
        geboortedatum: child.geboortedatum,
        allergies: child.allergies ?? null,
        dietaryPreferences: child.dietaryPreferences ?? null,
        notes: child.notes ?? null,
        active: child.active ?? true,
        parent: {
          id: typeof child.parent === "object" ? child.parent.id : child.parent,
        },
      };

      console.log("Updating child with ID:", id, "and data:", updateData);
      const response = await api.put<Child>(`/children/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating child with ID ${id}:`, error);
      throw error;
    }
  },

  // DELETE /api/children/{id} - Kind verwijderen
  delete: async (id: number) => {
    try {
      await api.delete(`/children/${id}`);
      return id;
    } catch (error) {
      console.error(`Error deleting child with ID ${id}:`, error);
      throw error;
    }
  },
};

// API functies voor ouders
export const parentsApi = {
  getAll: async () => {
    try {
      const response = await api.get<Parent[]>("/parents");
      return response.data;
    } catch (error) {
      console.error("Error fetching all parents:", error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.get<Parent>(`/parents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching parent with ID ${id}:`, error);
      throw error;
    }
  },

  create: async (parent: Parent) => {
    try {
      const response = await api.post<Parent>("/parents", parent);
      return response.data;
    } catch (error) {
      console.error("Error creating parent:", error);
      throw error;
    }
  },

  update: async (id: number, parent: Parent) => {
    try {
      const response = await api.put<Parent>(`/parents/${id}`, parent);
      return response.data;
    } catch (error) {
      console.error(`Error updating parent with ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      await api.delete(`/parents/${id}`);
      return id;
    } catch (error) {
      console.error(`Error deleting parent with ID ${id}:`, error);
      throw error;
    }
  },
};

// API functies voor aanwezigheid
export const attendanceApi = {
  getAll: async () => {
    try {
      const response = await api.get<Attendance[]>("/attendances");
      return response.data;
    } catch (error) {
      console.error("Error fetching all attendances:", error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.get<Attendance>(`/attendances/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance with ID ${id}:`, error);
      throw error;
    }
  },

  getByChildId: async (childId: number) => {
    try {
      const response = await api.get<Attendance[]>(
        `/attendances/child/${childId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching attendances for child ID ${childId}:`,
        error
      );
      throw error;
    }
  },

  create: async (attendance: Attendance) => {
    try {
      // Bereid de data voor
      const createData = {
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime || null,
        child:
          typeof attendance.child === "object"
            ? { id: attendance.child.id }
            : { id: attendance.child },
      };

      const response = await api.post<Attendance>("/attendances", createData);
      return response.data;
    } catch (error) {
      console.error("Error creating attendance:", error);
      throw error;
    }
  },

  update: async (id: number, attendance: Attendance) => {
    try {
      // Bereid de data voor
      const updateData = {
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime || null,
        child:
          typeof attendance.child === "object"
            ? { id: attendance.child.id }
            : { id: attendance.child },
      };

      const response = await api.put<Attendance>(
        `/attendances/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating attendance with ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      await api.delete(`/attendances/${id}`);
      return id;
    } catch (error) {
      console.error(`Error deleting attendance with ID ${id}:`, error);
      throw error;
    }
  },
};

// API functies voor facturen
export const invoiceApi = {
  getAll: async () => {
    try {
      const response = await api.get<Invoice[]>("/invoices");
      return response.data;
    } catch (error) {
      console.error("Error fetching all invoices:", error);
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      const response = await api.get<Invoice>(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice with ID ${id}:`, error);
      throw error;
    }
  },

  getByParentId: async (parentId: number) => {
    try {
      const response = await api.get<Invoice[]>(`/invoices/parent/${parentId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching invoices for parent ID ${parentId}:`,
        error
      );
      throw error;
    }
  },

  getUnpaidByParentId: async (parentId: number) => {
    try {
      const response = await api.get<Invoice[]>(
        `/invoices/parent/${parentId}/unpaid`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching unpaid invoices for parent ID ${parentId}:`,
        error
      );
      throw error;
    }
  },

  create: async (invoice: Invoice) => {
    try {
      // Bereid de data voor
      const createData = {
        amount: invoice.amount.toString(),
        paid: invoice.paid,
        invoiceDate: invoice.invoiceDate,
        parent:
          typeof invoice.parent === "object"
            ? { id: invoice.parent.id }
            : { id: invoice.parent },
      };

      const response = await api.post<Invoice>("/invoices", createData);
      return response.data;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  },

  update: async (id: number, invoice: Invoice) => {
    try {
      // Bereid de data voor
      const updateData = {
        amount: invoice.amount.toString(),
        paid: invoice.paid,
        invoiceDate: invoice.invoiceDate,
        parent:
          typeof invoice.parent === "object"
            ? { id: invoice.parent.id }
            : { id: invoice.parent },
      };

      const response = await api.put<Invoice>(`/invoices/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice with ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number) => {
    try {
      await api.delete(`/invoices/${id}`);
      return id;
    } catch (error) {
      console.error(`Error deleting invoice with ID ${id}:`, error);
      throw error;
    }
  },

  downloadPdf: async (id: number) => {
    try {
      console.log("Attempting to download invoice:", id);

      const response = await fetch(`/api/invoice-pdf/${id}`, {
        method: "GET",
        credentials: "include",
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`Error downloading invoice: ${response.statusText}`);
      }

      // PDF download logica
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `factuur_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error details:", error);
      throw error;
    }
  },
};

export default api;
