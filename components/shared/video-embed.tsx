type VideoProvider = 'youtube' | 'vk' | 'none';

type VideoEmbedProps = {
  embedUrl: string;
  provider: VideoProvider;
};

function buildEmbedUrl(embedUrl: string, provider: VideoProvider): string {
  if (provider === 'youtube') {
    const separator = embedUrl.includes('?') ? '&' : '?';
    return `${embedUrl}${separator}rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1`;
  }

  if (provider === 'vk') {
    const separator = embedUrl.includes('?') ? '&' : '?';
    return `${embedUrl}${separator}hd=2&js_api=1&no_share=1&__ref=no_ref`;
  }

  return embedUrl;
}

export function VideoEmbed({ embedUrl, provider }: VideoEmbedProps) {
  return (
    <div className="relative aspect-video w-full">
      <iframe src={buildEmbedUrl(embedUrl, provider)} className="h-full w-full" allowFullScreen />
      <div className="absolute right-0 top-0 z-10 h-10 w-20 bg-black" style={{ pointerEvents: 'none' }} />
    </div>
  );
}
