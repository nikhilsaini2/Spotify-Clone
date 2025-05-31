
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Your Library', path: '/library' },
  ];

  const libraryItems = [
    { icon: Plus, label: 'Create Playlist', path: '/create-playlist' },
    { icon: Heart, label: 'Liked Songs', path: '/liked-songs' },
  ];

  return (
    <div className="w-64 bg-spotify-black h-full flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">♫</span>
          </div>
          <span className="text-white text-xl font-bold">Spotify</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
              isActive(item.path)
                ? 'bg-spotify-medium-gray text-white'
                : 'text-spotify-light-gray hover:text-white hover:bg-spotify-medium-gray hover:bg-opacity-50'
            }`}
          >
            <item.icon size={24} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Library Section */}
      <div className="mt-6 px-2">
        <div className="px-4 py-2">
          <h3 className="text-spotify-light-gray text-sm font-bold uppercase tracking-wider">
            Playlists
          </h3>
        </div>
        <nav className="space-y-1">
          {libraryItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-spotify-medium-gray text-white'
                  : 'text-spotify-light-gray hover:text-white hover:bg-spotify-medium-gray hover:bg-opacity-50'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Upgrade Section */}
      <div className="mt-auto p-6">
        <div className="bg-gradient-to-r from-purple-500 to-spotify-green rounded-lg p-4 text-white">
          <h3 className="font-bold text-sm mb-2">Preview of Spotify</h3>
          <p className="text-xs mb-3 opacity-90">
            Sign up to get unlimited songs and podcasts with occasional ads.
          </p>
          <button className="bg-white text-black text-sm font-bold py-2 px-4 rounded-full hover:scale-105 transition-transform">
            Sign up free
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
