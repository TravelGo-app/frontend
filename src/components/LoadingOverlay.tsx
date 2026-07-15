const loadingVideo = new URL("../assets/video loading.mp4", import.meta.url).toString()

interface LoadingOverlayProps {
  message?: string
}

export default function LoadingOverlay({ message = "loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[2000] overflow-hidden">
      <video
        src={loadingVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute left-1/2 bottom-8 z-10 -translate-x-1/2 rounded-full bg-white/80 px-5 py-2 shadow-lg shadow-slate-900/10 backdrop-blur-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-900">
          {message}
        </p>
      </div>
    </div>
  )
}
