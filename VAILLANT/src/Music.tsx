// src/components/MusicPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import "../css/music.css"
import { useTranslation } from 'react-i18next';

const tracks = [
  { title: 'Samuel on t\'aime', file: 'music/IDE.mp3'},
  { title: 'I wanna Dance NCS', file: '/music/PYTI - I Wanna Dance Techno NCS .mp3' },
  { title: 'Only The Fallen NCS', file: '/music/Zeli - Only The Fallen Techno NCS - .mp3' },
  { title: 'Rave Teacher  NCS', file: '/music/KEVU - Rave Teacher Techno NCS.mp3' },
  { title: 'Everen Maxwell Hyperphantasia NCS', file: '/music/Everen Maxwell - Hyperphantasia.mp3' },
  { title: 'AdhesiveWombat - Night Shade ♫ NCS', file: '/music/AdhesiveWombat - Night Shade ♫.mp3' },
];
const MusicPlayer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [PlayPause, setPlayPause] = useState<Boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useTranslation();

  const handlePlayPause = () => {
    setPlayPause(!PlayPause)
    if(PlayPause)
        audioRef.current?.play();
    else
        audioRef.current?.pause();
  };

  const handleNext = () => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % tracks.length);
    setPlayPause(false);
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
      <h1>♫</h1>
      <div className="bubble"></div>
      <audio ref={audioRef} src={tracks[currentTrack].file} controls autoPlay />
      <div className='controls  '>
        <button onClick={handlePlayPause} style={{backgroundImage:  PlayPause? "url(/ImagesPing/play.png)" : "url(/ImagesPing/pause.png)"}}></button>
        <button onClick={handleNext} style={{backgroundImage: "url(/ImagesPing/next.png"}}></button>
      </div>
      <p>{t('Playing')} {tracks[currentTrack].title}</p>
    </div>
  );
};

export default MusicPlayer;