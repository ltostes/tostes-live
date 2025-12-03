import React, { useState, useMemo } from 'react';
import { CenteredMain } from '@tostes/ui';
import { useLocalStorage } from '@tostes/ui';
import { FaInstagram } from 'react-icons/fa';

import styles from './ConsegueAdivinhar.module.css';

const CORRECT_PHRASE = 'Resposta ao tédio';

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

  const hasGuessedToday = lastGuessDate === getTodayDateString();

  const randomStat = useMemo(() => {
    return (Math.random() * 3 + 6).toFixed(1);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guess.trim() || isChecking || hasGuessedToday) return;

    setIsChecking(true);
    setResult(null);

    // Anxiety build-up animation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isCorrect = normalizeText(guess) === normalizeText(CORRECT_PHRASE);
    setResult(isCorrect ? 'correct' : 'wrong');
    setLastGuessDate(getTodayDateString());
    setIsChecking(false);
  };

  return (
    <div className={styles.wrapper}>
        <h1 className={styles.title}>Consegue Adivinhar?</h1>
        <p className={styles.subtitle}>Uma frase escondida. Uma chance por dia.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder={hasGuessedToday ? 'Volte amanha...' : 'Digite sua tentativa...'}
            disabled={isChecking || hasGuessedToday}
            className={styles.input}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isChecking || hasGuessedToday || !guess.trim()}
            className={styles.button}
          >
            {isChecking ? '...' : 'Tentar'}
          </button>
        </form>

        {isChecking && (
          <div className={styles.checking}>
            <span className={styles.dots}>. . .</span>
          </div>
        )}

        {result && (
          <div className={`${styles.result} ${styles[result]}`}>
            {result === 'correct' ? (
              <>Voce acertou!</>
            ) : (
              <>Nao foi dessa vez... Tente novamente amanha.</>
            )}
          </div>
        )}

        <div className={styles.stats}>
          <span className={styles.statLabel}>Ja acertaram:</span>
          <span className={styles.statValue}>{randomStat}%</span>
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
