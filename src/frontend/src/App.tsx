import { AuthGate } from './components/AuthGate';
import { ModMenuPage } from './pages/ModMenuPage';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <AuthGate>
      <ModMenuPage />
      <Toaster />
    </AuthGate>
  );
}
