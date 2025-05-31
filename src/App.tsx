
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicProvider } from "./context/MusicContext";
import Sidebar from "./components/Sidebar";
import MusicPlayer from "./components/MusicPlayer";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import RecentlyPlayed from "./pages/RecentlyPlayed";
import ArtistPage from "./pages/ArtistPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MusicProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex h-screen bg-spotify-black overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-24">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/liked-songs" element={<LikedSongs />} />
                <Route path="/recent" element={<RecentlyPlayed />} />
                <Route path="/create-playlist" element={<div className="p-8 text-white">Create Playlist - Coming Soon!</div>} />
                <Route path="/artist/:id" element={<ArtistPage />} />
                <Route path="/album/:id" element={<div className="p-8 text-white">Album Page - Coming Soon!</div>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <MusicPlayer />
          </div>
        </BrowserRouter>
      </MusicProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
