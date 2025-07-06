class Game {
    private secretWord: string;
    private revealedSecretWord: string;
    private trials: number;
    private isGameOver: boolean;
    private playerGuesses: string[];
    private gameProblem: GameError | null;
    constructor(secretWord: string, trials: number) {
        this.secretWord = secretWord;
        this.revealedSecretWord = "_".repeat(secretWord.length);
        this.trials = trials
        this.isGameOver = false
        this.playerGuesses = []
        this.gameProblem = null
        if (trials <= 0) {
            this.isGameOver = true
            this.trials = 0
            this.gameProblem = GameError.TrialsMustBePositive
        }
        if (secretWord.length === 0) {
            this.isGameOver = true
            this.trials = 0
            this.gameProblem = GameError.SecretWordMustHaveAtLeastOneLetter
        }
    }

    tryTo(letter: string) {
        if (this.isGameOver) {
            return this
        }
        if (letter.length > 1) {
            this.gameProblem = GameError.MultipleLettersNotAllowed
            return this
        }
        if (!letter.match(/[a-z]/i)) {
            this.gameProblem = GameError.InvalidCharacter
            return this
        }

        this.trials -= 1
        this.playerGuesses.push(letter)
        this.gameProblem = null
        if (this.secretWord.includes(letter)) {
            this.revealedSecretWord = this.secretWord.split('').map((char) => this.playerGuesses.includes(char) ? char : '_').join('')
        }
        this.isGameOver = this.trials === 0 || this.revealedSecretWord === this.secretWord
        return this
    }

    isOver() {
        return this.isGameOver
    }

    result() {
        if (this.isGameOver) {
            return this.trials > 0 ? GameResult.PlayerWins : GameResult.PlayerLoses
        }
        return GameResult.Ongoing
    }

    availableTrials() {
        return this.trials
    }

    revealedSecret() {
        return this.revealedSecretWord
    }

    problem() {
        return this.gameProblem
    }

    isMisconfigured() {
        return this.gameProblem !== null
    }
}

export class Hangman {
    static startGame({ secretWord, trials }: { secretWord: string, trials: number }) {
        return new Game(secretWord, trials)
    }
}

export class Guess {
    static letter(str: string) {
        return str
    }
}

export enum GameError {
    TrialsMustBePositive,
    SecretWordMustHaveAtLeastOneLetter,
    MultipleLettersNotAllowed,
    InvalidCharacter,
}

export enum GameResult {
    PlayerWins,
    PlayerLoses,
    Ongoing,
}