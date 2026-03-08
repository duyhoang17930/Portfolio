import type { GuestbookMessage } from '../../types';

interface Props {
  messages: GuestbookMessage[];
  currentUserId?: string;
  onDelete: (id: string) => void;
}

// Helper to get user info from message
function getUser(message: GuestbookMessage) {
  const userId = message.userId;
  if (typeof userId === 'object' && userId !== null) {
    return { name: userId.name, avatarUrl: userId.avatarUrl };
  }
  return { name: 'Unknown', avatarUrl: undefined };
}

// Helper to get user ID for comparison
function getUserId(message: GuestbookMessage): string {
  const userId = message.userId;
  if (typeof userId === 'object' && userId !== null) {
    return userId._id;
  }
  return typeof userId === 'string' ? userId : '';
}

export function MessageList({ messages, currentUserId, onDelete }: Props) {
  if (messages.length === 0) {
    return <p className="text-muted-foreground">No messages yet. Be the first to leave a message!</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => {
        const user = getUser(msg);
        const userId = getUserId(msg);
        return (
          <div key={msg._id} className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-start gap-3">
              <img
                src={user.avatarUrl || '/default-avatar.png'}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-foreground">{msg.message}</p>
              </div>
              {currentUserId === userId && (
                <button
                  onClick={() => onDelete(msg._id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
