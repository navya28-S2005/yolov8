import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RouterProvider, useRouter } from './contexts/RouterContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HomePage } from './pages/HomePage';
import { CameraPage } from './pages/CameraPage';
import { UploadPage } from './pages/UploadPage';
import { AccountPage } from './pages/AccountPage';
import { EditProfilePage } from './pages/EditProfilePage';

function AppContent() {
  const { currentPage, navigate } = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'signup')) {
        navigate('home');
      } else if (!user && currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'signup') {
        navigate('landing');
      }
    }
  }, [user, loading, currentPage, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  switch (currentPage) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignupPage />;
    case 'home':
      return <HomePage />;
    case 'camera':
      return <CameraPage />;
    case 'upload':
      return <UploadPage />;
    case 'account':
      return <AccountPage />;
    case 'edit-profile':
      return <EditProfilePage />;
    default:
      return <LandingPage />;
  }
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
}

export default App;
