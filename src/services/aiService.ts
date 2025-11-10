import { TrackInfo } from './trackService';

const GEMINI_API_KEY = 'AIzaSyDCSJU3d1x8n_yiajybqJ9Ylym0ii35wj4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const generateTrackComment = async (track: TrackInfo): Promise<string> => {
  const prompt = `Você é uma locutor Julio Campos Machado , animado e profissional da Rádio Tatuape FM, uma rádio de rock clássico e alternativo dos anos 80.

Música tocando agora: "${track.trackName}" de ${track.artist}${track.album ? ` do álbum ${track.album}` : ''}.

Crie um comentário CURTO e ANIMADO (máximo 3 frases) sobre esta música para entrar ao vivo na programação.

IMPORTANTE:
- Comece se apresentando: "Olá, aqui é o DJ Virtual Julio Campos Machadoda Tatuape FM!"
- Seja alegre, entusiasta e profissional
- Mencione algo interessante, inusitado ou curioso sobre a música ou banda
- Conecte-se com os ouvintes da rádio
- Mantenha o tom energético e empolgante
- NÃO seja repetitiva
- Fale naturalmente, como um locutor de rádio

Exemplo de estilo: "Olá, aqui é o DJ Virtual Julio Campos Machado da Tatuape FM! Acabamos de ouvir uma das maiores obras-primas do rock! Você sabia que essa música levou 6 meses para ser gravada? Fiquem ligados, a programação continua imperdível!"`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!response.ok) {
      console.error('Erro na API do Gemini:', response.status);
      return generateFallbackComment(track);
    }

    const data = await response.json();
    const comment = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!comment) {
      return generateFallbackComment(track);
    }

    return comment.trim();
  } catch (error) {
    console.error('Erro ao gerar comentário:', error);
    return generateFallbackComment(track);
  }
};

const generateFallbackComment = (track: TrackInfo): string => {
  const comments = [
    `Olá, aqui é o DJ Virtual Julio Campos Machado Que som incrível de ${track.artist}! "${track.trackName}" é daquelas músicas que nunca saem de moda. Aproveitem e aumentem o volume!`,
    `Olá, aqui é o DJ Virtual Julio Campos Machado! ${track.artist} arrasando com "${track.trackName}"! Uma verdadeira lenda do rock tocando agora na nossa programação. Continuem ligados!`,
    `Olá, aqui é o DJ Virtual Julio Campos Machado! Que clássico maravilhoso! "${track.trackName}" de ${track.artist} é pura nostalgia e energia. A Tatuape FM não para!`,
    `Olá, aqui é o DJ Virtual Julio Campos Machado! ${track.artist} com "${track.trackName}" - simplesmente imperdível! Essa música tem uma história incrível. Fiquem com a gente!`,
  ];

  return comments[Math.floor(Math.random() * comments.length)];
};
