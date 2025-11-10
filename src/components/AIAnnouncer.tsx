import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Radio, Volume2 } from 'lucide-react';
import { getCurrentTrack, TrackInfo } from '../services/trackService';
import { generateTrackComment } from '../services/aiService';
import { speakText, stopSpeaking, isSpeaking, loadVoices } from '../services/speechService';

const AIAnnouncer: React.FC = () => {
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastTrackKey, setLastTrackKey] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState(true);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadVoices();

    if (isEnabled) {
      checkForNewTrack();
      checkIntervalRef.current = setInterval(checkForNewTrack, 60000);
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      stopSpeaking();
    };
  }, [isEnabled]);

  const checkForNewTrack = async () => {
    if (isSpeaking() || isGenerating) {
      return;
    }

    try {
      const track = await getCurrentTrack();

      if (!track) {
        return;
      }

      const trackKey = `${track.artist}-${track.trackName}`;

      if (trackKey !== lastTrackKey) {
        setLastTrackKey(trackKey);
        setCurrentTrack(track);
        await generateAndSpeakComment(track);
      }
    } catch (error) {
      console.error('Erro ao verificar música:', error);
    }
  };

  const generateAndSpeakComment = async (track: TrackInfo) => {
    if (!isEnabled) return;

    setIsGenerating(true);

    try {
      const aiComment = await generateTrackComment(track);
      setComment(aiComment);

      setIsSpeakingNow(true);
      await speakText(aiComment);
      setIsSpeakingNow(false);
    } catch (error) {
      console.error('Erro ao gerar/falar comentário:', error);
      setIsSpeakingNow(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggle = () => {
    if (isSpeakingNow) {
      stopSpeaking();
      setIsSpeakingNow(false);
    }
    setIsEnabled(!isEnabled);
  };

  const handleManualTrigger = () => {
    if (currentTrack && !isSpeakingNow && !isGenerating) {
      generateAndSpeakComment(currentTrack);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-2xl border border-blue-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Radio className="w-6 h-6" />
            <h2 className="text-xl font-bold">DJ Virtual - Tatuape FM</h2>
          </div>
          <button
            onClick={handleToggle}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isEnabled
                ? 'bg-white/20 hover:bg-white/30'
                : 'bg-red-500/30 hover:bg-red-500/40'
            }`}
            title={isEnabled ? 'Desativar DJ Virtual' : 'Ativar DJ Virtual'}
          >
            {isEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="p-6">
        {currentTrack ? (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-slate-800 truncate">
                    {currentTrack.trackName}
                  </h3>
                  <p className="text-sm text-slate-600 truncate">{currentTrack.artist}</p>
                  {currentTrack.album && (
                    <p className="text-xs text-slate-500 mt-1 truncate">{currentTrack.album}</p>
                  )}
                </div>
              </div>
            </div>

            {comment && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 shadow-md border border-amber-200">
                <div className="flex items-start space-x-2">
                  <span className="text-2xl">🎙️</span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 leading-relaxed italic">
                      "{comment}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isSpeakingNow
                      ? 'bg-red-500 animate-pulse'
                      : isGenerating
                      ? 'bg-yellow-500 animate-pulse'
                      : isEnabled
                      ? 'bg-green-500'
                      : 'bg-slate-400'
                  }`}
                ></div>
                <span className="text-sm font-medium text-slate-700">
                  {isSpeakingNow
                    ? 'Falando ao vivo...'
                    : isGenerating
                    ? 'Gerando comentário...'
                    : isEnabled
                    ? 'Ativa e monitorando'
                    : 'Desativada'}
                </span>
              </div>

              {isEnabled && !isSpeakingNow && !isGenerating && (
                <button
                  onClick={handleManualTrigger}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                >
                  Comentar Agora
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Radio className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <p className="text-slate-600 font-medium">Aguardando próxima música...</p>
            <p className="text-sm text-slate-500 mt-2">
              A DJ Virtual comentará automaticamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnnouncer;
