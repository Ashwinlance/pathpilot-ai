import { useState } from 'react'; 
import { Settings, RotateCcw, ShieldCheck, Check } from 'lucide-react'; 
import { TechnicalTransparency } from '../components/TechnicalTransparency'; 
export function SettingsPage({ 
  onResetDemo, 
  go, 
}: { 
  onResetDemo: () => void; 
  go: (path: string) => void; 
}) { 
  const [resetDone, setResetDone] = useState(false); 
  const handleReset = () => { 
    onResetDemo(); 
    setResetDone(true); 
    setTimeout(() => { 
      setResetDone(false); 
      go('/competency'); 
    }, 1000); 
  }; 
  return ( 
    <div className="mx-auto max-w-4xl space-y-8" data-testid="page-settings"> 
      <div className="flex items-center justify-between"> 
        <div> 
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">System Configuration</p> 
          <h1 className="font-serif text-4xl font-bold tracking-[-.045em]">Preferences & Demo Controls</h1> 
          <p className="mt-1 text-sm text-muted-foreground">Manage local state, reset demo scenario, and inspect architecture declarations.</p> 
        </div> 
      </div> 
      {/* Demo Reset Card */} 
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"> 
        <h3 className="font-serif text-xl font-bold text-foreground">Reset Judge Demo State</h3> 
        <p className="text-xs leading-6 text-muted-foreground"> 
          Clicking Reset Demo removes all active local storage data and restores clean default state. 
        </p> 
        <button 
          onClick={handleReset} 
          data-testid="button-settings-reset-demo" 
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground shadow-sm hover:brightness-110" 
        > 
          <RotateCcw size={15} /> 
          <span>{resetDone ? 'Demo Reset Complete!' : 'Reset Demo State'}</span> 
        </button> 
      </div> 
      <TechnicalTransparency /> 
    </div> 
  ); 
} 