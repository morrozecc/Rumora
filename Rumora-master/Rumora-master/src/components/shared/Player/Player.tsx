import { useEffect, useRef, useState } from "react";
import styles from './Player.module.css';
import ImgTag from "../ImgTag/ImgTag";
import Pause from './pause.png';
import Play from './play.png';

export function Player({ songId }: { songId: number }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && duration > 0) {
      setProgress((audio.currentTime / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = (clickX / rect.width) * 100;
    const newTime = (newPercent / 100) * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newPercent);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [duration]);

  return (
    <div className={styles.minimalPlayer}>
        <audio
            ref={audioRef}
            src={`${process.env.REACT_APP_SERVER}/api/audio/${songId}`}
            onEnded={() => setIsPlaying(false)}
        />

        <button onClick={togglePlay} className={styles.button}>
            {isPlaying ? 'Пауза' : 'Слушать'} 
            {isPlaying ? <ImgTag src={Pause} /> :  <ImgTag src={Play} />}
        </button>

        <div className={styles.timeline} onClick={handleSeek}>
            <div className={styles.track} />
            <div
                className={styles.thumb}
                style={{ left: `${progress}%` }}
            />
        </div>
    </div>
  );
}