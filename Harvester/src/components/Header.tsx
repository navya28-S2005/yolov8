import { Link, useLocation } from 'react-router-dom';
import { useMember } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Cpu, User, LogOut } from 'lucide-react';

export default function Header() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-[#1E293B] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-lg transition-transform group-hover:scale-110">
              <Cpu className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-heading font-bold text-white">AI Fruit Analysis</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`font-paragraph text-base transition-colors ${
                isActive('/') ? 'text-primary' : 'text-light-gray hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/instructions"
              className={`font-paragraph text-base transition-colors ${
                isActive('/instructions') ? 'text-primary' : 'text-light-gray hover:text-primary'
              }`}
            >
              Instructions
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`font-paragraph text-base transition-colors ${
                  isActive('/dashboard') ? 'text-primary' : 'text-light-gray hover:text-primary'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isLoading && <div className="text-light-gray text-sm">Loading...</div>}
            {!isLoading && !isAuthenticated && (
              <Button
                onClick={actions.login}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                Sign In
              </Button>
            )}
            {!isLoading && isAuthenticated && (
              <>
                <Link to="/profile">
                  <Button variant="outline" className="border-light-gray text-light-gray hover:text-primary hover:border-primary transition-all">
                    <User className="w-4 h-4 mr-2" />
                    {member?.profile?.nickname || 'Profile'}
                  </Button>
                </Link>
                <Button
                  onClick={actions.logout}
                  variant="outline"
                  className="border-danger text-danger hover:bg-danger hover:text-white transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
