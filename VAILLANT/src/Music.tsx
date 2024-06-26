// src/components/MusicPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import "../css/music.css"

const tracks = [
  { title: 'I wanna Dance NCS', file: '/music/PYTI - I Wanna Dance Techno NCS .mp3' },
  { title: 'Only The Fallen NCS', file: '/music/Zeli - Only The Fallen Techno NCS - .mp3' },
  { title: 'Rave Teacher  NCS', file: '/music/KEVU - Rave Teacher Techno NCS.mp3' },
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
      <h1>Musique</h1>
      <div className="bubble"></div>
      <audio ref={audioRef} src={tracks[currentTrack].file} controls autoPlay />
      <div className='controls  '>
        <button onClick={handlePlayPause} style={{backgroundImage:  PlayPause? "url(/ImagesPing/play.png)" : "url(/ImagesPing/pause.png)"}}></button>
        <button onClick={handleNext} style={{backgroundImage: "url(/ImagesPing/next.png"}}></button>
      </div>
      <p>Currently playing: {tracks[currentTrack].title}</p>
    </div>
  );
};

export default MusicPlayer;