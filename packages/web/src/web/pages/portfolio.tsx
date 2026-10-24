import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Moon, Sun, Shuffle, Copy, Check, Play, Pause, RotateCcw, Cloud, CloudSun, Code2, Palette, Timer, MapPin } from 'lucide-react';

const initialColors = ['#7451D9', '#A58BE8', '#D7C9F2', '#E8EDCD', '#343C2F'];
const weather = [
  { city: 'Москва', temp: '+12°', label: 'Облачно', high: '+14°', low: '+8°', Icon: Cloud },
  { city: 'Санкт-Петербург', temp: '+9°', label: 'Переменная облачность', high: '+11°', low: '+6°', Icon: CloudSun },
  { city: 'Сочи', temp: '+22°', label: 'Солнечно', high: '+24°', low: '+18°', Icon: Sun },
];

function storedTheme() {
  try { return localStorage.getItem('portfolio-theme') === 'dark'; } catch { return false; }
}
function contrast(hex: string) {
  const rgb = hex.slice(1).match(/.{2}/g)!.map(x => parseInt(x, 16));
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 150 ? '#20221E' : '#FFFFFF';
}

export default function Portfolio() {
  const [dark, setDark] = useState(storedTheme);
  const [colors, setColors] = useState(initialColors);
  const [copied, setCopied] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [remaining, setRemaining] = useState(25 * 60);
  const remainingRef = useRef(25 * 60);
  const [running, setRunning] = useState(false);
  const [city, setCity] = useState(0);
  const current = weather[city];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch { /* optional persistence */ }
  }, [dark]);

  useEffect(() => { remainingRef.current = remaining; }, [remaining]);
  useEffect(() => {
    if (!running) return;
    const end = Date.now() + remainingRef.current * 1000;
    const interval = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) {
        setRunning(false);
        const nextMode = mode === 'focus' ? 'break' : 'focus';
        setMode(nextMode);
        setRemaining(nextMode === 'focus' ? 1500 : 300);
        setNotice(nextMode === 'break' ? 'Время отдохнуть. Перерыв — 5 минут.' : 'Перерыв завершён. Можно начать новый фокус.');
      }
    }, 250);
    return () => window.clearInterval(interval);
  }, [running, mode]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function generate() {
    const bytes = new Uint8Array(15);
    crypto.getRandomValues(bytes);
    setColors(Array.from({ length: 5 }, (_, i) => '#' + Array.from(bytes.slice(i * 3, i * 3 + 3), b => b.toString(16).padStart(2, '0')).join('').toUpperCase()));
    setCopied(null);
    setNotice('Новая палитра готова. Нажмите на цвет, чтобы скопировать HEX.');
  }
  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setNotice(`${hex} скопирован`);
    } catch { setNotice(`Копирование недоступно. Выделите код вручную: ${hex}`); }
  }
  function changeMode(next: 'focus' | 'break') {
    setRunning(false); setMode(next); setRemaining(next === 'focus' ? 1500 : 300);
  }

  return (
    <div className="portfolio" id="top">
      <header className="site-header shell">
        <a href="#top" className="wordmark" aria-label="Демо — на главную">д<span className="logo-dot">.</span></a>
        <nav aria-label="Основная навигация"><a href="#projects">Проекты <span>03</span></a><a href="#about">Обо мне</a></nav>
        <button className="theme-switch" onClick={() => setDark(!dark)} aria-label={dark ? 'Включить светлую тему' : 'Включить тёмную тему'} aria-pressed={dark}>{dark ? <Sun size={18}/> : <Moon size={18}/>}<span>{dark ? 'Светлая тема' : 'Тёмная тема'}</span></button>
      </header>

      <main>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy"><p className="eyebrow"><span/> ДЕМО-ПОРТФОЛИО</p><h1 id="hero-title">Демо<span>Разработчик.<br/><em>Дизайнер.</em></span></h1><p className="hero-caption">Начинающий frontend-разработчик<br/>с вниманием к деталям и любовью к вебу.</p><a className="hero-link" href="#projects">Посмотреть проекты <ArrowDown size={18}/></a></div>
          <div className="orb-art" aria-hidden="true"><div className="orb orb-one"/><div className="orb orb-two"/><div className="orb orb-three"/><div className="orb orb-four"/><div className="orb orb-five"/><span className="art-note">немного кода.<br/>много возможностей.</span></div>
          <div className="hero-bottom"><span>КОД, ЦВЕТ И НЕМНОГО ЭКСПЕРИМЕНТОВ</span><span>ПОРТФОЛИО / 2026</span></div>
        </section>

        <section className="intro shell" id="about"><span className="section-kicker">01 / ОБО МНЕ</span><div><h2>Создаю простые интерфейсы,<br/>которые <span>хочется использовать.</span></h2><p>Изучаю frontend и веб-дизайн через небольшие проекты.<br className="desktop-break"/> Здесь — три демо и возможность попробовать каждый.</p><div className="skills"><span><Code2 size={14}/> JavaScript</span><span>React</span><span>HTML & CSS</span><span><Palette size={14}/> UI-дизайн</span></div></div></section>

        <section className="projects shell" id="projects" aria-labelledby="projects-title">
          <div className="section-heading"><div><span className="section-kicker">02 / ПРАКТИКА</span><h2 id="projects-title">Избранные проекты<span> / 03</span></h2></div><span className="live-note"><span/> Можно попробовать</span></div>
          <article className="palette-project project" id="palette">
            <div className="project-top"><div className="project-label"><span className="number">01</span><span>ЦВЕТ / ИНТЕРАКТИВ</span></div><span className="demo-badge">Демо-проект</span></div>
            <div className="palette-heading"><div><h3>Palette Lab <ArrowUpRight size={26}/></h3><p>Пять цветов. Тысячи идей. Ваша следующая палитра — в одном клике.</p></div><button className="primary-button" onClick={generate}><Shuffle size={17}/> Сгенерировать палитру</button></div>
            <div className="swatches">{colors.map((hex, i) => <button className="swatch" key={i} onClick={() => copy(hex)} style={{ background: hex, color: contrast(hex) }} aria-label={`Скопировать ${hex}`}><span className="swatch-index">0{i + 1}</span><span className="swatch-copy">{copied === hex ? <Check size={18}/> : <Copy size={17}/>}</span><span className="hex">{hex}</span></button>)}</div>
            <div className="palette-footer"><span><Copy size={13}/> Нажмите на цвет, чтобы скопировать HEX</span><span>JAVASCRIPT · CSS</span></div>
          </article>

          <div className="project-grid">
            <article className="project timer-project"><div className="project-top"><div className="project-label"><span className="number">02</span><span>ВРЕМЯ / ФОКУС</span></div><span className="demo-badge">Демо</span></div><h3>Focus Timer <Timer size={22}/></h3><p>Меньше отвлечений, больше сделанного.<br/>Ритм работы — 25 минут, отдыха — 5.</p><div className="timer-demo"><div className="segmented" aria-label="Режим таймера"><button className={mode === 'focus' ? 'active' : ''} onClick={() => changeMode('focus')} aria-pressed={mode === 'focus'}>Фокус · 25 мин</button><button className={mode === 'break' ? 'active' : ''} onClick={() => changeMode('break')} aria-pressed={mode === 'break'}>Перерыв · 5 мин</button></div><div className="timer-digits" role="timer" aria-label="Оставшееся время">{Math.floor(remaining / 60).toString().padStart(2, '0')}<span>:</span>{(remaining % 60).toString().padStart(2, '0')}</div><div className="timer-controls"><button className="timer-start" onClick={() => setRunning(!running)}>{running ? <Pause size={15}/> : <Play size={15}/>} {running ? 'Пауза' : 'Начать фокус'}</button><button className="reset-button" aria-label="Сбросить таймер" onClick={() => changeMode(mode)}><RotateCcw size={16}/></button></div></div><div className="project-foot"><span>REACT · JAVASCRIPT</span><span>25 / 5</span></div></article>
            <article className="project weather-project"><div className="project-top"><div className="project-label"><span className="number">03</span><span>ПОГОДА / КАРТОЧКИ</span></div><span className="demo-badge">Демо</span></div><h3>Weather Cards <CloudSun size={24}/></h3><p>Погода в трёх городах — в чистом интерфейсе.<br/>Статичные демо-данные, без API.</p><div className="weather-demo"><div className="city-tabs" aria-label="Выбор города">{weather.map((item, i) => <button key={item.city} onClick={() => setCity(i)} className={city === i ? 'active' : ''} aria-pressed={city === i}>{item.city === 'Санкт-Петербург' ? 'Петербург' : item.city}</button>)}</div><div className="weather-body"><div><span className="weather-location"><MapPin size={13}/> {current.city}</span><div className="temperature">{current.temp}</div><span className="weather-description">{current.label}</span></div><current.Icon className="weather-icon" size={76} strokeWidth={1.15}/></div><div className="weather-bottom"><span>Макс. {current.high} <span className="weather-low">/ Мин. {current.low}</span></span><span>Демо-данные</span></div></div><div className="project-foot"><span>REACT · CSS</span><span>3 ГОРОДА</span></div></article>
          </div>
        </section>
        <section className="closing shell"><span className="section-kicker">ПРОДОЛЖЕНИЕ СЛЕДУЕТ</span><h2>Большие идеи начинаются<br/>с <em>маленьких проектов.</em></h2><a href="#palette">Поиграем с цветом? <ArrowUpRight size={20}/></a></section>
      </main>
      <footer className="site-footer shell"><a href="#top" className="footer-name">Демо<span>.</span></a><span>Учусь. Создаю. Экспериментирую.</span><span>Демо-портфолио © 2026</span></footer>
      <output className={`toast ${notice ? 'visible' : ''}`} aria-live="polite">{notice}</output>
    </div>
  );
}