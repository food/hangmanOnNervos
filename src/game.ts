enum  GameStatusEum {
    "Over",
    "Running",
};

enum  WinnerEnum {
    "Creator",
    "Player",
};

export class Game {
    gameStatus: string = "over";
    trysLeft: number = 0;
    winner: string = "none";
    burnedLetters: string[] = [];
    prizeWord: string = "";
    contract: any;
    accountAddress: string;
    gas: number = 6000000;
    gasPrice: string = '0';

    constructor(contract: any, accountAddress: string) {
        this.contract = contract;
        this.accountAddress = accountAddress;
    }

    async collectGameData() {
        if(!this.contract) {
            throw new Error("Contract is missing!");
        }

		const hangmanInstance = this.contract.methods;

        // get simple ones
        const p1 = hangmanInstance.gameStatus().call({from: this.accountAddress});
        const p2 = hangmanInstance.winner().call({from: this.accountAddress});
        const p3 = hangmanInstance.trysLeft().call({from: this.accountAddress});

        // get the others
        const p4 = this.getPrizeWord(hangmanInstance);
        const p5 = this.getburnedLetters(hangmanInstance);

        const [gameStatus, winner, trysLeft] = await Promise.all([p1, p2, p3, p4, p5]);
        this.gameStatus = GameStatusEum[gameStatus];
        this.winner = WinnerEnum[winner];
        this.trysLeft = parseInt(trysLeft , 10);

    }

    async getPrizeWord(hangmanInstance: any) {
        this.prizeWord = "";
        const arrayLength = parseInt(await hangmanInstance.prizeWordLength().call({from: this.accountAddress}), 10);
        for(let i = 0; i < arrayLength; i++){
            this.prizeWord += await hangmanInstance.prizeWordCharFromPostion(i).call();
        }
    }

    async getburnedLetters(hangmanInstance: any) {
        this.burnedLetters = [];
        const arrayLength = parseInt(await hangmanInstance.burnedLettersLength().call({from: this.accountAddress}), 10);
        for(let i = 0; i < arrayLength; i++){
            const bl = await hangmanInstance.burnedLetterFromPostion(i).call();
            this.burnedLetters.push(bl);
        }
    }

    async guessALetter (letter: string) {
        letter = letter.toUpperCase();

        if(!this.contract) {
            throw new Error("Contract is missing!");
        }

		const hangmanInstance = this.contract.methods;
        const gasEstimated = await hangmanInstance.guessALetter(letter).estimateGas({ from: this.accountAddress });
        await hangmanInstance.guessALetter(letter).send({
            gas: gasEstimated,
            from: this.accountAddress
        });
    }

    async createGame(word: string) {
        if(!this.contract) {
            throw new Error("Contract is missing!");
        }

		const hangmanInstance = this.contract.methods;
        const gasEstimated = await hangmanInstance.createGame(word.toUpperCase()).estimateGas({ from: this.accountAddress });
        await hangmanInstance.createGame(word.toUpperCase()).send({
            gas: gasEstimated,
            from: this.accountAddress});
    }
}
