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

const SHOUTCAST_BASE_URL = 'http://uk7freenew.listen2myradio.com:16784';
const ADMIN_USER = 'admin';
const ADMIN_PASS = '784512235689';

const parseShoutcastHtml = (html: string): { artist: string; title: string } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const firstRow = doc.querySelector('table.border_color_2 > tbody > tr:nth-child(2)');

  if (firstRow) {
    const songTitleCell = firstRow.querySelector('td:nth-child(2)');
    if (songTitleCell) {
      const fullSongTitle = songTitleCell.textContent || '';
      const songParts = fullSongTitle.split(' - ');
      if (songParts.length >= 2) {
        return {
          artist: songParts[0].trim(),
          title: songParts.slice(1).join(' - ').replace('Current Song', '').trim(),
        };
      } else {
        return { artist: 'Artista Desconhecido', title: fullSongTitle.replace('Current Song', '').trim() };
      }
    }
  }
  return { artist: 'Artista Desconhecido', title: 'Música Desconhecida' };
};

const parseHistoryHtml = (html: string): TrackInfo[] => {
  const history: TrackInfo[] = [];
  const lines = html.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    // Example: 01:11:48	Lady Wray - They won't hang around	Current Song
    const match = trimmedLine.match(/^\d{2}:\d{2}:\d{2}\t(.+?)\s-\s(.+?)(?:\tCurrent Song)?$/);

    if (match && match[1] && match[2]) {
      const artist = match[1].trim();
      const title = match[2].trim();

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
    if (history.length >= 4) break; // Get current + 3 previous
  }

  return history;
};

export const getShoutcastData = async (): Promise<ShoutcastData | null> => {
  try {
    // Fetch current song from played.html
    const currentSongUrl = `${SHOUTCAST_BASE_URL}/played.html`;
    const currentSongResponse = await fetch(currentSongUrl, {
      method: 'GET',
    });

    if (!currentSongResponse.ok) {
      console.error('Erro ao buscar dados atuais do Shoutcast');
      return null;
    }

    const currentSongHtml = await currentSongResponse.text();
    const { artist, title } = parseShoutcastHtml(currentSongHtml);

    // Fetch history from viewlog
    let history: TrackInfo[] = [];
    try {
      const historyUrl = `${SHOUTCAST_BASE_URL}/admin.cgi?mode=viewlog&user=${ADMIN_USER}&pass=${ADMIN_PASS}`;
      const historyResponse = await fetch(historyUrl, {
        method: 'GET',
      });

      if (historyResponse.ok) {
        const historyText = await historyResponse.text();
        history = parseHistoryHtml(historyText);
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
    console.error('Erro ao buscar dados do Shoutcast', error);
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
