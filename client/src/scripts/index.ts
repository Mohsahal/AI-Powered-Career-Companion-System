// AI Chat Session for Mock Interview Feedback
import { API_BASE_URL } from '@/config/api';

class ChatSession {
  async sendMessage(prompt: string) {
    try {
      const token = localStorage.getItem('futurefind_token');
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI chat error response:', errorText);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      // Check if the response has the expected structure
      if (!data.success) {
        console.error('AI chat returned unsuccessful:', data);
        throw new Error(data.message || 'AI service returned an error');
      }
      
      if (!data.response) {
        console.error('No response field in data:', data);
        throw new Error('No response received from AI service');
      }
      
      return {
        response: {
          text: () => data.response
        }
      };
    } catch (error) {
      throw error;
      throw error;
    }
  }
}

export const chatSession = new ChatSession();
