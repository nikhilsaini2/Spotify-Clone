
import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';
import { Track, PlayerState } from '../types/music';

interface MusicContextType {
  state: PlayerState;
  playTrack: (track: Track, queue?: Track[], index?: number) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

type MusicAction = 
  | { type: 'PLAY_TRACK'; payload: { track: Track; queue?: Track[]; index?: number } }
  | { type: 'PAUSE_TRACK' }
  | { type: 'RESUME_TRACK' }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'SET_QUEUE'; payload: { queue: Track[]; index: number } };

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  queue: [],
  currentIndex: 0,
  shuffle: false,
  repeat: 'off'
};

function musicReducer(state: PlayerState, action: MusicAction): PlayerState {
  switch (action.type) {
    case 'PLAY_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        isPlaying: true,
        queue: action.payload.queue || [action.payload.track],
        currentIndex: action.payload.index || 0,
        currentTime: 0
      };
    case 'PAUSE_TRACK':
      return { ...state, isPlaying: false };
    case 'RESUME_TRACK':
      return { ...state, isPlaying: true };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'NEXT_TRACK':
      const nextIndex = state.currentIndex + 1;
      if (nextIndex < state.queue.length) {
        return {
          ...state,
          currentTrack: state.queue[nextIndex],
          currentIndex: nextIndex,
          currentTime: 0
        };
      } else if (state.repeat === 'all') {
        return {
          ...state,
          currentTrack: state.queue[0],
          currentIndex: 0,
          currentTime: 0
        };
      }
      return state;
    case 'PREVIOUS_TRACK':
      const prevIndex = state.currentIndex - 1;
      if (prevIndex >= 0) {
        return {
          ...state,
          currentTrack: state.queue[prevIndex],
          currentIndex: prevIndex,
          currentTime: 0
        };
      }
      return state;
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle };
    case 'TOGGLE_REPEAT':
      const repeatModes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
      const currentIndex = repeatModes.indexOf(state.repeat);
      const nextRepeat = repeatModes[(currentIndex + 1) % repeatModes.length];
      return { ...state, repeat: nextRepeat };
    case 'SET_QUEUE':
      return {
        ...state,
        queue: action.payload.queue,
        currentIndex: action.payload.index
      };
    default:
      return state;
  }
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audio.currentTime });
    };

    const handleLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
    };

    const handleEnded = () => {
      if (state.repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [state.repeat]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = state.volume;
  }, [state.volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;

    audio.src = state.currentTrack.preview;
    if (state.isPlaying) {
      audio.play().catch(console.error);
    }
  }, [state.currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [state.isPlaying]);

  const playTrack = (track: Track, queue?: Track[], index?: number) => {
    dispatch({ type: 'PLAY_TRACK', payload: { track, queue, index } });
  };

  const pauseTrack = () => {
    dispatch({ type: 'PAUSE_TRACK' });
  };

  const resumeTrack = () => {
    dispatch({ type: 'RESUME_TRACK' });
  };

  const nextTrack = () => {
    dispatch({ type: 'NEXT_TRACK' });
  };

  const previousTrack = () => {
    dispatch({ type: 'PREVIOUS_TRACK' });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      dispatch({ type: 'SET_CURRENT_TIME', payload: time });
    }
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const toggleRepeat = () => {
    dispatch({ type: 'TOGGLE_REPEAT' });
  };

  return (
    <MusicContext.Provider value={{
      state,
      playTrack,
      pauseTrack,
      resumeTrack,
      nextTrack,
      previousTrack,
      setVolume,
      seekTo,
      toggleShuffle,
      toggleRepeat,
      audioRef
    }}>
      {children}
      <audio ref={audioRef} />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
