import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, RefreshCw, Globe } from 'lucide-react';
import { useBrowserHistory } from '../hooks/useBrowserHistory';

export function BrowserPage() {
  const { currentUrl, canGoBack, canGoForward, go, back, forward, reload } = useBrowserHistory();
  const [inputUrl, setInputUrl] = useState('');
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    setInputUrl(currentUrl);
  }, [currentUrl]);

  const handleGo = () => {
    if (!inputUrl.trim()) return;
    
    let normalizedUrl = inputUrl.trim();
    
    // Prepend https:// if no protocol is present
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    
    go(normalizedUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGo();
    }
  };

  const handleReload = () => {
    reload();
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Browser Chrome */}
      <header className="flex items-center gap-2 p-3 border-b border-border bg-card">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={back}
            disabled={!canGoBack}
            title="Back"
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={forward}
            disabled={!canGoForward}
            title="Forward"
            className="h-9 w-9"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReload}
            title="Reload"
            className="h-9 w-9"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 flex items-center">
            <Globe className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter URL or domain..."
              className="pl-10 pr-3 h-9"
            />
          </div>
          <Button onClick={handleGo} size="sm" className="h-9 px-6">
            Go
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {currentUrl ? (
          <iframe
            key={iframeKey}
            src={currentUrl}
            className="w-full h-full border-0"
            title="Browser Content"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center space-y-2">
              <Globe className="h-16 w-16 mx-auto opacity-20" />
              <p className="text-lg">Enter a URL to browse</p>
              <p className="text-sm">Some websites may not load due to iframe restrictions</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-2 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} · Built with ❤️ using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
