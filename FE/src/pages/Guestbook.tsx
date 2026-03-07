import { useAuth } from '../hooks/useAuth';
import { useGuestbook } from '../hooks/useGuestbook';
import { MessageList } from '../components/guestbook/MessageList';
import { MessageForm } from '../components/guestbook/MessageForm';
import { LoginPrompt } from '../components/guestbook/LoginPrompt';

export function Guestbook() {
  const { user, loading, login, logout } = useAuth();
  const { messages, loading: messagesLoading, addMessage, deleteMessage } = useGuestbook();

  if (loading || messagesLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-foreground">Guestbook</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl || '/default-avatar.png'}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <button
              onClick={logout}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>

      {user ? (
        <MessageForm onSubmit={addMessage} user={user} />
      ) : (
        <LoginPrompt onLogin={login} />
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">
          Messages ({messages.length})
        </h2>
        <MessageList
          messages={messages}
          currentUserId={user?.id}
          onDelete={deleteMessage}
        />
      </div>
    </div>
  );
}
