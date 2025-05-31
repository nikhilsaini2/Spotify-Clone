
import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { musicApi } from '../services/musicApi';
import { Track, Artist, Album } from '../types/music';
import TrackList from '../components/TrackList';
import ArtistCard from '../components/ArtistCard';
import AlbumCard from '../components/AlbumCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'tracks' | 'artists' | 'albums'>('all');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const popularGenres = [
    { name: 'Pop', color: 'from-pink-500 to-purple-500', id: '132' },
    { name: 'Hip-Hop', color: 'from-orange-500 to-red-500', id: '116' },
    { name: 'Rock', color: 'from-gray-600 to-gray-800', id: '152' },
    { name: 'Electronic', color: 'from-cyan-500 to-blue-500', id: '106' },
    { name: 'Jazz', color: 'from-yellow-600 to-orange-600', id: '129' },
    { name: 'Classical', color: 'from-purple-600 to-indigo-600', id: '98' },
    { name: 'Country', color: 'from-green-600 to-yellow-600', id: '108' },
    { name: 'R&B', color: 'from-red-600 to-pink-600', id: '165' },
  ];

  const searchSuggestions = [
    'trending hits', 'top charts', 'new releases', 'popular songs',
    'electronic music', 'hip hop beats', 'acoustic covers', 'jazz classics'
  ];

  useEffect(() => {
    if (query.trim()) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const results = await musicApi.search(query);
          setTracks(results.tracks);
          setArtists(results.artists);
          setAlbums(results.albums);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setTracks([]);
      setArtists([]);
      setAlbums([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      const filtered = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleGenreClick = async (genreId: string, genreName: string) => {
    setLoading(true);
    try {
      const results = await musicApi.search(genreName);
      setTracks(results.tracks);
      setArtists(results.artists);
      setAlbums(results.albums);
      setQuery(genreName);
      setActiveTab('all');
    } catch (error) {
      console.error('Genre search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasResults = tracks.length > 0 || artists.length > 0 || albums.length > 0;

  return (
    <div className="min-h-screen bg-spotify-dark-gray p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-spotify-light-gray" />
            </div>
            <input
              type="text"
              value={query}
              onChange={handleSearchInputChange}
              onFocus={() => query && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="What do you want to listen to?"
              className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-black font-medium focus:outline-none focus:ring-2 focus:ring-spotify-green placeholder-gray-500"
            />
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-spotify-medium-gray rounded-lg shadow-lg border border-gray-700 z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 text-white hover:bg-spotify-light-gray hover:bg-opacity-20 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <SearchIcon size={16} className="text-spotify-light-gray" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {!query.trim() ? (
          /* Browse Categories */
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Browse all</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularGenres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre.id, genre.name)}
                  className={`relative bg-gradient-to-br ${genre.color} rounded-lg p-6 h-32 overflow-hidden group hover:scale-105 transition-transform duration-200`}
                >
                  <h3 className="text-white font-bold text-xl">{genre.name}</h3>
                  <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white bg-opacity-20 rounded-lg transform rotate-12 group-hover:rotate-6 transition-transform"></div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green mx-auto mb-4"></div>
                  <p className="text-white">Searching...</p>
                </div>
              </div>
            ) : hasResults ? (
              <div>
                {/* Tab Navigation */}
                <div className="flex space-x-6 mb-8">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'tracks', label: 'Songs' },
                    { key: 'artists', label: 'Artists' },
                    { key: 'albums', label: 'Albums' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`px-4 py-2 rounded-full font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'bg-white text-black'
                          : 'bg-spotify-medium-gray text-white hover:bg-opacity-80'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Results */}
                <div className="space-y-12">
                  {(activeTab === 'all' || activeTab === 'tracks') && tracks.length > 0 && (
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-6">Songs</h3>
                      <TrackList tracks={activeTab === 'all' ? tracks.slice(0, 5) : tracks} />
                      {activeTab === 'all' && tracks.length > 5 && (
                        <button
                          onClick={() => setActiveTab('tracks')}
                          className="mt-4 text-spotify-light-gray hover:text-white text-sm font-bold hover:underline"
                        >
                          Show all songs
                        </button>
                      )}
                    </section>
                  )}

                  {(activeTab === 'all' || activeTab === 'artists') && artists.length > 0 && (
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-6">Artists</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {(activeTab === 'all' ? artists.slice(0, 6) : artists).map((artist) => (
                          <ArtistCard key={artist.id} artist={artist} />
                        ))}
                      </div>
                      {activeTab === 'all' && artists.length > 6 && (
                        <button
                          onClick={() => setActiveTab('artists')}
                          className="mt-4 text-spotify-light-gray hover:text-white text-sm font-bold hover:underline"
                        >
                          Show all artists
                        </button>
                      )}
                    </section>
                  )}

                  {(activeTab === 'all' || activeTab === 'albums') && albums.length > 0 && (
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-6">Albums</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(activeTab === 'all' ? albums.slice(0, 8) : albums).map((album) => (
                          <AlbumCard key={album.id} album={album} />
                        ))}
                      </div>
                      {activeTab === 'all' && albums.length > 8 && (
                        <button
                          onClick={() => setActiveTab('albums')}
                          className="mt-4 text-spotify-light-gray hover:text-white text-sm font-bold hover:underline"
                        >
                          Show all albums
                        </button>
                      )}
                    </section>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <SearchIcon size={64} className="text-spotify-light-gray mx-auto mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">No results found for "{query}"</h3>
                <p className="text-spotify-light-gray">Please make sure your words are spelled correctly or use less or different keywords.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
