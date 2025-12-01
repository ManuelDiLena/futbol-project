import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../api/apiClient';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      profileComplete: false,
      loadingAuth: true,

      // Register user
      register: async (name, email, password, role) => {
        try {
          const { data } = await apiClient.post('/api/auth/register', { name, email, password, role });
          set({
            token: data.token,
            user: {
              _id: data._id,
              name: data.name,
              email: data.email,
              role: data.role,
              profileId: data.profileId,
            },
            isAuthenticated: true,
            profileComplete: false
          });
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          return { success: true, role: data.role, profileComplete: false };
        } catch (err) {
          return { success: false, message: err.response?.data?.message || 'Registration error' };
        }
      },

      // Login user
      login: async (email, password) => {
        try {
          const { data } = await apiClient.post('/api/auth/login', { email, password });
          set({
            token: data.token,
            user: {
              _id: data._id,
              name: data.name,
              email: data.email,
              role: data.role,
              profileId: data.profileId,
            },
            isAuthenticated: true,
            profileComplete: data.profileComplete
          });
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          return { success: true, profileComplete: data.profileComplete };
        } catch (err) {
          return { success: false, message: err.response?.data?.message || 'Login error' };
        }
      },

      // Logout user
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          profileComplete: false
        });
        delete apiClient.defaults.headers.common['Authorization'];
      },

      // Update the post-onboarding status
      setProfileComplete: () => {
        set ({ profileComplete: true });
      },

      // Load user (If the token exists but the state was lost)
      loadUserFromToken: async () => {
        const token = get().token;
        if (!token) {
          set({ loadingAuth: false });
          return;
        }
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const { data } = await apiClient.get('/api/auth/me');
          set({
            user: data.user,
            isAuthenticated: true,
            profileComplete: data.profileComplete,
            loadingAuth: false,
          });
        } catch (err) {
          console.error('Invalid token:', err?.response?.data);
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            profileComplete: false,
            loadingAuth: false,
          });
          delete apiClient.defaults.headers.common['Authorization'];
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist the token
      partialize: (state) => ({ token: state.token }),
    }
  )
);

// (Optional) Load the user from the token when the app starts
// useAuthStore.getState().loadUserFromToken();

export default useAuthStore;