
import React from 'react';
import { Clock } from 'lucide-react';
import TrackList from '../components/TrackList';

const RecentlyPlayed = () => {
  // Mock recently played tracks
  const recentTracks = [
    {
      id: 'recent-1',
      title: 'Apna Bana Le',
      artist: { id: 'ar1', name: 'Arijit Singh', picture: '/placeholder.svg' },
      album: { id: 'al1', title: 'Bhediya', cover: '/placeholder.svg', cover_small: '/placeholder.svg' },
      duration: 245,
      preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-8.mp3',
      rank: 850000
    },
    {
      id: 'recent-2',
      title: 'Raataan Lambiyan',
      artist: { id: 'ar2', name: 'Tanishk Bagchi', picture: '/placeholder.svg' },
      album: { id: 'al2', title: 'Shershaah', cover: '/placeholder.svg', cover_small: '/placeholder.svg' },
      duration: 287,
      preview: 'https://cdns-preview-a.dzcdn.net/stream/c-a2b58c6b4b2c7f5d8e9f0a1b2c3d4e5f-8.mp3',
      rank: 920000
    }
  ];

  return (
    <div className="p-8 text-white">
      <div className="flex items-center space-x-4 mb-8">
        <Clock size={32} className="text-spotify-green" />
        <h1 className="text-3xl font-bold">Recently Played</h1>
      </div>
      
      <TrackList 
        tracks={recentTracks}
        showAlbum={true}
        showArtist={true}
        showAddedDate={false}
      />
    </div>
  );
};

export default RecentlyPlayed;
