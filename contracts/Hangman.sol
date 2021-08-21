pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Hangman {
    enum Winner {Creator, Player}
    enum GameStatus {Over, Running}

    GameStatus public gameStatus;
    uint public trysLeft;
    Winner public winner;
    string[] burnedLetters;
    string[] letters;
    string[] prizeWord;
    string placeHolder = "#";

    /** internals **/
    function stringToBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    function gameIsWonCheck () public view returns (bool) {
        uint correctLetterCount = 0;
        if(letters.length == prizeWord.length) {
            for (uint i = 0; i < letters.length; i++) {
                if(letters.length >= i && prizeWord.length >= i){
                    if (stringToBytes32(letters[i]) == stringToBytes32(prizeWord[i])) {
                        correctLetterCount++;
                    }
                }
            }
        }

        if(correctLetterCount == letters.length) {
            return true;
        }
        return false;
    }

    /** publics **/
    function createGame(string memory word) public {
        // check length for 1
        require(gameStatus == GameStatus.Over);

        gameStatus = GameStatus.Running;
        winner= Winner.Creator;
        trysLeft = 10;
        delete  burnedLetters;
        delete prizeWord;
        delete letters;

        for(uint i; i < stringToBytes32(word).length ; i++){ 
            if(stringToBytes32(word)[i] != 0) {
                letters.push(bytes32ToString(stringToBytes32(word)[i]));
            }
        }
        for(uint i; i < bytes(word).length ; i++){ 
            prizeWord.push(placeHolder);
        }
    }

    function guessALetter (string memory _letter) public {
        // check length for 1
        require(bytes(_letter).length == 1);
        // game is not over
        require(gameStatus == GameStatus.Running);

        bool success = false;

        for (uint i = 0; i < letters.length; i++) {
            if (stringToBytes32(letters[i]) == stringToBytes32(_letter)) {
                prizeWord[i] = _letter;
                success = true;
            }
        }

        burnedLetters.push(_letter);

        if(!success) {
            trysLeft--;
        }

        if (trysLeft <= 0) {
            gameStatus = GameStatus.Over;
            winner = Winner.Creator;
        } else {
            // check game is won
            if(gameIsWonCheck()) {
                gameStatus = GameStatus.Over;
                winner = Winner.Player;
            }
        }
    }

    /** REQUEST GAME DATA **/
    function burnedLettersLength() public view returns (uint) {
        return burnedLetters.length;
    }

    function burnedLetterFromPostion(uint position) public view returns (string memory) {
        require(burnedLetters.length >= burnedLetters.length);
        
        return burnedLetters[position];
    }

    function prizeWordLength() public view returns (uint) {
        return prizeWord.length;
    }

    function prizeWordCharFromPostion(uint position) public view returns (string memory) { 
        require(prizeWord.length >= prizeWord.length);

        return prizeWord[position];
    }

    // Debug
    /*function lettersLength() public view returns (uint) {
        return letters.length;
    }
    function lettersCharFromPostion(uint position) public view returns (string memory) { 
        return letters[position];
    }*/
}
