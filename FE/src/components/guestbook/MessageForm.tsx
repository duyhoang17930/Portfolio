import { useState } from 'react';
import type { User } from '../../types';

interface Props {
  onSubmit: (message: string) => Promise<void>;
  user: User;
}

export function MessageForm({ onSubmit }: Props) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(message);
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg p-4 bg-card">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Leave a message..."
        className="w-full border border-input rounded-md px-3 py-2 resize-none bg-background text-foreground"
        rows={3}
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={submitting || !message.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 hover:opacity-90 transition"
        >
          {submitting ? 'Posting...' : 'Post Message'}
        </button>
      </div>
    </form>
  );
}
