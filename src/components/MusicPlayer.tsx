
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Volume, Heart, Music, Repeat, Repeat1 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

const MusicPlayer = () => {
  const { state, pauseTrack, resumeTrack, nextTrack, previousTrack, setVolume, seekTo, toggleShuffle, toggleRepeat } = useMusic();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * state.duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handlePlayPause = () => {
    console.log('Play/pause clicked, current state:', { 
      isPlaying: state.isPlaying, 
      currentTrack: state.currentTrack?.title 
    });
    
    if (state.isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    // TODO: Add to liked songs in context/database
    console.log(`${isLiked ? 'Removed from' : 'Added to'} liked songs:`, state.currentTrack?.title);
  };

  const getRepeatIcon = () => {
    if (state.repeat === 'one') {
      return <Repeat1 size={20} />;
    }
    return <Repeat size={20} />;
  };

  useEffect(() => {
    if (state.currentTrack) {
      setAudioError(false);
      console.log('Now playing:', state.currentTrack.title, 'by', state.currentTrack.artist.name);
    }
  }, [state.currentTrack]);

  if (!state.currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-spotify-medium-gray border-t border-gray-800 p-4 z-50">
        <div className="max-w-screen-xl mx-auto flex items-center justify-center">
          <div className="flex items-center space-x-3 text-spotify-light-gray">
            <Music size={20} />
            <span>Select a song to start playing</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-spotify-medium-gray border-t border-gray-800 p-4 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Current Track Info */}
        <div className="flex items-center space-x-4 w-1/3">
          <img
            src={state.currentTrack.album.cover}
            alt={state.currentTrack.album.title}
            className="w-14 h-14 rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="min-w-0">
            <p className="text-white font-medium truncate">
              {state.currentTrack.title}
            </p>
            <p className="text-spotify-light-gray text-sm truncate">
              {state.currentTrack.artist.name}
            </p>
            {audioError && (
              <p className="text-red-400 text-xs">Audio not available</p>
            )}
          </div>
          <button 
            onClick={handleLikeToggle}
            className={`transition-colors ${
              isLiked ? 'text-spotify-green' : 'text-spotify-light-gray hover:text-white'
            }`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center space-x-4 mb-2">
            <button
              onClick={toggleShuffle}
              className={`transition-colors ${
                state.shuffle ? 'text-spotify-green' : 'text-spotify-light-gray hover:text-white'
              }`}
              title={`Shuffle: ${state.shuffle ? 'On' : 'Off'}`}
            >
              <Shuffle size={20} />
            </button>
            
            <button
              onClick={previousTrack}
              className="text-spotify-light-gray hover:text-white transition-colors"
              title="Previous"
            >
              <SkipBack size={24} />
            </button>

            <button
              onClick={handlePlayPause}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
              title={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              onClick={nextTrack}
              className="text-spotify-light-gray hover:text-white transition-colors"
              title="Next"
            >
              <SkipForward size={24} />
            </button>

            <button
              onClick={toggleRepeat}
              className={`transition-colors ${
                state.repeat !== 'off' ? 'text-spotify-green' : 'text-spotify-light-gray hover:text-white'
              }`}
              title={`Repeat: ${state.repeat}`}
            >
              {getRepeatIcon()}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full max-w-md">
            <span className="text-spotify-light-gray text-xs">
              {formatTime(state.currentTime)}
            </span>
            <div
              className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full relative"
                style={{ width: `${state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0}%` }}
              >
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-spotify-light-gray text-xs">
              {formatTime(state.duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-end space-x-4 w-1/3">
          <div className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="text-spotify-light-gray hover:text-white transition-colors"
              title="Volume"
            >
              <Volume size={20} />
            </button>
            {showVolumeSlider && (
              <div className="absolute bottom-full right-0 mb-2 bg-spotify-dark-gray p-3 rounded-lg shadow-lg">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={state.volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
