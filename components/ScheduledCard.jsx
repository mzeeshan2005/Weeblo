import { CardContent, Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Dot } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";

const ScheduledCard = ({ anime, userTimezone }) => {
  const { time, name, airingTimestamp, secondsUntilAiring } = anime;
  const [timeLeft, setTimeLeft] = useState(secondsUntilAiring || 0);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering for timezone operations
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        return newTime <= 0 ? 0 : newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format remaining time
  const formatTime = useCallback((seconds) => {
    if (seconds <= 0) return "Aired";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  }, []);

  // Get display time (use airingTimestamp converted to user timezone)
  const displayTime = useMemo(() => {
    if (!isClient) return "--:--";

    if (airingTimestamp) {
      return new Date(airingTimestamp * 1000).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: userTimezone,
      });
    }

    return time || "--:--";
  }, [airingTimestamp, isClient, time, userTimezone]);

  // Format time remaining with memoization
  const formattedTimeLeft = useMemo(() => {
    return formatTime(timeLeft);
  }, [timeLeft, formatTime]);

  // Determine status color
  const statusColor = useMemo(() => {
    if (timeLeft <= 0) return "text-green-500";
    if (timeLeft <= 600) return "text-orange-500"; // Last 10 minutes
    return "text-yellow-500";
  }, [timeLeft]);

  return (
    <Card className="h-full w-full hover:shadow-lg transition-shadow">
      <CardContent className="p-2 pt-2 grid gap-4 mx-auto">
        <div className="grid gap-1.5">
          {/* Anime Name with Status Indicator */}
          <div className="flex items-center gap-1">
            <div className="flex-shrink-0">
              <Dot className={cn("w-2 h-2", statusColor)} />
            </div>
            <h3 className="text-xs font-bold tracking-wide line-clamp-2 flex-1">
              {name}
            </h3>
          </div>

          {/* Time Information Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Time Until Airing */}
            <div>
              <p className="text-opacity-70 text-secondary opacity-70 text-[10px] uppercase tracking-tight mb-0.5">
                Starts In
              </p>
              <p
                className={cn(
                  "font-semibold",
                  timeLeft <= 0 && "text-green-500",
                  timeLeft > 0 && timeLeft <= 600 && "text-orange-500",
                  timeLeft > 600 && "text-yellow-500"
                )}
              >
                {formattedTimeLeft}
              </p>
            </div>

            {/* Airing Time */}
            <div className="text-right">
              <p className="text-opacity-70 text-secondary opacity-70 text-[10px] uppercase tracking-tight mb-0.5">
                Time
              </p>
              <p className="font-semibold">{displayTime}</p>
              {userTimezone && (
                <p className="text-[8px] opacity-50 truncate">
                  {userTimezone.split("/")[1] || userTimezone}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledCard;