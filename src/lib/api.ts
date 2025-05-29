import { getSession } from 'next-auth/react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  try {
    const session = await getSession()
    if (session?.user?.email) {
      // For now, we'll use the user email as identification
      // In production, you'd want to implement proper JWT token exchange
      headers['X-User-Email'] = session.user.email
    }
  } catch (error) {
    console.warn('Failed to get session for API call:', error)
  }

  return headers
}

export async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {},
  retries = 3
): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders()
    const url = `${API_BASE_URL}${endpoint}`
    
    console.log('API Call:', { url, headers })
    
    // Create an AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status >= 500 && retries > 0) {
        console.log(`Server error (${response.status}), retrying... (${retries} attempts left)`)
        await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
        return apiCall<T>(endpoint, options, retries - 1)
      }
      
      const errorData = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }    const data = await response.json()
    
    console.log('API Response:', { status: response.status, data })
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `API request failed with status ${response.status}`,
      }
    }

    // Return the response in the expected ApiResponse format
    return {
      success: data.success || true,
      data: data.data || data,
      error: data.error
    }
  } catch (error) {
    console.error('API call failed:', error)
    
    // Handle specific error types
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Cannot connect to server. Please check if the backend is running.',
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

export const api = {
  get: <T = any>(endpoint: string) => apiCall<T>(endpoint),
  post: <T = any>(endpoint: string, data: any) => 
    apiCall<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T = any>(endpoint: string, data: any) => 
    apiCall<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T = any>(endpoint: string) => 
    apiCall<T>(endpoint, { method: 'DELETE' }),
}
