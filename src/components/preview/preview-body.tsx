import { useState } from 'react';
import { base_name, ext_of, file_type, is_audio, is_image, is_pdf, is_text, is_video } from '../../common';
import { FileTypeIcon } from '../icons';
import { Fallback } from './fallback';
import { TextPreview } from './text-preview';
import type { PreviewBodyPropsType } from '../../types';

const MAX_TEXT = 5 * 1024 * 1024;

const PreviewBody = ({ entry, url, is_admin, on_copy_link, ...edit }: PreviewBodyPropsType) => {
  const [video_failed, set_video_failed] = useState(false);
  const { name } = entry;

  if (is_image(name)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <img
          src={url}
          alt={base_name(name)}
          className="max-w-full max-h-[calc(100dvh-13rem)] rounded-lg object-contain bg-[repeating-conic-gradient(var(--color-elevated)_0_25%,transparent_0_50%)] bg-[length:16px_16px]"
        />
      </div>
    );
  }
  if (is_video(name) && !video_failed) {
    return (
      <div className="flex justify-center">
        <video controls playsInline preload="metadata" src={url} onError={() => set_video_failed(true)} className="w-full max-h-[calc(100dvh-13rem)] rounded-lg bg-black" />
      </div>
    );
  }
  if (is_audio(name)) {
    return (
      <div className="w-full max-w-xl mx-auto mt-10 rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center gap-3 mb-5">
          <FileTypeIcon type="audio" className="w-6 h-6 text-accent" />
          <span className="font-mono text-sm truncate">{base_name(name)}</span>
        </div>
        <audio controls src={url} className="w-full" />
      </div>
    );
  }
  if (is_pdf(name)) return <iframe src={url} title={base_name(name)} className="w-full h-[calc(100dvh-12rem)] rounded-lg border border-border bg-white" />;
  if (is_text(name)) {
    if (entry.size > MAX_TEXT) return <Fallback entry={entry} url={url} reason="too large to preview" on_copy_link={on_copy_link} />;
    return <TextPreview entry={entry} url={url} is_admin={is_admin} {...edit} />;
  }

  const video = file_type(entry) === 'video';
  const reason = video ? `this browser can't play .${ext_of(name)} files — download it or stream it in vlc` : 'no preview for this file type';
  return <Fallback entry={entry} url={url} reason={reason} on_copy_link={on_copy_link} vlc={video} />;
};

export { PreviewBody };
