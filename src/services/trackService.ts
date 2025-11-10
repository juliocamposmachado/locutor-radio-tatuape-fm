export interface TrackInfo {
  trackName: string;
  artist: string;
  album?: string;
}

export interface ShoutcastData {
  current: {
    currentSong: string;
    artist: string;
    title: string;
    listeners: number;
    peakListeners: number;
    streamTitle: string;
    streamGenre: string;
  };
  history: TrackInfo[];
  timestamp: string;
}

const SHOUTCAST_URL = 'http://uk7freenew.listen2myradio.com:16784/played.html';
const ADMIN_USER = 'admin';
const ADMIN_PASS = '784512235689';

const parseShoutcastHtml = (html: string): { artist: string; title: string } => {
  const songMatch = html.match(/Current Song:<\/b>\s*([^<]+)/);
  const currentSong = songMatch ? songMatch[1].trim() : 'Desconhecida';

  const songParts = currentSong.match(/^(.+?)\s*-\s*(.+?)(?:\s*\(\d+\))?$/);

  if (songParts) {
    return {
      artist: songParts[1].trim(),
      title: songParts[2].trim(),
    };
  }

  return {
    artist: 'Artista Desconhecido',
    title: currentSong,
  };
};

const parseHistoryHtml = (html: string): TrackInfo[] => {
  const history: TrackInfo[] = [];
  const lines = html.split('\n');

  for (let i = 0; i < Math.min(lines.length, 200); i++) {
    const line = lines[i];

    if (line.includes('</tr>') || line.includes('</td>')) {
      const cleanedLine = line
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .trim();

      if (cleanedLine && cleanedLine.length > 5 && history.length < 5) {
        const parts = cleanedLine.split(' - ');

        if (parts.length >= 2) {
          const artist = parts[1]?.trim();
          const title = parts[2]?.trim() || parts.slice(2).join(' - ').trim();

          if (artist && title && artist.length > 1 && title.length > 1) {
            const isDuplicate = history.some(h => h.artist === artist && h.trackName === title);
            if (!isDuplicate) {
              history.push({
                artist,
                trackName: title,
              });
            }
          }
        }
      }
    }
  }

  return history.slice(0, 5);
};

export const getShoutcastData = async (): Promise<ShoutcastData | null> => {
  try {
    const currentUrl = `${SHOUTCAST_URL}/admin.cgi?user=${ADMIN_USER}&pass=${ADMIN_PASS}`;
    const currentResponse = await fetch(currentUrl, {
      method: 'GET',
    });

    if (!currentResponse.ok) {
      console.error('Erro ao buscar dados atuais do Shoutcast');
      return null;
    }

    const currentHtml = await currentResponse.text();
    const { artist, title } = parseShoutcastHtml(currentHtml);

    let history: TrackInfo[] = [];
    try {
      const historyUrl = `${SHOUTCAST_URL}/admin.cgi?mode=viewlog&user=${ADMIN_USER}&pass=${ADMIN_PASS}`;
      const historyResponse = await fetch(historyUrl, {
        method: 'GET',
      });

      if (historyResponse.ok) {
        const historyHtml = await historyResponse.text();
        history = parseHistoryHtml(historyHtml);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }

    return {
      current: {
        currentSong: `${artist} - ${title}`,
        artist,
        title,
        listeners: 0,
        peakListeners: 0,
        streamTitle: 'Rádio Tatuape FM',
        streamGenre: 'Rock',
      },
      history,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Erro ao buscar dados do Shoutcast:', error);
    return null;
  }
};

export const getCurrentTrack = async (): Promise<TrackInfo | null> => {
  try {
    const data = await getShoutcastData();

    if (data && data.current.artist && data.current.title) {
      return {
        trackName: data.current.title,
        artist: data.current.artist,
      };
    }

    return generateMockTrack();
  } catch (error) {
    console.error('Erro na requisição:', error);
    return generateMockTrack();
  }
};

const generateMockTrack = (): TrackInfo => {
  const mockTracks: TrackInfo[] = [
    { trackName: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera' },
    { trackName: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV' },
    { trackName: 'Hotel California', artist: 'Eagles', album: 'Hotel California' },
    { trackName: "Sweet Child O' Mine", artist: "Guns N' Roses", album: 'Appetite for Destruction' },
    { trackName: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind' },
    { trackName: 'November Rain', artist: "Guns N' Roses", album: 'Use Your Illusion I' },
    { trackName: 'Nothing Else Matters', artist: 'Metallica', album: 'Metallica' },
    { trackName: 'Paradise City', artist: "Guns N' Roses", album: 'Appetite for Destruction' },
    { trackName: 'Come As You Are', artist: 'Nirvana', album: 'Nevermind' },
    { trackName: 'Under the Bridge', artist: 'Red Hot Chili Peppers', album: 'Blood Sugar Sex Magik' },
  ];

  return mockTracks[Math.floor(Math.random() * mockTracks.length)];
};
