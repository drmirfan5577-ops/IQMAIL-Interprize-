import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Play, Pause, Trash2, Square } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

interface VoiceMessageProps {
  onSend: (audioBlob: Blob, duration: number) => void;
  onCancel: () => void;
}

const VoiceMessage = ({ onSend, onCancel }: VoiceMessageProps) => {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveform, setWaveform] = useState<number[]>(Array(40).fill(5));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animRef = useRef<number>(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(d => {
          if (d >= 120) { stopRecording(); return d; }
          return d + 1;
        });
      }, 1000);

      // Animate waveform
      const animateWave = () => {
        setWaveform(Array(40).fill(0).map(() => Math.random() * 28 + 4));
        animRef.current = requestAnimationFrame(animateWave);
      };
      animRef.current = requestAnimationFrame(animateWave);

    } catch {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    cancelAnimationFrame(animRef.current);
    setWaveform(Array(40).fill(5));
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioURL) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob, duration);
    }
  };

  const handleDiscard = () => {
    setAudioBlob(null);
    setAudioURL(null);
    setDuration(0);
    onCancel();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: `${theme.surface}`,
        backdropFilter: 'blur(16px)',
        border: `1px solid ${theme.border}`,
      }}
    >
      {/* Waveform */}
      <div className="flex items-center justify-center gap-[2px] h-10">
        {waveform.map((h, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-75"
            style={{
              width: 3,
              height: h,
              background: isRecording
                ? `linear-gradient(180deg, ${theme.accent}, ${theme.glow}80)`
                : audioURL
                ? `${theme.accent}80`
                : `${theme.accent}30`,
              minHeight: 4,
            }}
          />
        ))}
      </div>

      {/* Timer */}
      <div className="text-center">
        <span
          className="text-2xl font-mono font-bold"
          style={{ color: theme.accent }}
        >
          {formatTime(duration)}
        </span>
        {isRecording && (
          <span className="ml-2 inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!isRecording && !audioURL && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
          >
            <Mic size={16} />
            Start Recording
          </button>
        )}

        {isRecording && (
          <>
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: '#ef444420', color: '#ef4444', border: '1px solid #ef444440' }}
            >
              <Square size={14} />
              Stop
            </button>
          </>
        )}

        {audioURL && !isRecording && (
          <>
            <button
              onClick={handleDiscard}
              className="p-2.5 rounded-xl"
              style={{ background: '#ef444415', color: '#ef4444' }}
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 rounded-xl font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.glow})` }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              onClick={handleSend}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: `linear-gradient(135deg, #10b981, #059669)` }}
            >
              <Send size={14} />
              Send Voice
            </button>
          </>
        )}

        {!audioURL && !isRecording && (
          <button onClick={onCancel} className="text-xs px-3 py-1.5 rounded-lg" style={{ color: theme.text, opacity: 0.5 }}>
            Cancel
          </button>
        )}
      </div>

      {audioURL && (
        <audio
          ref={audioRef}
          src={audioURL}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  );
};

export default VoiceMessage;
