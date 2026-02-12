import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile({
        name: name.trim(),
        itemSpawner: { 
          items: [],
          spawnHistory: [],
        },
        prefabSpawner: {
          prefabs: [],
          spawnHistory: [],
        },
        modSettings: {
          flyEnabled: false,
          superSpeedEnabled: false,
          superSpeedMultiplier: 1.0,
          superJumpEnabled: false,
          superJumpMultiplier: 1.0,
          disableMonsters: false,
        },
        processSelector: {
          selectedProcess: undefined,
        },
      });
      toast.success('Profile created! Welcome to the mod menu.');
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
      console.error('Profile creation error:', error);
    }
  };

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
            WELCOME, COWBOY!
          </CardTitle>
          <CardDescription className="text-base">
            Let's set up your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-bold">
                What should we call you?
              </Label>
              <Input
                id="name"
                placeholder="Enter your cowboy name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 h-12 text-lg"
                autoFocus
                maxLength={50}
              />
            </div>
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="w-full h-12 text-lg font-bold"
              size="lg"
            >
              {isPending ? 'Creating Profile...' : 'Start Modding'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
