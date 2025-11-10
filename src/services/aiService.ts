// djCommentGenerator.ts
import { TrackInfo } from './trackService';

const GEMINI_API_KEY = 'AIzaSyDCSJU3d1x8n_yiajybqJ9Ylym0ii35wj4';
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const generateTrackComment = async (track: TrackInfo): Promise<string> => {
  const prompt = `
Você é a DJ Virtual Juliette Psicose, locutora carismática e empolgada da Rádio Tatuapé FM — a casa do rock clássico e alternativo dos anos 80.

Música tocando agora: "${track.trackName}" de ${track.artist}${
    track.album ? `, do álbum ${track.album}` : ''
  }.

Crie um comentário CURTO e ANIMADO (máximo 3 frases) para entrar ao vivo.

REQUISITOS:
- Comece com: "Olá, aqui é a DJ Virtual Juliette Psicose da Tatuapé FM!"
- Seja alegre, profissional e com personalidade de quem ama música.
- Diga algo interessante, divertido ou curioso sobre a banda ou o clima da música.
- Evite repetições e clichês, soe natural como um locutor experiente.
- Use energia positiva, entusiasmo e tom humano.
`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 1.0,
          topP: 0.9,
          maxOutputTokens: 250,
        },
      }),
    });

    if (!response.ok) {
      console.error('Erro na API do Gemini:', response.status);
      return generateFallbackComment(track);
    }

    const data = await response.json();
    const comment = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return comment ? comment.trim() : generateFallbackComment(track);
  } catch (error) {
    console.error('Erro ao gerar comentário:', error);
    return generateFallbackComment(track);
  }
};

const generateFallbackComment = (track: TrackInfo): string => {
  const comments = [
    `Olá, aqui é a DJ Virtual Juliette Psicose! ${track.artist} detonando com "${track.trackName}" — puro poder sonoro! Aumenta esse volume!`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Tatuapé FM! "${track.trackName}" é daquelas faixas que fazem a alma vibrar. Clássico absoluto!`,
    `Fala, galera! DJ Virtual Juliette Psicose por aqui! ${track.artist} mostrando como se faz com "${track.trackName}" — rock de verdade, sem filtros!`,
    `Alô, ouvintes! Aqui é a DJ Virtual Juliette Psicose — e o que dizer dessa pedrada sonora de ${track.artist}? "${track.trackName}" é puro combustível!`,
    `Juliette Psicose no ar! E essa aqui é pra quem vive o rock com o coração — "${track.trackName}" de ${track.artist}. Espetacular!`,
    `DJ Virtual Juliette Psicose aqui, direto da Tatuapé FM! ${track.artist} com "${track.trackName}" — essa dispensa apresentações!`,
    `Sabe aquela música que arrepia até a alma? É essa! "${track.trackName}" de ${track.artist}, tocando alto aqui na Tatuapé FM.`,
    `Juliette Psicose ao vivo! Se você curte guitarra e atitude, segura essa pancada de ${track.artist}: "${track.trackName}"!`,
    `Clássico dos clássicos! ${track.artist} com "${track.trackName}" — uma viagem sonora direto pros anos de ouro do rock.`,
    `Olá, meus amigos do rock! DJ Virtual Juliette Psicose na área com ${track.artist} — e essa "${track.trackName}" é pura nostalgia sonora.`,
    `Juliette Psicose na sintonia! Essa de ${track.artist} — "${track.trackName}" — é pra quem vive e respira música de verdade.`,
    `Tem coisa melhor do que começar o dia com ${track.artist}? "${track.trackName}" está incendiando o estúdio agora mesmo!`,
    `Noite boa, som potente e ${track.artist} detonando com "${track.trackName}" — é assim que a Tatuapé FM vibra!`,
    `Se liga nesse som! ${track.artist} mandando ver com "${track.trackName}" — rock com alma, é o que a gente ama!`,
    `Juliette Psicose chamando todos os roqueiros! ${track.artist} no comando com "${track.trackName}" — aumenta o som e sente a energia!`,
    `Essa é pra recordar os bons tempos! "${track.trackName}" de ${track.artist} — trilha sonora de muitas histórias.`,
    `DJ Virtual Juliette Psicose aqui! ${track.artist} trazendo uma vibe poderosa com "${track.trackName}" — um hino eterno!`,
    `Tatuapé FM no clima do rock! ${track.artist} e "${track.trackName}" — música que atravessa gerações!`,
    `Prepare-se pra viajar no tempo! "${track.trackName}" de ${track.artist} é pura história viva do rock.`,
    `É impossível ficar parado com essa! ${track.artist} com "${track.trackName}" — energia que contagia!`,
    `O estúdio está pegando fogo! ${track.artist} com "${track.trackName}" — e o som não para aqui na Tatuapé FM!`,
    `DJ Virtual Juliette Psicose aqui, lembrando: o rock vive enquanto você sentir o som. ${track.artist} com "${track.trackName}"!`,
    `Pra quem achava que o rock tinha morrido... escuta isso! ${track.artist} com "${track.trackName}" — viva o som que liberta!`,
    `Se existe trilha sonora pra liberdade, é essa aqui! ${track.artist} mandando ver com "${track.trackName}"!`,
    `Essa vai pra quem vive com o coração acelerado pelo som! ${track.artist} e "${track.trackName}" — rock de raiz!`,
    `Juliette Psicose com vocês — e agora, o peso e a poesia de ${track.artist} em "${track.trackName}"!`,
    `O vinil girou, a agulha desceu, e o som é lendário: "${track.trackName}" de ${track.artist} na Tatuapé FM!`,
    `Essa é daquelas músicas que o tempo não apaga! ${track.artist} com "${track.trackName}" — uma joia sonora!`,
    `O clima esquentou no estúdio! ${track.artist} detonando com "${track.trackName}" — vibração pura!`,
    `Sente o groove, sente o poder! ${track.artist} tocando "${track.trackName}" — e o rock continua mais vivo do que nunca!`,
    `Tatuapé FM é pura energia com ${track.artist}! "${track.trackName}" tá rolando pra embalar o seu momento agora!`,
  ];

  return comments[Math.floor(Math.random() * comments.length)];
};
