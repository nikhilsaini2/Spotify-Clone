
import React, { useState } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { Track } from '../types/music';
import { useMusic } from '../context/MusicContext';

interface TrackListProps {
  tracks: Track[];
  showAlbum?: boolean;
  showArtist?: boolean;
  showAddedDate?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({ 
  tracks, 
  showAlbum = true, 
  showArtist = true,
  showAddedDate = false 
}) => {
  const { state, playTrack, pauseTrack, resumeTrack } = useMusic();
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track: Track, index: number) => {
    console.log('Track clicked:', track.title, 'by', track.artist.name);
    
    if (state.currentTrack?.id === track.id) {
      if (state.isPlaying) {
        console.log('Pausing current track');
        pauseTrack();
      } else {
        console.log('Resuming current track');
        resumeTrack();
      }
    } else {
      console.log('Playing new track:', track);
      playTrack(track, tracks, index);
    }
  };

  const handleLikeTrack = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedTracks = new Set(likedTracks);
    if (likedTracks.has(trackId)) {
      newLikedTracks.delete(trackId);
      console.log('Removed from liked songs:', trackId);
    } else {
      newLikedTracks.add(trackId);
      console.log('Added to liked songs:', trackId);
    }
    setLikedTracks(newLikedTracks);
  };

  const isCurrentTrack = (trackId: string) => state.currentTrack?.id === trackId;
  const isPlaying = (trackId: string) => isCurrentTrack(trackId) && state.isPlaying;
  const isLiked = (trackId: string) => likedTracks.has(trackId);

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-spotify-light-gray">No tracks available</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-spotify-light-gray text-sm font-medium border-b border-gray-700 mb-2">
        <div className="col-span-1">#</div>
        <div className="col-span-5">TITLE</div>
        {showAlbum && <div className="col-span-3">ALBUM</div>}
        {showAddedDate && <div className="col-span-2">DATE ADDED</div>}
        <div className="col-span-1 text-right">⏱</div>
        <div className="col-span-1"></div>
      </div>

      {/* Track List */}
      <div className="space-y-1">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="grid grid-cols-12 gap-4 px-4 py-2 rounded-lg hover:bg-spotify-medium-gray hover:bg-opacity-50 transition-colors group cursor-pointer"
            onClick={() => handlePlayTrack(track, index)}
          >
            {/* Track Number / Play Button */}
            <div className="col-span-1 flex items-center">
              <div className="relative w-4">
                {isCurrentTrack(track.id) ? (
                  <button className="text-spotify-green">
                    {isPlaying(track.id) ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                ) : (
                  <>
                    <span className="text-spotify-light-gray group-hover:hidden">
                      {index + 1}
                    </span>
                    <button className="hidden group-hover:block text-white hover:text-spotify-green">
                      <Play size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Title and Artist */}
            <div className="col-span-5 flex items-center space-x-3">
              <img
                src={track.album.cover_small || track.album.cover}
                alt={track.album.title}
                className="w-10 h-10 rounded"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              <div className="min-w-0">
                <p className={`font-medium truncate ${
                  isCurrentTrack(track.id) ? 'text-spotify-green' : 'text-white'
                }`}>
                  {track.title}
                </p>
                {showArtist && (
                  <p className="text-spotify-light-gray text-sm truncate hover:text-white hover:underline cursor-pointer">
                    {track.artist.name}
                  </p>
                )}
              </div>
            </div>

            {/* Album */}
            {showAlbum && (
              <div className="col-span-3 flex items-center">
                <p className="text-spotify-light-gray text-sm truncate hover:text-white hover:underline cursor-pointer">
                  {track.album.title}
                </p>
              </div>
            )}

            {/* Date Added */}
            {showAddedDate && (
              <div className="col-span-2 flex items-center">
                <p className="text-spotify-light-gray text-sm">
                  3 days ago
                </p>
              </div>
            )}

            {/* Duration */}
            <div className="col-span-1 flex items-center justify-end">
              <span className="text-spotify-light-gray text-sm">
                {formatDuration(track.duration)}
              </span>
            </div>

            {/* Like Button */}
            <div className="col-span-1 flex items-center justify-end">
              <button 
                onClick={(e) => handleLikeTrack(track.id, e)}
                className={`opacity-0 group-hover:opacity-100 transition-all ${
                  isLiked(track.id) 
                    ? 'text-spotify-green opacity-100' 
                    : 'text-spotify-light-gray hover:text-white'
                }`}
              >
                <Heart size={16} fill={isLiked(track.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
