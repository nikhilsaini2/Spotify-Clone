
import { Track, Artist, Album, SearchResults } from '../types/music';

// Fallback data for when API fails
const fallbackTracks: Track[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: { id: '1', name: 'The Weeknd', picture: '/placeholder.svg' },
    album: { id: '1', title: 'After Hours', cover: '/placeholder.svg' },
    duration: 200,
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    rank: 1
  },
  {
    id: '2',
    title: 'Watermelon Sugar',
    artist: { id: '2', name: 'Harry Styles', picture: '/placeholder.svg' },
    album: { id: '2', title: 'Fine Line', cover: '/placeholder.svg' },
    duration: 174,
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    rank: 2
  },
  {
    id: '3',
    title: 'Levitating',
    artist: { id: '3', name: 'Dua Lipa', picture: '/placeholder.svg' },
    album: { id: '3', title: 'Future Nostalgia', cover: '/placeholder.svg' },
    duration: 203,
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    rank: 3
  },
  {
    id: '4',
    title: 'Good 4 U',
    artist: { id: '4', name: 'Olivia Rodrigo', picture: '/placeholder.svg' },
    album: { id: '4', title: 'SOUR', cover: '/placeholder.svg' },
    duration: 178,
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    rank: 4
  },
  {
    id: '5',
    title: 'Stay',
    artist: { id: '5', name: 'The Kid LAROI & Justin Bieber', picture: '/placeholder.svg' },
    album: { id: '5', title: 'Stay', cover: '/placeholder.svg' },
    duration: 141,
    preview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    rank: 5
  }
];

const fallbackArtists: Artist[] = [
  {
    id: '1',
    name: 'The Weeknd',
    picture: '/placeholder.svg',
    nb_fan: 50000000
  },
  {
    id: '2',
    name: 'Harry Styles',
    picture: '/placeholder.svg',
    nb_fan: 40000000
  },
  {
    id: '3',
    name: 'Dua Lipa',
    picture: '/placeholder.svg',
    nb_fan: 35000000
  },
  {
    id: '4',
    name: 'Olivia Rodrigo',
    picture: '/placeholder.svg',
    nb_fan: 30000000
  }
];

const fallbackAlbums: Album[] = [
  {
    id: '1',
    title: 'After Hours',
    cover: '/placeholder.svg',
    artist: { id: '1', name: 'The Weeknd', picture: '/placeholder.svg' },
    release_date: '2020-03-20'
  },
  {
    id: '2',
    title: 'Fine Line',
    cover: '/placeholder.svg',
    artist: { id: '2', name: 'Harry Styles', picture: '/placeholder.svg' },
    release_date: '2019-12-13'
  },
  {
    id: '3',
    title: 'Future Nostalgia',
    cover: '/placeholder.svg',
    artist: { id: '3', name: 'Dua Lipa', picture: '/placeholder.svg' },
    release_date: '2020-03-27'
  },
  {
    id: '4',
    title: 'SOUR',
    cover: '/placeholder.svg',
    artist: { id: '4', name: 'Olivia Rodrigo', picture: '/placeholder.svg' },
    release_date: '2021-05-21'
  }
];

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

const DEEZER_API = 'https://api.deezer.com';

class MusicApiService {
  private currentProxyIndex = 0;
  private retryCount = 0;
  private maxRetries = 2;

  private async fetchWithCors(url: string): Promise<any> {
    for (let proxyIndex = 0; proxyIndex < CORS_PROXIES.length; proxyIndex++) {
      const proxy = CORS_PROXIES[(this.currentProxyIndex + proxyIndex) % CORS_PROXIES.length];
      
      for (let retry = 0; retry <= this.maxRetries; retry++) {
        try {
          console.log(`Attempting API call with proxy ${proxyIndex + 1}, retry ${retry + 1}`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
          
          const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
            signal: controller.signal,
            headers: {
              'Accept': 'application/json',
            }
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('API call successful');
          this.currentProxyIndex = (this.currentProxyIndex + proxyIndex) % CORS_PROXIES.length;
          return data;
          
        } catch (error) {
          console.error(`API request failed (proxy ${proxyIndex + 1}, retry ${retry + 1}):`, error);
          if (retry === this.maxRetries) {
            // Try next proxy
            break;
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (retry + 1)));
        }
      }
    }
    
    // All proxies and retries failed
    throw new Error('All API endpoints failed');
  }

  async search(query: string, limit: number = 20): Promise<SearchResults> {
    try {
      console.log(`Searching for: ${query}`);
      
      const [tracksResponse, artistsResponse, albumsResponse] = await Promise.allSettled([
        this.fetchWithCors(`${DEEZER_API}/search/track?q=${encodeURIComponent(query)}&limit=${limit}`),
        this.fetchWithCors(`${DEEZER_API}/search/artist?q=${encodeURIComponent(query)}&limit=${limit}`),
        this.fetchWithCors(`${DEEZER_API}/search/album?q=${encodeURIComponent(query)}&limit=${limit}`)
      ]);

      const tracks = tracksResponse.status === 'fulfilled' && tracksResponse.value?.data 
        ? tracksResponse.value.data.map(this.formatTrack) 
        : this.searchFallbackTracks(query);
        
      const artists = artistsResponse.status === 'fulfilled' && artistsResponse.value?.data 
        ? artistsResponse.value.data.map(this.formatArtist) 
        : this.searchFallbackArtists(query);
        
      const albums = albumsResponse.status === 'fulfilled' && albumsResponse.value?.data 
        ? albumsResponse.value.data.map(this.formatAlbum) 
        : this.searchFallbackAlbums(query);

      return { tracks, artists, albums };
    } catch (error) {
      console.error('Search failed, using fallback data:', error);
      return {
        tracks: this.searchFallbackTracks(query),
        artists: this.searchFallbackArtists(query),
        albums: this.searchFallbackAlbums(query)
      };
    }
  }

