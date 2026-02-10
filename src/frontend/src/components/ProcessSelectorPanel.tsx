import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useProcessSelector } from '../hooks/useProcessSelector';
import { useGetAvailableProcesses } from '../hooks/useQueries';
import { Cpu, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ProcessSelectorPanel() {
  const { selectedProcess, selectProcess, isLoading: processLoading, isSaving: processSaving } = useProcessSelector();
  const { data: availableProcesses, isLoading: processesLoading, refetch, dataUpdatedAt } = useGetAvailableProcesses();

  const processes = availableProcesses?.processes || [];
  const lastUpdated = availableProcesses?.lastUpdated ? new Date(Number(availableProcesses.lastUpdated) / 1000000) : null;

  const isSelectedProcessMissing = selectedProcess && !processes.includes(selectedProcess);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Process list refreshed');
    } catch (error) {
      toast.error('Failed to refresh process list');
    }
  };

  useEffect(() => {
    if (isSelectedProcessMissing) {
      console.warn('Selected process no longer available:', selectedProcess);
    }
  }, [isSelectedProcessMissing, selectedProcess]);

  if (processLoading || processesLoading) {
    return (
      <Card className="border-2 border-[oklch(0.45_0.15_45)]">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)] flex items-center gap-2">
            <Cpu className="h-5 w-5 sm:h-6 sm:w-6" />
            PROCESS SELECTOR
          </CardTitle>
          <CardDescription>Loading process selector...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground text-sm">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-[oklch(0.45_0.15_45)]">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)] flex items-center gap-2">
          <Cpu className="h-5 w-5 sm:h-6 sm:w-6" />
          PROCESS SELECTOR
        </CardTitle>
        <CardDescription>Select target game process</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Last Updated & Refresh */}
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="break-words">
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            className="shrink-0 h-8 px-2"
            title="Refresh process list"
          >
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Process Selector */}
        <div className="space-y-2">
          <Label htmlFor="process" className="text-sm sm:text-base font-bold">
            Target Process
          </Label>
          <Select
            value={selectedProcess || ''}
            onValueChange={(value) => selectProcess(value || null)}
            disabled={processSaving}
          >
            <SelectTrigger id="process" className="w-full h-11 sm:h-12 border-2">
              <SelectValue placeholder="Select a process..." />
            </SelectTrigger>
            <SelectContent>
              {processes.length === 0 ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No processes available
                </div>
              ) : (
                processes.map((process) => (
                  <SelectItem key={process} value={process}>
                    {process}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Process Display */}
        {isSelectedProcessMissing ? (
          <div className="bg-destructive/10 border-2 border-destructive/50 text-destructive p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Process Not Found
              </span>
            </div>
            <p className="font-mono text-sm break-all">
              {selectedProcess}
            </p>
            <p className="text-xs mt-2">
              This process is no longer available. Please select a different one.
            </p>
          </div>
        ) : selectedProcess ? (
          <div className="bg-[oklch(0.65_0.15_45)] text-white p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Active Process
              </span>
            </div>
            <p className="font-mono text-sm sm:text-base break-all">
              {selectedProcess}
            </p>
          </div>
        ) : (
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              No process selected
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Select a process to begin
            </p>
          </div>
        )}

        {/* Process Count Badge */}
        {processes.length > 0 && (
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              {processes.length} {processes.length === 1 ? 'process' : 'processes'} available
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
