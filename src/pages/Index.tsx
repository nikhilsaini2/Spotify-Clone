
import React, { useState, useEffect } from 'react';
import { Play, AlertCircle, Music } from 'lucide-react';
import { musicApi } from '../services/musicApi';
import { Track, Artist, Album } from '../types/music';
import { useMusic } from '../context/MusicContext';
import TrackList from '../components/TrackList';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';

const Index = () => {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topAlbums, setTopAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playTrack } = useMusic();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching homepage data...');
        const [tracks, artists, albums] = await Promise.all([
          musicApi.getTopTracks(20),
          musicApi.getTopArtists(12),
          musicApi.getTopAlbums(12)
        ]);

        console.log('Homepage data loaded:', { tracks: tracks.length, artists: artists.length, albums: albums.length });
        setTopTracks(tracks);
        setTopArtists(artists);
        setTopAlbums(albums);
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
        setError('Failed to load some content. Showing available music.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlayAll = () => {
    if (topTracks.length > 0) {
      console.log('Playing first track:', topTracks[0]);
      playTrack(topTracks[0], topTracks, 0);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-spotify-dark-gray">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-spotify-green mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading amazing music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-spotify-dark-gray to-spotify-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-purple-600 to-purple-900 p-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-orange-900 bg-opacity-50 border border-orange-600 rounded-lg flex items-center space-x-3">
              <AlertCircle className="text-orange-400" size={20} />
              <span className="text-orange-200">{error}</span>
            </div>
          )}
          
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 text-shadow">
              Good evening
            </h1>
            <p className="text-xl text-white opacity-90 mb-8">
              Let's find something amazing to listen to
            </p>
            {topTracks.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="spotify-button inline-flex items-center space-x-2"
              >
                <Play size={20} />
                <span>Play Top Hits</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-12">
        {/* Featured Playlists Section */}
        {topAlbums.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Popular right now</h2>
              <button className="text-spotify-light-gray hover:text-white text-sm font-bold hover:underline">
                Show all
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topAlbums.slice(0, 8).map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Popular right now</h2>
            <div className="text-center py-12">
              <Music size={48} className="text-spotify-light-gray mx-auto mb-4" />
              <p className="text-spotify-light-gray">Loading popular albums...</p>
            </div>
          </section>
        )}

        {/* Top Artists Section */}
        {topArtists.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Popular artists</h2>
              <button className="text-spotify-light-gray hover:text-white text-sm font-bold hover:underline">
                Show all
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {topArtists.slice(0, 6).map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Popular artists</h2>
            <div className="text-center py-12">
              <Music size={48} className="text-spotify-light-gray mx-auto mb-4" />
              <p className="text-spotify-light-gray">Loading popular artists...</p>
            </div>
          </section>
        )}

        {/* Top Charts Section */}
        {topTracks.length > 0 ? (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Top Charts</h2>
              <button className="text-spotify-light-gray hover:text-white text-sm font-bold hover:underline">
                Show all
              </button>
            </div>
            <div className="bg-spotify-medium-gray bg-opacity-50 rounded-lg p-6">
              <TrackList tracks={topTracks.slice(0, 10)} />
            </div>
          </section>
        ) : (
          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Top Charts</h2>
            <div className="text-center py-12">
              <Music size={48} className="text-spotify-light-gray mx-auto mb-4" />
              <p className="text-spotify-light-gray">Loading top tracks...</p>
            </div>
          </section>
        )}

        {/* Quick Picks Section */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6">Made for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Discover Weekly",
                description: "Your weekly mixtape of fresh music",
                cover: "/placeholder.svg",
                gradient: "from-purple-600 to-blue-600"
              },
              {
                title: "Release Radar",
                description: "Catch all the latest music from artists you follow",
                cover: "/placeholder.svg",
                gradient: "from-green-600 to-teal-600"
              },
              {
                title: "Daily Mix 1",
                description: "Made for you",
                cover: "/placeholder.svg",
                gradient: "from-orange-600 to-red-600"
              }
            ].map((playlist, index) => (
              <div
                key={index}
                className={`spotify-card bg-gradient-to-br ${playlist.gradient} relative overflow-hidden group`}
              >
                <div className="p-6">
                  <h3 className="text-white font-bold text-xl mb-2">{playlist.title}</h3>
                  <p className="text-white opacity-80 text-sm">{playlist.description}</p>
                </div>
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white bg-opacity-10 rounded-full transform rotate-12 group-hover:rotate-6 transition-transform"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
