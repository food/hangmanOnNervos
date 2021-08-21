"use strict";

const GameStatusEum = {
    0: 'Over',
    1: 'Running',
};
  
const WinnerEnum = {
    0: 'Creator',
    1: 'Player',
};

class Game {
    gameStatus = "over";
    trysLeft = 0;
    winner = "none";
    burnedLetters = [];
    prizeWord = "";
    contract;

    constructor(contract) {
        this.contract = contract;
    }

    async collectGameData() {
        if(!this.contract) {
            throw new Error("Contract is missing!");
        }

        // get simple ones
		const hangmanInstance = await this.contract.deployed()
        this.gameStatus = GameStatusEum[await hangmanInstance.gameStatus.call()];
        this.winner = WinnerEnum[await hangmanInstance.winner.call()];
        this.trysLeft = (await hangmanInstance.trysLeft.call()).toNumber();
        
        // get the others
        await this.getPrizeWord(hangmanInstance);
        await this.getburnedLetters(hangmanInstance);
    }

    async getPrizeWord(hangmanInstance) {
        this.prizeWord = "";
        const arrayLength = (await hangmanInstance.prizeWordLength.call()).toNumber();
        for(let i = 0; i < arrayLength; i++){
            this.prizeWord += await hangmanInstance.prizeWordCharFromPostion.call(i);
        }
    }

    async getburnedLetters(hangmanInstance) {
        this.burnedLetters = [];
        const arrayLength = (await hangmanInstance.burnedLettersLength.call()).toNumber();
        for(let i = 0; i < arrayLength; i++){
            const bl = await hangmanInstance.burnedLetterFromPostion.call(i);
            this.burnedLetters.push(bl);
        }
    }

    async guessALetter (letter, account) {
        letter = letter.toUpperCase();

        if(!this.contract) {
            throw new Error("Contract is missing!");
        }

        const hangmanInstance = await this.contract.deployed()
        const bl = await hangmanInstance.guessALetter(letter,  {from: account});
    }

    async createGame(word, account) {
        if(!this.contract) {
            throw new Error("Contract is missing!");
        }

        const hangmanInstance = await this.contract.deployed()
        const bl = await hangmanInstance.createGame(word.toUpperCase(),  {from: account});
    }
}
