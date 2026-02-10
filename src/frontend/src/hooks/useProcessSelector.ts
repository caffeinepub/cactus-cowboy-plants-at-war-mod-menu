import { useGetProcessSelector, useSetProcessSelector } from './useQueries';
import { toast } from 'sonner';

export function useProcessSelector() {
  const { data: processSelector, isLoading } = useGetProcessSelector();
  const { mutateAsync: setProcessSelector, isPending: isSaving } = useSetProcessSelector();

  const selectedProcess = processSelector?.selectedProcess || null;

  const selectProcess = async (processName: string | null) => {
    try {
      await setProcessSelector({ 
        selectedProcess: processName || undefined 
      });
      // Removed toast notifications to avoid spam on refresh
    } catch (error) {
      console.error('Failed to save process selection:', error);
      toast.error('Failed to save process selection');
    }
  };

  return {
    selectedProcess,
    selectProcess,
    isLoading,
    isSaving,
  };
}
