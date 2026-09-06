import React, { useState } from "react";
import { getYoutubeVideoId } from "../../utils/getYoutubeVideoId";
import { ExternalLink, Video } from "lucide-react";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
}

export default function YouTubePlayer({
  videoId,
  title,
}: YouTubePlayerProps) {
  const [hasError, setHasError] = useState(false);

  // Sanitize video ID cleanly
  const cleanVideoId = getYoutubeVideoId(videoId);

  if (!cleanVideoId) {
    return (
      <div className="rounded-xl bg-gray-900 p-8 text-center text-sm font-medium text-slate-400 flex flex-col items-center justify-center gap-3">
        <Video className="w-8 h-8 text-slate-500" />
        <p>Video ID unavailable or invalid.</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-8 text-center flex flex-col items-center justify-center gap-4 my-auto">
        <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20 text-red-400">
          <Video className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm font-bold text-white mb-1">
            Inline player restricted by YouTube creator
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            This video cannot be embedded inside the frame, but you can watch it directly on YouTube.
          </p>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${cleanVideoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-600/30"
        >
          <ExternalLink className="w-4 h-4" />
          Watch on YouTube
        </a>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-2xl bg-black"
      style={{ paddingBottom: "56.25%" }}
    >
      <iframe
        className="absolute top-0 left-0 h-full w-full border-0"
        src={`https://www.youtube-nocookie.com/embed/${cleanVideoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() => {
          console.error("YouTube Player failed to load video with ID:", cleanVideoId);
          setHasError(true);
        }}
      />
    </div>
  );
}
