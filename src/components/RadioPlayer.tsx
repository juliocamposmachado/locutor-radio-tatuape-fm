import React, { useState, useEffect } from 'react';
import { getShoutcastData, ShoutcastData } from '../services/trackService';

interface RadioPlayerProps {
  className?: string;
}

declare global {
  interface Window {
    mtPlayer: any;
    openRadioTable: (slug: string) => void;
    mytuner_vars: any;
  }
}

const RadioPlayer: React.FC<RadioPlayerProps> = ({ className = "" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shoutcastData, setShoutcastData] = useState<ShoutcastData | null>(null);
  const [lastFetchedTrackKey, setLastFetchedTrackKey] = useState<string>('');

  const radioData = {
    id: 490545,
    name: "Rádio Tatuape FM",
    slug: "radio-tatuape-fm",
    image: "https://static.mytuner.mobi/media/tvos_radios/545/radio-tatuape-fm.b636f170.jpg",
    slogan: "Nitro Rádio It's Just Culture",
    categories: "Classic Rock, Alternative Rock, 80s"
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.mytuner_vars = window.mytuner_vars || {};
      window.mytuner_vars.radio_names = [radioData.name];
      window.mytuner_vars.radio_images = [radioData.image];
      window.mytuner_vars.radio_playlists = [[{
        'cipher': 'C2cuuCNpG+1LTaU6/uWAtiaJ/KkjBRfbzY11Cs6A1eOypYEFkO6IB95fPB3Ir4soKTXkilWEphUB5Cyr1dKZbg==',
        'iv': '8a68516b31e7e2255fcc221add8745bf',
        'type': 'mp3',
        'is_https': 'false'
      }]];
      window.mytuner_vars.radio_urls = [`/${radioData.slug}`];
      window.mytuner_vars.radio_slugs = [radioData.slug];
      window.mytuner_vars.radio_ids = [radioData.id];
      window.mytuner_vars.sync = '<style>.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}</style><g class="spinner_V8m1"><circle cx="12" cy="12" r="9.5" fill="none" stroke="#000" stroke-width="3"></circle></g>';
      window.mytuner_vars.pause = '<path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"/>';
      window.mytuner_vars.play_arrow = '<path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>';

      window.openRadioTable = () => {
        handlePlayToggle();
      };

      loadExternalScripts();
    }
  }, []);

  useEffect(() => {
    const fetchShoutcastData = async () => {
      try {
        const data = await getShoutcastData();
        if (data) {
          const currentTrackKey = `${data.current.artist}-${data.current.title}`;
          if (currentTrackKey !== lastFetchedTrackKey) {
            setShoutcastData(data);
            setLastFetchedTrackKey(currentTrackKey);
          }
        }
      } catch (error) {
        console.error("Error fetching Shoutcast data:", error);
      }
    };

    fetchShoutcastData();
    const interval = setInterval(fetchShoutcastData, 15000); // Fetch every 15 seconds

    return () => clearInterval(interval);
  }, [lastFetchedTrackKey]);

  const loadExternalScripts = () => {
    const sm2Script = document.createElement('script');
    sm2Script.src = 'https://cdn.mytuner.mobi/static/ctr/js/sm2/soundmanager2-nodebug-jsmin.js';
    sm2Script.async = true;
    document.head.appendChild(sm2Script);

    const playerScript = document.createElement('script');
    playerScript.src = 'https://cdn.mytuner.mobi/static/ctr/js/radio-player.min.js?2e9d2d56';
    playerScript.async = true;
    document.head.appendChild(playerScript);
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setIsLoading(false);
      if (window.mtPlayer && typeof window.mtPlayer.stop === 'function') {
        window.mtPlayer.stop();
      }
    } else {
      setIsLoading(true);
      setIsPlaying(false);

      setTimeout(() => {
        setIsLoading(false);
        setIsPlaying(true);

        if (window.mtPlayer && typeof window.mtPlayer.play === 'function') {
          window.mtPlayer.play();
        }
      }, 1500);
    }
  };

  const getButtonIcon = () => {
    if (isLoading) {
      return (
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
      );
    } else if (isPlaying) {
      return (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"/>
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/>
        </svg>
      );
    }
  };

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="mb-6 text-center">
          <h3 className="font-bold text-2xl text-slate-800 mb-2">
            {radioData.name}
          </h3>
          <p className="text-sm text-slate-600 italic mb-3">
            {radioData.slogan}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            {radioData.categories}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-6">
          <div className="flex-shrink-0">
            <img
              src={radioData.image}
              alt={radioData.name}
              className="w-24 h-24 rounded-xl object-cover shadow-lg cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105"
              onClick={handlePlayToggle}
            />
          </div>

          <div className="flex-shrink-0">
            <button
              className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-200 transform hover:scale-110 disabled:opacity-50"
              onClick={handlePlayToggle}
              aria-label={isPlaying ? "Pause" : "Play"}
              disabled={isLoading}
            >
              {getButtonIcon()}
            </button>
          </div>
        </div>

        {shoutcastData && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 mb-1">Tocando Agora</p>
              <h4 className="font-bold text-lg text-slate-800 truncate">
                {shoutcastData.current.title}
              </h4>
              <p className="text-sm text-slate-600 truncate">
                {shoutcastData.current.artist}
              </p>
            </div>

            {shoutcastData.history.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100">
                <p className="text-xs font-semibold text-slate-600 mb-2">Últimas Músicas</p>
                <ul className="space-y-2">
                  {shoutcastData.history.slice(0, 3).map((track, index) => (
                    <li key={index} className="text-sm text-slate-700 truncate">
                      <span className="font-medium">{track.trackName}</span> por {track.artist}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isLoading ? 'bg-yellow-500 animate-pulse' :
              isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-400'
            }`}></div>
            <span className="text-sm font-semibold text-slate-700">
              {isLoading ? 'Conectando...' : isPlaying ? 'AO VIVO' : 'Clique para ouvir'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
