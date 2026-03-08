import { useAuth } from '../hooks/useAuth';
import { useGuestbook } from '../hooks/useGuestbook';
import { MessageList } from '../components/guestbook/MessageList';
import { MessageForm } from '../components/guestbook/MessageForm';
import { LoginPrompt } from '../components/guestbook/LoginPrompt';
import { MessageCircle } from 'lucide-react';

export function Guestbook() {
  const { user, loading, login, logout } = useAuth();
  const { messages, loading: messagesLoading, addMessage, deleteMessage } = useGuestbook();

  if (loading || messagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-4">
            <MessageCircle className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground animate-fade-in">
            Guestbook
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in-up">
            Leave a message, connect with other visitors, or just say hello.
          </p>
        </div>

        {/* Auth Section */}
        <div className="mb-8 animate-fade-in-up">
          {user ? (
            <div className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatarUrl || '/default-avatar.png'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-primary"
                  />
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">Signed in</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-muted-foreground hover:text-foreground transition px-4 py-2 rounded-lg hover:bg-secondary/50"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Form or Login */}
        <div className="mb-10 animate-fade-in-up-delayed">
          {user ? (
            <MessageForm onSubmit={addMessage} user={user} />
          ) : (
            <LoginPrompt onLogin={login} />
          )}
        </div>

        {/* Messages */}
        <div className="animate-fade-in-up-delayed">
          <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-3">
            <span>Messages</span>
            <span className="text-sm font-normal text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
              {messages.length}
            </span>
          </h2>
          <MessageList
            messages={messages}
            currentUserId={user?._id}
            onDelete={deleteMessage}
          />
        </div>
      </div>
    </div>
  );
}
