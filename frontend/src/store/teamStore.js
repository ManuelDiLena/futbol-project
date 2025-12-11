import { create } from 'zustand';
import apiClient from '../api/apiClient';

const useTeamStore = create((set) => ({
  myTeam: null,
  isLoading: false,
  messages: [],

  // Get user's team info
  fetchMyTeam: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get('/api/teams/me');
      set({ myTeam: data, isLoading: false });
      return data;
    } catch (err) {
      console.error('Error fetch:', err.response?.data);
      set({ myTeam: null, isLoading: false });
      return null;
    }
  },

  // Create a new team
  createTeam: async (teamData) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post('/api/teams', teamData);
      set({ myTeam: data.team, isLoading: false });
      return { success: true, updatedUserRole: data.updatedUserRole };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.response?.data?.message };
    }
  },

  // Load team messages
  loadMessages: async (teamId) => {
    try {
      const { data } = await apiClient.get(`/api/teams/${teamId}/messages`);
      set({ messages: data });
    } catch (err) {
      console.error('Error loading messages:', err.response?.data);
    }
  },

  // Add a new message to the store
  addMessage: (msg) => {
    set((state) => ({ messages: [...state.messages, msg] }));
  }
}));

export default useTeamStore;