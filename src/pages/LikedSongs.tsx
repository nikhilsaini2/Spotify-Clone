
import React from 'react';
import { Heart, Download, MoreHorizontal } from 'lucide-react';
import TrackList from '../components/TrackList';
import { useMusic } from '../context/MusicContext';

const LikedSongs = () => {
  const { state } = useMusic();
  
  // Mock liked songs for now - in real app this would come from user data
  const likedSongs = [
    {
      id: 'liked-1',
      title: 'Kesariya',
      artist: { id: 'ar1', name: 'Arijit Singh', picture: '/placeholder.svg' },
      album: { id: 'al1', title: 'Brahmastra', cover: '/placeholder.svg', cover_small: '/placeholder.svg' },
      duration: 268,
      preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3',
      rank: 950000
    },
    {
      id: 'liked-2', 
      title: 'Tum Hi Ho',
      artist: { id: 'ar1', name: 'Arijit Singh', picture: '/placeholder.svg' },
      album: { id: 'al2', title: 'Aashiqui 2', cover: '/placeholder.svg', cover_small: '/placeholder.svg' },
      duration: 262,
      preview: 'https://cdns-preview-a.dzcdn.net/stream/c-a2b58c6b4b2c7f5d8e9f0a1b2c3d4e5f-8.mp3',
      rank: 980000
    }
  ];

  return (
    <div className="text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-800 to-spotify-black p-8">
        <div className="flex items-end space-x-6">
          <div className="w-60 h-60 bg-gradient-to-br from-purple-400 to-blue-600 rounded-lg flex items-center justify-center shadow-2xl">
            <Heart size={80} className="text-white" fill="currentColor" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wide">Playlist</p>
            <h1 className="text-6xl font-black mb-4">Liked Songs</h1>
            <p className="text-spotify-light-gray">
              {likedSongs.length} songs
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 py-6 bg-gradient-to-b from-spotify-black/40 to-spotify-black">
        <div className="flex items-center space-x-6">
          <button className="bg-spotify-green text-black rounded-full p-4 hover:scale-105 transition-transform">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <button className="text-spotify-light-gray hover:text-white transition-colors">
            <MoreHorizontal size={32} />
          </button>
          <button className="text-spotify-light-gray hover:text-white transition-colors">
            <Download size={24} />
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="px-8">
        <TrackList 
          tracks={likedSongs} 
          showAlbum={true}
          showArtist={true}
          showAddedDate={true}
        />
      </div>
    </div>
  );
};

export default LikedSongs;
