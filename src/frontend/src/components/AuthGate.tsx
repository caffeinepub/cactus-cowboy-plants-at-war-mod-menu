import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileSetupDialog } from './ProfileSetupDialog';
import { LogOut, LogIn } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 border-[oklch(0.45_0.15_45)]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img 
                src="/assets/generated/cactus-cowboy-mascot.dim_768x768.png"
                alt="Cactus Cowboy"
                className="w-32 h-32 mx-auto"
              />
            </div>
            <CardTitle className="text-3xl font-black text-[oklch(0.45_0.15_45)]">
              CACTUS COWBOY
            </CardTitle>
            <CardDescription className="text-base">
              Plants at War - Mod Menu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Sign in to access your personalized mod menu and item spawner
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full h-12 text-lg font-bold"
              size="lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {isLoggingIn ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while checking profile
  if (profileLoading || !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading...</div>
          <div className="text-muted-foreground">Checking your profile</div>
        </div>
      </div>
    );
  }

  // Show profile setup if needed
  if (showProfileSetup) {
    return <ProfileSetupDialog />;
  }

  // Show main app with logout button
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-2 font-bold"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
      {children}
    </>
  );
}
