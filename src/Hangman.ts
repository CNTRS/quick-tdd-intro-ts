class Game {
    private secretWord: string;
    private trials: number;
    private isGameOver: boolean;
    constructor(secretWord: string, trials: number) {
        this.secretWord = secretWord;
        this.trials = trials
        this.isGameOver = false
    }

    tryTo(letter: string) {
        if (letter === this.secretWord) {
            this.isGameOver = true
        } else {
            this.trials -= 1
            if (this.trials === 0) {
                this.isGameOver = true
            }
        }
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

export enum GameError {}

export enum GameResult {
    PlayerWins,
    PlayerLoses,
    Ongoing,
}