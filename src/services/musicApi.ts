
import { Track, Artist, Album, SearchResults } from '../types/music';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const DEEZER_API = 'https://api.deezer.com';

class MusicApiService {
  private async fetchWithCors(url: string) {
    try {
      const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async search(query: string, limit: number = 20): Promise<SearchResults> {
    try {
      const [tracksResponse, artistsResponse, albumsResponse] = await Promise.all([
        this.fetchWithCors(`${DEEZER_API}/search/track?q=${encodeURIComponent(query)}&limit=${limit}`),
        this.fetchWithCors(`${DEEZER_API}/search/artist?q=${encodeURIComponent(query)}&limit=${limit}`),
        this.fetchWithCors(`${DEEZER_API}/search/album?q=${encodeURIComponent(query)}&limit=${limit}`)
      ]);

      return {
        tracks: tracksResponse.data?.map(this.formatTrack) || [],
        artists: artistsResponse.data?.map(this.formatArtist) || [],
        albums: albumsResponse.data?.map(this.formatAlbum) || []
      };
    } catch (error) {
      console.error('Search failed:', error);
      return { tracks: [], artists: [], albums: [] };
    }
  }

  async getTopTracks(limit: number = 50): Promise<Track[]> {
    try {
      const response = await this.fetchWithCors(`${DEEZER_API}/chart/0/tracks?limit=${limit}`);
      return response.data?.map(this.formatTrack) || [];
    } catch (error) {
      console.error('Failed to fetch top tracks:', error);
      return [];
    }
  }

  async getTopArtists(limit: number = 20): Promise<Artist[]> {
    try {
      const response = await this.fetchWithCors(`${DEEZER_API}/chart/0/artists?limit=${limit}`);
      return response.data?.map(this.formatArtist) || [];
    } catch (error) {
      console.error('Failed to fetch top artists:', error);
      return [];
    }
  }

  async getTopAlbums(limit: number = 20): Promise<Album[]> {
    try {
      const response = await this.fetchWithCors(`${DEEZER_API}/chart/0/albums?limit=${limit}`);
      return response.data?.map(this.formatAlbum) || [];
    } catch (error) {
      console.error('Failed to fetch top albums:', error);
      return [];
    }
  }

  async getArtistTopTracks(artistId: string, limit: number = 20): Promise<Track[]> {
    try {
      const response = await this.fetchWithCors(`${DEEZER_API}/artist/${artistId}/top?limit=${limit}`);
      return response.data?.map(this.formatTrack) || [];
    } catch (error) {
      console.error('Failed to fetch artist top tracks:', error);
      return [];
    }
  }

  async getAlbumTracks(albumId: string): Promise<Track[]> {
    try {
      const response = await this.fetchWithCors(`${DEEZER_API}/album/${albumId}/tracks`);
      return response.data?.map(this.formatTrack) || [];
    } catch (error) {
      console.error('Failed to fetch album tracks:', error);
      return [];
    }
  }

  async getGenreTracks(genreId: string, limit: number = 20): Promise<Track[]> {
    try {
      const response = await this.fetchWithCors(`${DEEZER_API}/genre/${genreId}/artists`);
      if (response.data && response.data.length > 0) {
        const artistId = response.data[0].id;
        return this.getArtistTopTracks(artistId, limit);
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch genre tracks:', error);
      return [];
    }
  }

  private formatTrack = (track: any): Track => ({
    id: track.id.toString(),
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
    preview: track.preview || '',
    rank: track.rank
  });

  private formatArtist = (artist: any): Artist => ({
    id: artist.id.toString(),
    name: artist.name || 'Unknown Artist',
    picture: artist.picture_medium || artist.picture || '/placeholder.svg',
    picture_medium: artist.picture_medium || artist.picture || '/placeholder.svg',
    picture_big: artist.picture_big || artist.picture || '/placeholder.svg',
    nb_fan: artist.nb_fan,
    nb_album: artist.nb_album
  });

  private formatAlbum = (album: any): Album => ({
    id: album.id.toString(),
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
