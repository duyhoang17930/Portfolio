import { useState, useEffect } from 'react';
import api from '../lib/api';
import type { GuestbookMessage } from '../types';

export function useGuestbook() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/api/guestbook');
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (message: string) => {
    const { data } = await api.post('/api/guestbook', { message });
    setMessages((prev) => [data, ...prev]);
    return data;
  };

  const deleteMessage = async (id: number) => {
    await api.delete(`/api/guestbook/${id}`);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return { messages, loading, addMessage, deleteMessage, refetch: fetchMessages };
}
