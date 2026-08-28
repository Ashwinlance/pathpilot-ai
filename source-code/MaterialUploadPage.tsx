import { useState } from 'react';
import { FileText, ArrowRight, Info } from 'lucide-react';
import { MaterialUploader } from '../components/MaterialUploader';
import { SAMPLE_MATERIALS, type ExtractedMaterial } from '../lib/mcqGenerator';

export function MaterialUploadPage({
  onMaterialSelected,
  go,
}: {
  onMaterialSelected: (mat: ExtractedMaterial) => void;
  go: (path: string) => void;
}) {
  const [selectedMaterial, setSelectedMaterial] = useState<ExtractedMaterial>(SAMPLE_MATERIALS[0]);

  const handleGenerate = () => {
    onMaterialSelected(selectedMaterial);
    go('/mcq-generator');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8" data-testid="page-material-upload">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-5 rounded-[1.8rem] border border-border bg-card p-6 shadow-sm sm:p-8 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <FileText size={14} />
            <span>Document Intelligence & AI Assessment</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-[-.03em] text-foreground sm:text-4xl">
            Upload Learning Material
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Ingest official statistical handbooks, survey guidelines, or training decks (PDF, PPT, DOC, TXT) to automatically extract concepts and generate competency-aware MCQs.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          data-testid="button-generate-mcqs"
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:brightness-110 active:translate-y-px"
        >
          <span>Generate Assessment MCQs</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Demo Technical Transparency Banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/70 p-4 text-xs leading-5 text-muted-foreground">
        <Info size={18} className="shrink-0 text-primary" />
        <span>
          <strong>Prototype Ingestion Engine:</strong> Ingests documents, extracts statistical concepts, and maps them to MoSPI competency domains. Preloaded sample materials are provided for 1-click hackathon demonstration.
        </span>
      </div>

      {/* Main Material Uploader */}
      <MaterialUploader
        onSelectMaterial={mat => {
          setSelectedMaterial(mat);
        }}
      />
    </div>
  );
}
