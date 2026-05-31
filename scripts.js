const STORAGE_KEY = "simonSaysV2Scores";
const LANGUAGE_KEY = "simonSaysV2Language";

const PAD_CONFIG = [
    { id: 0, key: "q", arrow: "arrowup", frequency: 261.63, color: "red" },
    { id: 1, key: "w", arrow: "arrowright", frequency: 329.63, color: "blue" },
    { id: 2, key: "a", arrow: "arrowleft", frequency: 392.0, color: "yellow" },
    { id: 3, key: "s", arrow: "arrowdown", frequency: 523.25, color: "green" }
];

const MODE_SETTINGS = {
    classic: { baseDelay: 700, minDelay: 360, step: 18, scoreBase: 100, speedBonus: 0 },
    speedrun: { baseDelay: 520, minDelay: 230, step: 24, scoreBase: 120, speedBonus: 55 },
    drift: { baseDelay: 660, minDelay: 330, step: 20, scoreBase: 115, speedBonus: 20 }
};

const translations = {
    en: {
        brand: "Neon Synth",
        resetScores: "Reset scores",
        eyebrow: "Memory arcade sequence",
        lede: "Watch the pattern, replay it cleanly, and keep your streak alive as the machine gets faster.",
        statusLabel: "System status",
        round: "Round",
        score: "Score",
        best: "Best",
        combo: "Combo",
        start: "Start game",
        restart: "Restart",
        pause: "Pause",
        resume: "Resume",
        mode: "Mode",
        modeClassic: "Classic",
        modeSpeedrun: "Speedrun",
        modeDrift: "Memory Drift",
        classicTitle: "Classic pressure",
        classicCopy: "Every round adds one more note. Read the light, trust the rhythm, repeat the path.",
        speedTitle: "Speedrun scoring",
        speedCopy: "The preview tightens up and quick reactions add bonus points without changing the sequence rules.",
        driftTitle: "Memory drift",
        driftCopy: "The board adds visual noise as rounds climb, but the real sequence stays fair and replayable.",
        idle: "Press Start to boot the board.",
        preview: "Simon's turn. Watch the pulse.",
        player: "Your turn. Replay the sequence.",
        success: "Clean input. Loading next round.",
        gameover: "Sequence broken. Run ended.",
        paused: "Paused. Press Space or Resume.",
        scoresReset: "Scores reset. Start a new run.",
        audioBlocked: "Tap Start again if your browser blocked audio.",
        feedbackIdle: "Ready when you are.",
        countdownGo: "GO",
        perfect: "Perfect signal.",
        clean: "Clean input.",
        comboHot: "Combo x{combo}",
        speedBonus: "+{bonus} speed bonus",
        roundClear: "Round {round} cleared.",
        newBest: "New best signal recorded.",
        noNewBest: "Best signal remains {best}.",
        runComplete: "Run complete",
        summaryTitle: "Final signal report",
        playAgain: "Play again",
        changeMode: "Change mode",
        ready: "READY",
        listen: "LISTEN",
        play: "PLAY",
        pausedCore: "PAUSE",
        fail: "FAIL"
    },
    es: {
        brand: "Neon Synth",
        resetScores: "Borrar scores",
        eyebrow: "Secuencia arcade de memoria",
        lede: "Mira el patron, repetilo limpio y manten la racha viva mientras la maquina acelera.",
        statusLabel: "Estado del sistema",
        round: "Ronda",
        score: "Puntos",
        best: "Mejor",
        combo: "Combo",
        start: "Iniciar juego",
        restart: "Reiniciar",
        pause: "Pausa",
        resume: "Seguir",
        mode: "Modo",
        modeClassic: "Clasico",
        modeSpeedrun: "Speedrun",
        modeDrift: "Memory Drift",
        classicTitle: "Presion clasica",
        classicCopy: "Cada ronda agrega una nota. Lee la luz, confia en el ritmo y repite el camino.",
        speedTitle: "Puntaje speedrun",
        speedCopy: "La vista previa se acelera y las respuestas rapidas suman bonus sin cambiar las reglas.",
        driftTitle: "Memoria drift",
        driftCopy: "El tablero suma ruido visual al subir de ronda, pero la secuencia real sigue siendo justa.",
        idle: "Presiona Start para encender el tablero.",
        preview: "Turno de Simon. Mira el pulso.",
        player: "Tu turno. Repite la secuencia.",
        success: "Entrada limpia. Cargando siguiente ronda.",
        gameover: "Secuencia rota. Fin de la partida.",
        paused: "Pausa. Presiona Space o Seguir.",
        scoresReset: "Scores borrados. Inicia una nueva partida.",
        audioBlocked: "Toca Start otra vez si el navegador bloqueo el audio.",
        feedbackIdle: "Listo cuando quieras.",
        countdownGo: "YA",
        perfect: "Senal perfecta.",
        clean: "Entrada limpia.",
        comboHot: "Combo x{combo}",
        speedBonus: "+{bonus} bonus rapido",
        roundClear: "Ronda {round} superada.",
        newBest: "Nuevo mejor registro.",
        noNewBest: "El mejor sigue en {best}.",
        runComplete: "Partida completa",
        summaryTitle: "Reporte final",
        playAgain: "Jugar otra vez",
        changeMode: "Cambiar modo",
        ready: "LISTO",
        listen: "MIRA",
        play: "JUEGA",
        pausedCore: "PAUSA",
        fail: "FALLO"
    }
};

