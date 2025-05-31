
export interface Track {
  id: string;
  title: string;
  artist: {
    id: string;
    name: string;
    picture?: string;
  };
  album: {
    id: string;
    title: string;
    cover: string;
    cover_medium?: string;
    cover_small?: string;
  };
  duration: number;
  preview: string;
  rank?: number;
}

export interface Artist {
  id: string;
  name: string;
  picture: string;
  picture_medium?: string;
  picture_big?: string;
  nb_fan?: number;
  nb_album?: number;
}

export interface Album {
  id: string;
  title: string;
  cover: string;
  cover_medium?: string;
  cover_big?: string;
  artist: {
    id: string;
    name: string;
    picture?: string;
  };
  release_date?: string;
  tracks?: Track[];
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  cover?: string;
  tracks: Track[];
  duration: number;
  created_at: string;
}

export interface SearchResults {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Track[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
}
