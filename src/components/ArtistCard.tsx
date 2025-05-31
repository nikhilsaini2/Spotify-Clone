
import React from 'react';
import { Link } from 'react-router-dom';
import { Artist } from '../types/music';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  return (
    <Link
      to={`/artist/${artist.id}`}
      className="spotify-card block group"
    >
      <div className="relative mb-4">
        <img
          src={artist.picture_medium || artist.picture}
          alt={artist.name}
          className="w-full aspect-square object-cover rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300" />
      </div>
      
      <div className="text-center">
        <h3 className="text-white font-bold text-lg mb-1 truncate group-hover:text-spotify-green transition-colors">
          {artist.name}
        </h3>
        <p className="text-spotify-light-gray text-sm">
          Artist
        </p>
        {artist.nb_fan && (
          <p className="text-spotify-light-gray text-xs mt-1">
            {artist.nb_fan.toLocaleString()} fans
          </p>
        )}
      </div>
    </Link>
  );
};

export default ArtistCard;