const elements = {
    pads: [...document.querySelectorAll("[data-pad]")],
    start: document.querySelector("[data-start]"),
    status: document.querySelector("[data-status-message]"),
    round: document.querySelector("[data-round]"),
    score: document.querySelector("[data-score]"),
    best: document.querySelector("[data-best]"),
    combo: document.querySelector("[data-combo]"),
    feedback: document.querySelector("[data-feedback]"),
    bonus: document.querySelector("[data-bonus]"),
    modeInputs: [...document.querySelectorAll("input[name='mode']")],
    board: document.querySelector("[data-board]"),
    core: document.querySelector("[data-core-label]"),
    languageToggle: document.querySelector("[data-language-toggle]"),
    resetScores: document.querySelector("[data-reset-scores]"),
    pause: document.querySelector("[data-pause]"),
    phaseDots: [...document.querySelectorAll("[data-phase-dot]")],
    overlay: document.querySelector("[data-game-over]"),
    summaryScore: document.querySelector("[data-summary-score]"),
    summaryRound: document.querySelector("[data-summary-round]"),
    summaryMode: document.querySelector("[data-summary-mode]"),
    summaryBest: document.querySelector("[data-summary-best]"),
    summaryNote: document.querySelector("[data-summary-note]"),
    playAgain: document.querySelector("[data-play-again]"),
    changeMode: document.querySelector("[data-change-mode]")
};

let audioContext = null;
let language = getStoredLanguage();
let highScores = loadScores();
let game = createInitialState();
let runToken = 0;

function createInitialState() {
    return {
        phase: "idle",
        mode: "classic",
        round: 0,
        score: 0,
        combo: 0,
        sequence: [],
        playerIndex: 0,
        acceptingInput: false,
        lastInputAt: 0,
        paused: false,
        previousPhase: null,
        newBest: false,
        lastBonus: 0,
        roundStartedAt: 0
    };
}

function getStoredLanguage() {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    return stored === "es" ? "es" : "en";
}

function loadScores() {
    const fallback = { classic: 0, speedrun: 0, drift: 0 };

    try {
        return { ...fallback, ...JSON.parse(window.localStorage.getItem(STORAGE_KEY)) };
    } catch {
        return fallback;
    }
}

function saveScores() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(highScores));
}

function t(key) {
    return translations[language][key] || translations.en[key] || key;
}

function formatText(key, values = {}) {
    return Object.entries(values).reduce((text, [name, value]) => {
        return text.replace(`{${name}}`, String(value));
    }, t(key));
}

