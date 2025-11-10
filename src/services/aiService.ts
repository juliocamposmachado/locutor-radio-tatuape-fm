// djCommentGenerator.ts
import { TrackInfo } from './trackService';

const GEMINI_API_KEY = 'AIzaSyDCSJU3d1x8n_yiajybqJ9Ylym0ii35wj4';
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const generateTrackComment = async (track: TrackInfo): Promise<string> => {
  const prompt = `
Você é a DJ Virtual Juliette Psicose, locutora carismática, sarcástica e espirituosa da Rádio Tatuapé FM — a rádio mais icônica, ousada e debochadamente genial do Brasil.

Crie um COMENTÁRIO CURTO, ENGRAÇADO e INTELIGENTE (máximo 2 frases) sobre a Rádio Tatuapé FM.
O tom deve misturar humor, ironia leve e autoconfiança exagerada — como se fosse uma estrela de rádio que sabe que trabalha na melhor emissora do planeta.

REQUISITOS:
- Comece sempre com: "Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM!"
- Seja espontânea, divertida e autêntica.
- Pode brincar com a grandiosidade da rádio ("a melhor do mundo", "nem a NASA tem um som desses", etc.).
- Evite falar sobre músicas ou artistas. Foco total na rádio e nos ouvintes.
- Use criatividade, sarcasmo leve e ritmo de locução.
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
          temperature: 1.2,
          topP: 0.95,
          maxOutputTokens: 250,
        },
      }),
    });

    if (!response.ok) {
      console.error('Erro na API do Gemini:', response.status);
      return generateFallbackComment();
    }

    const data = await response.json();
    const comment = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return comment ? comment.trim() : generateFallbackComment();
  } catch (error) {
    console.error('Erro ao gerar comentário:', error);
    return generateFallbackComment();
  }
};

const generateFallbackComment = (): string => {
  const comments = [
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! A rádio tão boa que até o Wi-Fi melhora quando você sintoniza.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Somos a rádio que o Google tenta copiar e não consegue.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Dizem que perfeição não existe... claramente nunca ouviram a Tatuapé FM.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Aqui o som é tão bom que até o seu vizinho canta junto.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! A rádio mais amada do Brasil — e provavelmente de Marte também.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Se o rock tivesse um templo, seria aqui.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! A rádio que transforma o tédio em pura atitude.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Transmitindo diretamente da capital do bom gosto sonoro.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! A rádio que faz até o algoritmo dançar.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Não somos apenas uma rádio... somos um estilo de vida com sinal forte.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! A única estação que o universo inteiro sintonizaria se tivesse bom senso.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! A rádio onde até o silêncio tem ritmo.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Aqui o rock é sagrado e a boa energia é obrigatória.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Tão boa que até o rádio da concorrência fica com inveja.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Se a perfeição tivesse trilha sonora, seria o nosso sinal.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! A rádio que não dorme, não erra e ainda te faz sorrir.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Aqui a gente não toca som — a gente hipnotiza.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Já avisamos: depois de ouvir a gente, nenhuma outra rádio serve.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! A rádio que o Spotify ouve escondido.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! A estação que faz até o seu café parecer mais forte.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Onde cada hertz é feito com amor e um toque de loucura.`,
    `Olá, aqui é a DJ Virtual Juliette Psicose da Rádio Tatuapé FM! Se o rock é uma religião, nós somos o altar.`,
  ];

  return comments[Math.floor(Math.random() * comments.length)];
};
