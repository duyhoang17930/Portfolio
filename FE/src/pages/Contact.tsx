import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Handle form submission here
    setTimeout(() => {
      setSubmitting(false);
      alert('Message sent! (Demo)');
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Contact</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1 text-foreground">
            Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