function setLanguage(nextLanguage) {
    language = nextLanguage;
    document.documentElement.lang = language;
    window.localStorage.setItem(LANGUAGE_KEY, language);

    document.querySelectorAll("[data-i18n]").forEach((node) => {
        node.textContent = t(node.dataset.i18n);
    });

    elements.languageToggle.textContent = language === "en" ? "ES" : "EN";
    elements.status.textContent = getStatusText();
    updateStartLabel();
    updatePauseLabel();
    updateCoreLabel();
    setFeedback(game.phase === "idle" ? "feedbackIdle" : game.phase);

    if (!elements.overlay.hidden) {
        updateGameOverSummaryText();
    }
}

function setPhase(phase) {
    game.phase = phase;
    elements.status.textContent = getStatusText();
    updateCoreLabel();
    updatePauseLabel();

    elements.phaseDots.forEach((dot) => {
        dot.classList.toggle("is-active", dot.dataset.phaseDot === phase);
    });
}

function getStatusText() {
    return t(game.phase);
}

function updateStartLabel() {
    elements.start.querySelector("span").textContent = game.phase === "idle" ? t("start") : t("restart");
}

function updatePauseLabel() {
    elements.pause.querySelector("span").textContent = game.paused ? t("resume") : t("pause");
    elements.pause.disabled = !["preview", "player", "success", "paused"].includes(game.phase);
}

function updateCoreLabel() {
    const labels = {
        idle: t("ready"),
        preview: t("listen"),
        player: t("play"),
        paused: t("pausedCore"),
        success: "OK",
        gameover: t("fail")
    };

    elements.core.textContent = labels[game.phase] || t("ready");
}

function updateHud() {
    elements.round.textContent = String(game.round);
    elements.score.textContent = String(game.score);
    elements.combo.textContent = String(game.combo);
    elements.best.textContent = String(highScores[game.mode] || 0);
}

function bumpHud(...keys) {
    const map = {
        round: elements.round.closest("article"),
        score: elements.score.closest("article"),
        best: elements.best.closest("article"),
        combo: elements.combo.closest("article")
    };

    keys.forEach((key) => {
        const item = map[key];
        if (!item) return;
        item.classList.remove("is-bumped");
        void item.offsetWidth;
        item.classList.add("is-bumped");
    });
}

function setFeedback(messageKey, options = {}) {
    elements.feedback.textContent = options.text || formatText(messageKey, options.values || {});
    elements.bonus.textContent = options.bonus ? formatText("speedBonus", { bonus: options.bonus }) : "";
    elements.feedback.parentElement.classList.toggle("is-hot", options.hot || Boolean(options.bonus));
}

function getSelectedMode() {
    return elements.modeInputs.find((input) => input.checked)?.value || "classic";
}

function getRoundDelay() {
    const settings = MODE_SETTINGS[game.mode];
    return Math.max(settings.minDelay, settings.baseDelay - (game.round * settings.step));
}

function sleep(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

async function pausableSleep(ms, token) {
    let remaining = ms;
    let lastTick = performance.now();

    while (remaining > 0) {
        if (token !== runToken) {
            return false;
        }

        if (!game.paused) {
            const now = performance.now();
            remaining -= now - lastTick;
            lastTick = now;
        } else {
            lastTick = performance.now();
        }

        await sleep(40);
    }

    return token === runToken;
}

async function ensureAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        await audioContext.resume();
    }
}

function playTone(padId, duration = 0.22, type = "sine") {
    if (!audioContext) {
        return;
    }

    const config = PAD_CONFIG[padId];
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(config.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(config.frequency * 1.012, now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.04);
}

function playEffect(kind) {
    if (!audioContext) {
        return;
    }

    const notes = kind === "fail" ? [180, 130, 86] : kind === "success" ? [440, 554, 659] : [220, 330, 440];
    notes.forEach((frequency, index) => {
        const now = audioContext.currentTime + index * 0.08;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = kind === "fail" ? "sawtooth" : "triangle";
        oscillator.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.16, now + 0.014);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.22);
    });
}

async function flashPad(padId, options = {}) {
    const pad = elements.pads[padId];
    const className = options.wrong ? "is-wrong" : options.player ? "is-player-hit" : options.preview ? "is-preview" : "is-active";

    pad.classList.add(className);
    playTone(padId, options.duration ? options.duration / 1000 : 0.22, options.type || "sine");
    if (options.token) {
        await pausableSleep(options.duration || 260, options.token);
    } else {
        await sleep(options.duration || 260);
    }
    pad.classList.remove(className);
}

