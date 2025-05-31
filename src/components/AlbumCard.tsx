
import React from 'react';
import { Link } from 'react-router-dom';
import { Album } from '../types/music';

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  return (
    <Link
      to={`/album/${album.id}`}
      className="spotify-card block group"
    >
      <div className="relative mb-4">
        <img
          src={album.cover_medium || album.cover}
          alt={album.title}
          className="w-full aspect-square object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300" />
      </div>
      
      <div>
        <h3 className="text-white font-bold text-lg mb-1 truncate group-hover:text-spotify-green transition-colors">
          {album.title}
        </h3>
        <p className="text-spotify-light-gray text-sm truncate hover:text-white hover:underline">
          {album.artist.name}
        </p>
        {album.release_date && (
          <p className="text-spotify-light-gray text-xs mt-1">
            {new Date(album.release_date).getFullYear()}
          </p>
        )}
      </div>
    </Link>
  );
};

export default AlbumCard;
