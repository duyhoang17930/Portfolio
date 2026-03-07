import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-[0] bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-20"
        style={{ backgroundImage: 'url(/background.jpg)' }}
        aria-hidden="true"
      />

      {/* Background Effects */}
      <div className="film-grain" aria-hidden="true" />
      <div className="chromatic-silhouette" aria-hidden="true" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <main className="pl-20 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
