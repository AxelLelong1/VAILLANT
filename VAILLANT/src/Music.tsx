// src/components/MusicPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import "../css/music.css"

const tracks = [
  { title: 'I Got Choo', file: '/music/unrailed-ost-04-i-got-choo.mp3' },
  { title: 'Ghost Driver', file: '/music/unrailed-ost-11-ghost-driver.mp3' },
];

const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [PlayPause, setPlayPause] = useState<Boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = () => {
    setPlayPause(!PlayPause)
    if(PlayPause)
        audioRef.current?.play();
    else
        audioRef.current?.pause();
  };

  const handleNext = () => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % tracks.length);
  };

  const handleEnded = () => {
    handleNext();
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleEnded);
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentTrack]);

  return (
    <div className='music-player'>
      <h1>Music Player</h1>
      <audio ref={audioRef} src={tracks[currentTrack].file} controls autoPlay />
      <div className='controls  '>
        <button onClick={handlePlayPause}>{PlayPause? "Play" : "Pause" }</button>
        <button onClick={handleNext}>Next</button>
      </div>
      <p>Currently playing: {tracks[currentTrack].title}</p>
    </div>
  );
};

export default MusicPlayer;