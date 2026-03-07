interface Props {
  onLogin: (provider: 'google' | 'github') => void;
}

export function LoginPrompt({ onLogin }: Props) {
  return (
    <div className="border border-border rounded-lg p-8 text-center bg-card">
      <h2 className="text-xl font-semibold mb-2 text-foreground">Sign in to leave a message</h2>
      <p className="text-muted-foreground mb-6">Choose your preferred login method</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onLogin('google')}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Continue with Google
        </button>
        <button
          onClick={() => onLogin('github')}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
