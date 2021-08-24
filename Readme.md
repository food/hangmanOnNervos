# Hangman

This game is a test only. I need a dApp with etherium contracts to solve https://gitcoin.co/issue/nervosnetwork/grants/8/100026214 so i created a own one to port it now to nervos block chain

A version that is connected to: Rinkeby Testnetzwerk, you can find here:
http://hangman.ethereum.testnet.helmig.berlin/

## Required

- trullfe
- nodejs

## truffle

npm i -g truffle@5.0.2

## gnache in docker

docker run -d -p 8545:8545 --name gnache trufflesuite/ganache-core

## compile an deploy contract

trouffle init
truffle compile
truffle migrate  // truffle migrate --reset

// truffle migrate --network rinkeby

## contract functions

truffle console
    hangman = await Hangman.deployed()
    hangman.createGame("TEST") // upper case no #
    hangman.guessALetter("A") // upper case

    (await hangman.gameStatus()).toNumber()
    (await hangman.trysLeft()).toNumber()
    (await hangman.winner()).toNumber()

    (await hangman.burnedLettersLength()).toNumber()
    await hangman.burnedLetterFromPostion(0))

    (await hangman.prizeWordLength()).toNumber()
    (await hangman.prizeWordCharFromPostion(0))



    (await hangman.lettersLength()).toNumber()
    await hangman.lettersLength(0))
    

npm install -g browserify
browserify main.js -o bundle.js