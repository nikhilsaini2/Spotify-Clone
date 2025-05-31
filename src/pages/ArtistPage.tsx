
import React from 'react';
import { useParams } from 'react-router-dom';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import TrackList from '../components/TrackList';

const ArtistPage = () => {
  const { id } = useParams();
  
  // Mock artist data
  const artist = {
    id: id || 'ar1',
    name: 'Arijit Singh',
    picture: '/placeholder.svg',
    nb_fan: 8500000,
    bio: 'Arijit Singh is an Indian playback singer and music director. He sings predominantly in Hindi and Bengali but has also performed in various other Indian languages.'
  };

  const topTracks = [
    {
      id: 'top-1',
      title: 'Tum Hi Ho',
      artist: { id: 'ar1', name: 'Arijit Singh', picture: '/placeholder.svg' },
      album: { id: 'al1', title: 'Aashiqui 2', cover: '/placeholder.svg', cover_small: '/placeholder.svg' },
      duration: 262,
      preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3',
      rank: 980000
    },
    {
      id: 'top-2',
      title: 'Kesariya',
      artist: { id: 'ar1', name: 'Arijit Singh', picture: '/placeholder.svg' },
      album: { id: 'al2', title: 'Brahmastra', cover: '/placeholder.svg', cover_small: '/placeholder.svg' },
      duration: 268,
      preview: 'https://cdns-preview-a.dzcdn.net/stream/c-a2b58c6b4b2c7f5d8e9f0a1b2c3d4e5f-8.mp3',
      rank: 950000
    }
  ];

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-900 to-spotify-black p-8">
        <div className="flex items-end space-x-6">
          <img
            src={artist.picture}
            alt={artist.name}
            className="w-60 h-60 rounded-full shadow-2xl object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div>
            <p className="text-sm font-bold uppercase tracking-wide">Artist</p>
            <h1 className="text-6xl font-black mb-4">{artist.name}</h1>
            <p className="text-spotify-light-gray">
              {artist.nb_fan.toLocaleString()} monthly listeners
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 py-6 bg-gradient-to-b from-spotify-black/40 to-spotify-black">
        <div className="flex items-center space-x-6">
          <button className="bg-spotify-green text-black rounded-full p-4 hover:scale-105 transition-transform">
            <Play size={28} fill="currentColor" />
          </button>
          <button className="border border-spotify-light-gray text-spotify-light-gray px-6 py-2 rounded-full hover:border-white hover:text-white transition-colors">
            Following
          </button>
          <button className="text-spotify-light-gray hover:text-white transition-colors">
            <MoreHorizontal size={32} />
          </button>
        </div>
      </div>

      {/* Popular Tracks */}
      <div className="px-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Popular</h2>
        <TrackList 
          tracks={topTracks}
          showAlbum={true}
          showArtist={false}
        />
      </div>

      {/* About */}
      <div className="px-8">
        <h2 className="text-2xl font-bold mb-6">About</h2>
        <div className="bg-spotify-medium-gray rounded-lg p-6">
          <p className="text-spotify-light-gray leading-relaxed mb-4">
            {artist.bio}
          </p>
          <p className="text-white font-semibold">
            {artist.nb_fan.toLocaleString()} monthly listeners
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
