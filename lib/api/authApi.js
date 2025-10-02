"use client";

import axios from "axios";
import { useAuthStore, getAuthStore } from "@/lib/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Create a base axios instance with auth handling
const axiosBaseQuery = async (args) => {
  try {
    const { url, method = 'GET', body, params } = args;
    const token = getAuthStore().token;
    
    const result = await axios({
      url: `${API_URL}${url}`,
      method,
      data: body,
      params,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      withCredentials: true
    });
    
    return { data: result.data };
  } catch (error) {
    // Handle 401 errors for token refresh
    if (error.response?.status === 401) {
      try {
        // Try to refresh the token
        const refreshResult = await axios.get(`${API_URL}/auth/refresh`, {
          withCredentials: true
        });
        
        if (refreshResult.data?.access_token) {
          // Store the new token
          const user = getAuthStore().user;
          useAuthStore.getState().setCredentials({
            token: refreshResult.data.access_token,
            user
          });
          
          // Retry the original request with the new token
          const retryResult = await axios({
            url: `${API_URL}${url}`,
            method,
            data: body,
            params,
            headers: {
              Authorization: `Bearer ${refreshResult.data.access_token}`,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            },
            withCredentials: true
          });
          
          return { data: retryResult.data };
        } else {
          // If refresh failed, logout
          useAuthStore.getState().logout();
          return { error: { status: 401, data: 'Unauthorized' } };
        }
      } catch (refreshError) {
        // If refresh failed, logout
        useAuthStore.getState().logout();
        return { error: { status: 401, data: 'Unauthorized' } };
      }
    }
    
    return { 
      error: {
        status: error.response?.status,
        data: error.response?.data || error.message
      }
    };
  }
};

// Create a simple API client with endpoints
export const authApi = {
  endpoints: (builder) => {
    return {
      // Define endpoints here
    };
  },
  injectEndpoints: ({ endpoints }) => {
    return {
      endpoints: (builder) => ({
        ...endpoints(builder)
      })
    };
  }
};

// Helper function to fetch data
export const fetchApiData = async (apiSlice, endpointName, ...args) => {
  try {
    const endpoint = apiSlice.endpoints[endpointName];
    if (!endpoint) {
      throw new Error(`Endpoint ${endpointName} not found`);
    }
    
    const query = endpoint.query(...args);
    const result = await axiosBaseQuery(query);
    
    if (result.error) {
      throw new Error(result.error.data || 'An error occurred');
    }
    
    return result.data;
  } catch (error) {
    console.error(`Error fetching ${endpointName}:`, error);
    throw error;
  }
};