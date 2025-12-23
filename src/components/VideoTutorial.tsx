import { Play } from "lucide-react";

interface VideoTutorialProps {
  videoUrl: string;
  title: string;
}

const VideoTutorial = ({ videoUrl, title }: VideoTutorialProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Play className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Video Tutorial</h3>
      </div>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
        <iframe
          src={videoUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoTutorial;
