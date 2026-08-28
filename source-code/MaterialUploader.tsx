import { useState } from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { SAMPLE_MATERIALS, type ExtractedMaterial } from '../lib/mcqGenerator';
function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
export function MaterialUploader({
  onSelectMaterial,
}: {
  onSelectMaterial: (material: ExtractedMaterial) => void;
}) {
  const [activeMaterial, setActiveMaterial] = useState<ExtractedMaterial>(SAMPLE_MATERIALS[0]);
  const [status, setStatus] = useState<'Ready' | 'Processing' | 'Processed'>('Processed');
  const [dragOver, setDragOver] = useState(false);
  const handleSelect = (mat: ExtractedMaterial) => {
    setStatus('Processing');
    setActiveMaterial(mat);
    setTimeout(() => {
      setStatus('Processed');
      onSelectMaterial(mat);
    }, 400);
  };
  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('Processing');
    const customMat: ExtractedMaterial = {
      title: file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      fileType: (file.name.split('.').pop()?.toUpperCase() as any) || 'TXT',
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      rawText: `Ingested content from ${file.name}. Statistical schedules, data cleaning routines, and analytical workflows.`,
      concepts: ['Custom Statistical Methods', 'Data Sanitation', 'Validation Rules'],
      detectedCompetencies: [
        { id: 'tech_sql', name: 'SQL & Database Querying' },
        { id: 'stat_data_quality', name: 'Data Quality Assurance' },
      ],
      isDemo: true,
    };
    setTimeout(() => {
      setActiveMaterial(customMat);
      setStatus('Processed');
      onSelectMaterial(customMat);
    }, 600);
  };
  return (
    <div className="space-y-6" data-testid="material-uploader">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Or Choose Preloaded MoSPI Learning Material (1-Click Demo)
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SAMPLE_MATERIALS.map(mat => (
            <button key={mat.title} onClick={() => handleSelect(mat)} className={cx('flex items-start gap-3 rounded-2xl border p-4 text-left transition', activeMaterial.title === mat.title ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border bg-card hover:bg-secondary/50')}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-xs">{mat.fileType}</span>
              <div>
                <h4 className="font-serif font-bold text-sm text-foreground">{mat.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{mat.fileName} · {mat.fileSize}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {mat.concepts.slice(0, 2).map(c => <span key={c} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{c}</span>)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); }} className={cx('relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition', dragOver ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40')}>
        <input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx,.txt" onChange={handleCustomUpload} className="absolute inset-0 cursor-pointer opacity-0" />
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary"><Upload size={24} /></span>
        <h3 className="mt-4 font-serif text-lg font-bold">Upload Custom Learning Material</h3>
        <p className="mt-1 text-xs text-muted-foreground">Drag and drop PDF, PPT, DOC, or TXT files here, or click to browse</p>
        <span className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Supported: PDF • PPT • DOC • TXT</span>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><FileText size={18} className="text-primary" /><span className="font-serif font-bold text-sm">{activeMaterial.title}</span></div>
          <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', status === 'Processed' ? 'bg-[hsl(155_32%_88%)] text-[hsl(162_46%_27%)]' : 'bg-secondary text-muted-foreground')}><CheckCircle2 size={12} /><span>{status}</span></span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 text-xs border-t border-border pt-3">
          <div><span className="block font-bold uppercase tracking-wider text-[10px] text-muted-foreground mb-1">Extracted Concepts ({activeMaterial.concepts.length})</span><div className="flex flex-wrap gap-1.5">{activeMaterial.concepts.map(c => <span key={c} className="rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">{c}</span>)}</div></div>
          <div><span className="block font-bold uppercase tracking-wider text-[10px] text-muted-foreground mb-1">Detected Competencies ({activeMaterial.detectedCompetencies.length})</span><div className="flex flex-wrap gap-1.5">{activeMaterial.detectedCompetencies.map(comp => <span key={comp.id} className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground border border-border">{comp.name}</span>)}</div></div>
        </div>
      </div>
    </div>
  );
}