
import { describe, it, expect} from "vitest";
import { GameError, GameResult, Guess, Hangman } from "./Hangman";


describe("Hangman machine", () => {

    function startGame(secretWord: string, trials: number) {
        return Hangman.startGame({secretWord, trials})
    }

    it("finishes the game when all trials are consumed", () => {
        let game = startGame("p", 1)
        game = game.tryTo(Guess.letter('a'))
        expect(game.isOver()).toBe(true)
    })

    it("keeps playing the game whilst there are trials left", () => {
        let game = startGame("p", 5)
        game = game.tryTo(Guess.letter('a'))
        expect(game.isOver()).toBe(false)
    })

    it("finishes the game when the player guesses the secret word", () => {
        let game = startGame("p", 5)
        game = game.tryTo(Guess.letter('p'))
        expect(game.isOver()).toBe(true)
    })

    it("knows when the player wins", () => {
        let game = startGame("p", 5)
        game = game.tryTo(Guess.letter('p'))
        expect(game.result()).toEqual(GameResult.PlayerWins)
    })

    it("knows when the player loses", () => {
        let game = startGame("p", 1)
        game = game.tryTo(Guess.letter('a'))
        expect(game.result()).toEqual(GameResult.PlayerLoses)
    })

    it("knows that the game is ongoing", () => {
        let game = startGame("p", 5)
        game = game.tryTo(Guess.letter('a'))
        expect(game.result()).toEqual(GameResult.Ongoing)
    })

    it("counts the number of trials available", () => {
        let game = startGame("p", 5)
        game = game.tryTo(Guess.letter('a'))
        expect(game.availableTrials()).toEqual(4)
    })

    it("reveals only the part of the secret that has been guessed", () => {
        let game = startGame("cat", 5)
        expect(game.revealedSecret()).toEqual("___")
        game = game.tryTo(Guess.letter('a'))
        expect(game.revealedSecret()).toEqual("_a_")
    })

    it("can't play a game with wrong arguments", () => {
        let game = startGame("cat", -7)
        expect(game.isOver()).toBe(true)
        expect(game.isMisconfigured()).toBe(true)
        expect(game.problem()).toBe(GameError.TrialsMustBePositive)
        expect(game.revealedSecret()).toEqual("___")
        expect(game.availableTrials()).toEqual(0)

        game = startGame("", 15)
        expect(game.isOver()).toBe(true)
        expect(game.problem()).toBe(GameError.SecretWordMustHaveAtLeastOneLetter)
    })

    it("does not alter a game that is already over", () => {
        let game = startGame("cat", 1)
        game = game.tryTo(Guess.letter('a'))
        game = game.tryTo(Guess.letter('b'))
        game = game.tryTo(Guess.letter('c'))
        expect(game.isOver()).toBe(true)
        expect(game.availableTrials()).toEqual(0)
    })

    it("does not allow for words or multiple letters when guessing", () => {
        let game = startGame("cat", 5)
        game = game.tryTo(Guess.letter('ca'))
        expect(game.revealedSecret()).toEqual("___")
        expect(game.problem()).toBe(GameError.MultipleLettersNotAllowed)
        expect(game.availableTrials()).toEqual(5)
    })

    it("does not allow for symbols or numbers, just letters a to z", () => {
        let game = startGame("cat", 5)
        game = game.tryTo(Guess.letter('1'))
        expect(game.revealedSecret()).toEqual("___")
        expect(game.problem()).toBe(GameError.InvalidCharacter)
        expect(game.availableTrials()).toEqual(5)
    })

    it("allows for the game to continue after an invalid trial", () => {
        let game = startGame("cat", 5)
        game = game.tryTo(Guess.letter('1'))
        game = game.tryTo(Guess.letter('a'))
        expect(game.revealedSecret()).toEqual("_a_")
        expect(game.availableTrials()).toEqual(4)
    })
})