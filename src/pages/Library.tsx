
import React from 'react';
import { Music, Heart, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Library = () => {
  const libraryItems = [
    {
      id: 'liked-songs',
      title: 'Liked Songs',
      icon: Heart,
      count: '12 songs',
      path: '/liked-songs',
      color: 'bg-gradient-to-br from-purple-700 to-blue-300'
    },
    {
      id: 'recent',
      title: 'Recently Played',
      icon: Clock,
      count: '50 songs',
      path: '/recent',
      color: 'bg-gradient-to-br from-green-500 to-green-700'
    },
    {
      id: 'create',
      title: 'Create Playlist',
      icon: Plus,
      count: 'Make your own',
      path: '/create-playlist',
      color: 'bg-gradient-to-br from-gray-600 to-gray-800'
    }
  ];

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Your Library</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraryItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="spotify-card group"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 ${item.color} rounded-lg flex items-center justify-center`}>
                <item.icon size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg group-hover:text-spotify-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-spotify-light-gray text-sm">{item.count}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Made for You</h2>
        <div className="text-center py-12">
          <Music size={64} className="mx-auto text-spotify-light-gray mb-4" />
          <p className="text-spotify-light-gray">Start listening to build your library</p>
        </div>
      </div>
    </div>
  );
};

export default Library;
