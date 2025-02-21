import { User, Vehicle, Color, Model } from '../types';

const API_BASE_URL = 'http://localhost:1880';

interface LoginResponse {
  token: string;
  user: User;
}

interface VehicleResponse {
  vehicles: Vehicle[];
  total: number;
}

interface VehicleListResponse {
  data: Vehicle[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    sortBy: string;
    sortOrder: string;
    search: string;
  };
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const checkIsRoot = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.isRoot) {
    throw new Error('Acesso não autorizado');
  }
};

export const api = {
  // Auth
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Credenciais inválidas");
      }
      throw new Error("Erro ao fazer login");
    }

    const data = await response.json();

    // Validate response data before storing
    if (!data.token || !data.user) {
      throw new Error("Resposta inválida do servidor");
    }

    // Store authentication data only if valid
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data; // Agora o backend já retorna token e user
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Vehicles
  getVehicles: async (
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    search?: string
  ): Promise<VehicleListResponse> => {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...(search && { search }),
    });

    const response = await fetch(`${API_BASE_URL}/vehicles?${queryParams}`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vehicles");
    }

    return response.json();
  },

  createVehicle: async (formData: FormData): Promise<Vehicle> => {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData, 
    });

    if (!response.ok) {
      throw new Error("Erro ao criar veículo");
    }

    return response.json();
  },

  updateVehicle: async (uuid: string, formData: FormData): Promise<Vehicle> => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${uuid}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to update vehicle');
    }

    return response.json();
  },

  deleteVehicle: async (uuid: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${uuid}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete vehicle");
    }
  },

  // Colors and Models (static data)
  getColors: async (): Promise<Color[]> => {
    const response = await fetch(`${API_BASE_URL}/colors`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch colors");
    }

    return response.json();
  },

  getModels: async (): Promise<Model[]> => {
    const response = await fetch(`${API_BASE_URL}/models`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch models");
    }

    return response.json();
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return response.json();
  },

  createUser: async (userData: {
    name: string;
    password: string;
    isRoot: boolean;
    isActived: boolean;
  }): Promise<User> => {
    checkIsRoot();
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return response.json();
  },

  updateUser: async (uuid: string, userData: Partial<User>): Promise<User> => {
    checkIsRoot();
    const response = await fetch(`${API_BASE_URL}/users/${uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  },
};