function lockPads() {
    game.acceptingInput = false;
    elements.pads.forEach((pad) => {
        pad.disabled = true;
    });
}

function unlockPads() {
    game.acceptingInput = true;
    game.lastInputAt = performance.now();
    elements.pads.forEach((pad) => {
        pad.disabled = false;
    });
}

function resetRun() {
    runToken += 1;
    hideGameOverSummary();
    lockPads();
    game = {
        ...createInitialState(),
        mode: getSelectedMode()
    };
    elements.board.classList.toggle("is-drift", game.mode === "drift");
    updateHud();
    updateStartLabel();
    updatePauseLabel();
    setFeedback("feedbackIdle");
    setPhase("idle");
}

async function startGame() {
    const token = runToken + 1;
    runToken = token;

    try {
        await ensureAudio();
    } catch {
        elements.status.textContent = t("audioBlocked");
    }

    game = {
        ...createInitialState(),
        mode: getSelectedMode()
    };

    hideGameOverSummary();
    elements.board.classList.toggle("is-drift", game.mode === "drift");
    playEffect("start");
    updateHud();
    updateStartLabel();
    updatePauseLabel();
    await runCountdown(token);
    if (token !== runToken) {
        return;
    }
    await nextRound(token);
}

async function runCountdown(token) {
    lockPads();
    setPhase("preview");
    const steps = ["3", "2", "1", t("countdownGo")];

    for (const step of steps) {
        if (token !== runToken) return;
        elements.core.textContent = step;
        setFeedback("clean", { text: step, hot: true });
        playEffect(step === t("countdownGo") ? "success" : "start");
        elements.board.classList.add("is-round-clear");
        await pausableSleep(420, token);
        elements.board.classList.remove("is-round-clear");
        await pausableSleep(110, token);
    }
}

async function nextRound(token) {
    if (token !== runToken) {
        return;
    }

    lockPads();
    setPhase("preview");
    updatePauseLabel();
    game.playerIndex = 0;
    game.round += 1;
    game.roundStartedAt = performance.now();
    game.sequence.push(Math.floor(Math.random() * PAD_CONFIG.length));
    updateHud();
    bumpHud("round");

    const delay = getRoundDelay();
    await pausableSleep(420, token);

    for (const [index, padId] of game.sequence.entries()) {
        if (token !== runToken) {
            return;
        }

        if (game.mode === "drift" && index % 2 === 0) {
            elements.board.style.rotate = `${(Math.random() * 2) - 1}deg`;
        }

        await flashPad(padId, { duration: Math.max(180, delay * 0.48), type: game.mode === "speedrun" ? "square" : "sine", preview: true, token });
        await pausableSleep(Math.max(110, delay * 0.44), token);
    }

    if (token !== runToken) {
        return;
    }

    elements.board.style.rotate = "0deg";
    setPhase("player");
    updatePauseLabel();
    setFeedback("player");
    unlockPads();
}

async function handlePadInput(padId) {
    if (!game.acceptingInput) {
        return;
    }

    const expected = game.sequence[game.playerIndex];
    const now = performance.now();
    const reactionMs = now - game.lastInputAt;

    game.lastInputAt = now;
    await flashPad(padId, { duration: 180, type: "triangle", player: true });

    if (padId !== expected) {
        endGame(padId);
        return;
    }

    const settings = MODE_SETTINGS[game.mode];
    const speedBonus = game.mode === "speedrun" ? Math.max(0, Math.round(settings.speedBonus - (reactionMs / 30))) : settings.speedBonus;
    game.combo += 1;
    game.lastBonus = speedBonus;
    game.score += settings.scoreBase + (game.round * 8) + speedBonus;
    game.playerIndex += 1;
    updateHud();
    bumpHud("score", "combo");
    setFeedback(game.combo > 0 && game.combo % 8 === 0 ? "comboHot" : game.playerIndex === game.sequence.length ? "perfect" : "clean", {
        values: { combo: game.combo },
        bonus: speedBonus,
        hot: game.combo > 0 && game.combo % 8 === 0
    });

    if (game.playerIndex === game.sequence.length) {
        lockPads();
        setPhase("success");
        updatePauseLabel();
        setFeedback("roundClear", { values: { round: game.round }, hot: true });
        elements.board.classList.add("is-round-clear");
        playEffect("success");
        await pausableSleep(650, runToken);
        elements.board.classList.remove("is-round-clear");
        await nextRound(runToken);
    }
}

