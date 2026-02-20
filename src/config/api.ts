// API Configuration - Easy to reuse in other projects
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  endpoints: {
    serverCheck: '/server/check',
  },
}

// Generic API client
export const apiClient = {
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  },

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  },
}

// Server health check - ensures backend is running
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    await apiClient.post(API_CONFIG.endpoints.serverCheck)
    return true
  } catch (error) {
    console.error('Server health check failed:', error)
    return false
  }
}