  async getTopTracks(limit: number = 50): Promise<Track[]> {
    try {
      console.log('Fetching top tracks');
      const response = await this.fetchWithCors(`${DEEZER_API}/chart/0/tracks?limit=${limit}`);
      return response.data?.map(this.formatTrack) || fallbackTracks.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch top tracks, using fallback:', error);
      return fallbackTracks.slice(0, limit);
    }
  }

  async getTopArtists(limit: number = 20): Promise<Artist[]> {
    try {
      console.log('Fetching top artists');
      const response = await this.fetchWithCors(`${DEEZER_API}/chart/0/artists?limit=${limit}`);
      return response.data?.map(this.formatArtist) || fallbackArtists.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch top artists, using fallback:', error);
      return fallbackArtists.slice(0, limit);
    }
  }

  async getTopAlbums(limit: number = 20): Promise<Album[]> {
    try {
      console.log('Fetching top albums');
      const response = await this.fetchWithCors(`${DEEZER_API}/chart/0/albums?limit=${limit}`);
      return response.data?.map(this.formatAlbum) || fallbackAlbums.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch top albums, using fallback:', error);
      return fallbackAlbums.slice(0, limit);
    }
  }

  async getArtistTopTracks(artistId: string, limit: number = 20): Promise<Track[]> {
    try {
      const response = await this.fetchWithCors(`${DEEZER_API}/artist/${artistId}/top?limit=${limit}`);
      return response.data?.map(this.formatTrack) || [];
    } catch (error) {
      console.error('Failed to fetch artist top tracks:', error);
      return fallbackTracks.slice(0, limit);
    }
  }

  async getAlbumTracks(albumId: string): Promise<Track[]> {
    try {
      const response = await this.fetchWithCors(`${DEEZER_API}/album/${albumId}/tracks`);
      return response.data?.map(this.formatTrack) || [];
    } catch (error) {
      console.error('Failed to fetch album tracks:', error);
      return fallbackTracks;
    }
  }

  async getGenreTracks(genreId: string, limit: number = 20): Promise<Track[]> {
    try {
      const response = await this.fetchWithCors(`${DEEZER_API}/genre/${genreId}/artists`);
      if (response.data && response.data.length > 0) {
        const artistId = response.data[0].id;
        return this.getArtistTopTracks(artistId, limit);
      }
      return fallbackTracks.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch genre tracks:', error);
      return fallbackTracks.slice(0, limit);
    }
  }

  // Fallback search methods
  private searchFallbackTracks(query: string): Track[] {
    const lowercaseQuery = query.toLowerCase();
    return fallbackTracks.filter(track => 
      track.title.toLowerCase().includes(lowercaseQuery) ||
      track.artist.name.toLowerCase().includes(lowercaseQuery) ||
      track.album.title.toLowerCase().includes(lowercaseQuery)
    );
  }

  private searchFallbackArtists(query: string): Artist[] {
    const lowercaseQuery = query.toLowerCase();
    return fallbackArtists.filter(artist => 
      artist.name.toLowerCase().includes(lowercaseQuery)
    );
  }

  private searchFallbackAlbums(query: string): Album[] {
    const lowercaseQuery = query.toLowerCase();
    return fallbackAlbums.filter(album => 
      album.title.toLowerCase().includes(lowercaseQuery) ||
      album.artist.name.toLowerCase().includes(lowercaseQuery)
    );
  }

  private formatTrack = (track: any): Track => ({
    id: track.id?.toString() || Math.random().toString(),
    title: track.title || track.title_short || 'Unknown Title',
    artist: {
      id: track.artist?.id?.toString() || '0',
      name: track.artist?.name || 'Unknown Artist',
      picture: track.artist?.picture_medium || track.artist?.picture || '/placeholder.svg'
    },
    album: {
      id: track.album?.id?.toString() || '0',
      title: track.album?.title || 'Unknown Album',
      cover: track.album?.cover_medium || track.album?.cover || '/placeholder.svg',
      cover_medium: track.album?.cover_medium || track.album?.cover || '/placeholder.svg',
      cover_small: track.album?.cover_small || track.album?.cover || '/placeholder.svg'
    },
    duration: track.duration || 30,
    preview: track.preview || 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    rank: track.rank
  });

  private formatArtist = (artist: any): Artist => ({
    id: artist.id?.toString() || Math.random().toString(),
    name: artist.name || 'Unknown Artist',
    picture: artist.picture_medium || artist.picture || '/placeholder.svg',
    picture_medium: artist.picture_medium || artist.picture || '/placeholder.svg',
    picture_big: artist.picture_big || artist.picture || '/placeholder.svg',
    nb_fan: artist.nb_fan,
    nb_album: artist.nb_album
  });

  private formatAlbum = (album: any): Album => ({
    id: album.id?.toString() || Math.random().toString(),
    title: album.title || 'Unknown Album',
    cover: album.cover_medium || album.cover || '/placeholder.svg',
    cover_medium: album.cover_medium || album.cover || '/placeholder.svg',
    cover_big: album.cover_big || album.cover || '/placeholder.svg',
    artist: {
      id: album.artist?.id?.toString() || '0',
      name: album.artist?.name || 'Unknown Artist',
      picture: album.artist?.picture_medium || album.artist?.picture || '/placeholder.svg'
    },
    release_date: album.release_date
  });
}

export const musicApi = new MusicApiService();
