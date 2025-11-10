export const speakText = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      console.error('Text-to-Speech não suportado neste navegador');
      reject(new Error('TTS não suportado'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    // Prioritize more natural-sounding voices (e.g., Google, Microsoft) for pt-BR
    const preferredPortugueseVoice = voices.find(
      (voice) =>
        voice.lang.includes('pt-BR') &&
        (voice.name.includes('Google') || voice.name.includes('Microsoft'))
    );

    if (preferredPortugueseVoice) {
      utterance.voice = preferredPortugueseVoice;
    } else {
      // Fallback to any pt-BR voice if preferred not found
      const anyPortugueseVoice = voices.find((voice) => voice.lang.includes('pt-BR'));
      if (anyPortugueseVoice) {
        utterance.voice = anyPortugueseVoice;
      }
    }

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('Erro no Text-to-Speech:', event);
      reject(event);
    };

    window.speechSynthesis.speak(utterance);
  });
};

export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeaking = (): boolean => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};

export const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if ('speechSynthesis' in window) {
      let voices = window.speechSynthesis.getVoices();

      if (voices.length > 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        };
      }
    } else {
      resolve([]);
    }
  });
};