function endGame(wrongPadId) {
    runToken += 1;
    lockPads();
    setPhase("gameover");
    updatePauseLabel();
    playEffect("fail");
    flashPad(wrongPadId, { duration: 280, wrong: true });

    const previousBest = highScores[game.mode] || 0;
    game.newBest = game.score > previousBest;
    if (game.score > (highScores[game.mode] || 0)) {
        highScores[game.mode] = game.score;
        saveScores();
    }

    updateHud();
    if (game.newBest) {
        bumpHud("best");
    }
    updateStartLabel();
    showGameOverSummary(previousBest);
}

function resetScores() {
    highScores = { classic: 0, speedrun: 0, drift: 0 };
    saveScores();
    resetRun();
    elements.status.textContent = t("scoresReset");
}

function pauseGame() {
    if (!["preview", "player", "success"].includes(game.phase) || game.paused) {
        return;
    }

    game.paused = true;
    game.previousPhase = game.phase;
    lockPads();
    setPhase("paused");
    setFeedback("paused");
}

function resumeGame() {
    if (!game.paused) {
        return;
    }

    const nextPhase = game.previousPhase || "player";
    game.paused = false;
    setPhase(nextPhase);
    setFeedback(nextPhase);

    if (nextPhase === "player") {
        unlockPads();
    }
}

function togglePause() {
    if (game.paused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

function getModeLabel(mode = game.mode) {
    const key = mode === "speedrun" ? "modeSpeedrun" : mode === "drift" ? "modeDrift" : "modeClassic";
    return t(key);
}

function showGameOverSummary(previousBest) {
    game.previousBest = previousBest;
    updateGameOverSummaryText();
    elements.overlay.hidden = false;
}

function updateGameOverSummaryText() {
    elements.summaryScore.textContent = String(game.score);
    elements.summaryRound.textContent = String(game.round);
    elements.summaryMode.textContent = getModeLabel(game.mode);
    elements.summaryBest.textContent = String(highScores[game.mode] || 0);
    elements.summaryNote.textContent = game.newBest
        ? t("newBest")
        : formatText("noNewBest", { best: game.previousBest || 0 });
}

function hideGameOverSummary() {
    elements.overlay.hidden = true;
}

function bindEvents() {
    elements.start.addEventListener("click", startGame);
    elements.pause.addEventListener("click", togglePause);
    elements.languageToggle.addEventListener("click", () => setLanguage(language === "en" ? "es" : "en"));
    elements.resetScores.addEventListener("click", resetScores);
    elements.playAgain.addEventListener("click", startGame);
    elements.changeMode.addEventListener("click", () => {
        hideGameOverSummary();
        resetRun();
        document.querySelector(".mode-picker").scrollIntoView({ behavior: "smooth", block: "center" });
    });

    elements.modeInputs.forEach((input) => {
        input.addEventListener("change", resetRun);
    });

    elements.pads.forEach((pad) => {
        pad.addEventListener("pointerdown", () => handlePadInput(Number(pad.dataset.pad)));
    });

    document.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();

        if (key === "enter" && game.paused) {
            resumeGame();
            return;
        }

        if (key === "enter" && game.phase !== "preview") {
            startGame();
            return;
        }

        if (key === " " && game.phase !== "idle" && game.phase !== "gameover") {
            event.preventDefault();
            togglePause();
            return;
        }

        const config = PAD_CONFIG.find((pad) => pad.key === key || pad.arrow === key);

        if (config) {
            event.preventDefault();
            handlePadInput(config.id);
        }
    });
}

bindEvents();
setLanguage(language);
resetRun();
