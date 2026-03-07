import { Link, useLocation } from 'react-router-dom';
import { Home, User, FolderKanban, Mail, MessageSquare, Settings, Github, Linkedin, Sun, Moon, Code } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: User },
  { path: '/techstack', label: 'TechStack', icon: Code },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/contact', label: 'Contact', icon: Mail },
  { path: '/guestbook', label: 'Guestbook', icon: MessageSquare },
];

const adminNavItem = { path: '/admin', label: 'Admin', icon: Settings };

const socialLinks = [
  { href: 'https://github.com/duyhoang17930', label: 'GitHub', icon: Github },
  { href: 'https://www.linkedin.com/in/nguyen-duy-hoang-18207b350', label: 'LinkedIn', icon: Linkedin },
];

export function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  // Filter nav items - add admin only if user is admin
  const filteredNavItems = user?.isAdmin
    ? [...navItems, adminNavItem]
    : navItems;

  return (
    <nav className="fixed left-0 top-0 h-full w-20 flex flex-col items-center justify-between py-6 z-50">
      {/* Logo/Brand at top */}
      <Link to="/" className="text-foreground/80 font-bold text-lg tracking-wider">
        DA
      </Link>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-6">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'relative p-3 rounded-xl transition-all duration-300 group',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
              )}
              aria-label={item.label}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}

              <Icon
                className={cn(
                  'w-5 h-5 transition-transform duration-300',
                  'group-hover:scale-110'
                )}
                strokeWidth={1.5}
              />

              {/* Tooltip */}
              <span className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-3 text-muted-foreground hover:text-foreground transition-all duration-300 group"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          ) : (
            <Moon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          )}
        </button>

        {/* Social Icons */}
        {socialLinks.map((social) => {
          const Icon = social.icon;

          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-muted-foreground hover:text-foreground transition-all duration-300 group"
              aria-label={social.label}
            >
              <Icon
                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.5}
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
