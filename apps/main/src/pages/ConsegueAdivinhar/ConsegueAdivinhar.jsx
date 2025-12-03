import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '@tostes/ui';
import { FaInstagram } from 'react-icons/fa';

import styles from './ConsegueAdivinhar.module.css';

const CORRECT_PHRASE = 'Resposta ao tédio';

const TEXTS = {
  subtitles: [
    'Uma frase escondida. Uma chance por dia.',
    'O segredo se revelará. Mas só se acertar tb.',
    'O mistério espera. Você tem uma chance (hoje).',
    'Palavras ocultas. Um palpite por dia.',
  ],
  congrats: [
    'Incrível! Você desvendou o mistério!',
    'Parabéns! A frase era sua o tempo todo.',
    'Gênio! Finalmente você acertou!',
    'Magnífico! O segredo foi revelado.',
    'Bravo! Sua intuição estava certa!',
  ],
  tryAgainTomorrow: [
    'Não foi dessa vez... Volte amanhã.',
    'Quase lá... O amanhã traz nova chance.',
    'O mistério permanece. Tente amanhã.',
    'Reveja os vídeos, vai. E volta amanhã.',
  ],
  alreadyGuessedToday: [
    'Você já tentou hoje. Descanse a mente.',
    'Calma... Amanhã tem mais.',
    'O destino já foi selado hoje. Volte amanhã.',
    'Dias de luta, dias de glória. Hoje é luta.',
  ],
  alreadyWon: [
    'Já pode tirar onda com os amigos. Parabéns!',
    'O segredo já é seu. Missão cumprida!',
    'Você já venceu! A glória é eterna.',
    'Campeão! O enigma foi conquistado.',
  ],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

function ConsegueAdivinhar() {
  const [guess, setGuess] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | null
  const [lastGuessDate, setLastGuessDate] = useLocalStorage('consegueadivinhar_lastguess', null);
  const [hasWon, setHasWon] = useLocalStorage('consegueadivinhar_won', false);

  const hasGuessedToday = lastGuessDate === getTodayDateString();
  const canGuess = !hasWon && !hasGuessedToday;

  const texts = useMemo(() => ({
    subtitle: pickRandom(TEXTS.subtitles),
    congrats: pickRandom(TEXTS.congrats),
    tryAgain: pickRandom(TEXTS.tryAgainTomorrow),
    alreadyGuessedToday: pickRandom(TEXTS.alreadyGuessedToday),
    alreadyWon: pickRandom(TEXTS.alreadyWon),
  }), []);

  const randomStat = useMemo(() => {
    return (Math.random() * 3 + 6).toFixed(1);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guess.trim() || isChecking || !canGuess) return;

    setIsChecking(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const isCorrect = normalizeText(guess) === normalizeText(CORRECT_PHRASE);
    setResult(isCorrect ? 'correct' : 'wrong');
    setLastGuessDate(getTodayDateString());
    if (isCorrect) setHasWon(true);
    setIsChecking(false);
  };

  const renderContent = () => {
    // Already won permanently
    if (hasWon && !result) {
      return (
        <div className={`${styles.message} ${styles.won}`}>
          {texts.alreadyWon}
        </div>
      );
    }

    // Just guessed - show result
    if (result) {
      return (
        <div className={`${styles.result} ${styles[result]}`}>
          {result === 'correct' ? texts.congrats : texts.tryAgain}
        </div>
      );
    }

    // Checking animation
    if (isChecking) {
      return (
        <div className={styles.checking}>
          <span className={styles.dots}>. . .</span>
        </div>
      );
    }

    // Already guessed today (but didn't win)
    if (hasGuessedToday) {
      return (
        <div className={`${styles.message} ${styles.waiting}`}>
          {texts.alreadyGuessedToday}
        </div>
      );
    }

    // Can guess - show form
    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Digite sua tentativa..."
          className={styles.input}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!guess.trim()}
          className={styles.button}
        >
          Tentar
        </button>
      </form>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>Consegue Adivinhar?</h1>
        <p className={styles.subtitle}>{texts.subtitle}</p>

        {renderContent()}

        <div className={styles.stats}>
          <span className={styles.statLabel}>Ja acertaram:</span>
          <span className={styles.statValue}>{randomStat}%</span>
        </div>
      </div>

      <a
        href="https://instagram.com/minimoprac4ralho"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.instagram}
      >
        <FaInstagram size={20} />
        <span>@minimoprac4ralho</span>
      </a>
    </div>
  );
}

export default ConsegueAdivinhar;
