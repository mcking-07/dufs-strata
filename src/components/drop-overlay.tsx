import { UploadIcon } from './icons';
import type { DropOverlayPropsType } from '../types';

const DropOverlay = ({ href }: DropOverlayPropsType) => (
  <div className="fixed inset-0 z-50 p-4 bg-bg/80 pointer-events-none animate-[fade_120ms_ease-out]">
    <div className="h-full rounded-2xl border-2 border-dashed border-accent flex flex-col items-center justify-center gap-2 text-accent">
      <UploadIcon className="w-8 h-8" />
      <div className="font-medium">drop to upload</div>
      <div className="text-xs font-mono text-muted">into {href}</div>
    </div>
  </div>
);

export { DropOverlay };
