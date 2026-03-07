import { GuestbookMessage } from '../../types';

interface Props {
  messages: GuestbookMessage[];
  currentUserId?: number;
  onDelete: (id: number) => void;
}

export function MessageList({ messages, currentUserId, onDelete }: Props) {
  if (messages.length === 0) {
    return <p className="text-muted-foreground">No messages yet. Be the first to leave a message!</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-start gap-3">
            <img
              src={msg.user.avatarUrl || '/default-avatar.png'}
              alt={msg.user.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{msg.user.name}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-foreground">{msg.message}</p>
            </div>
            {currentUserId === msg.userId && (
              <button
                onClick={() => onDelete(msg.id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
