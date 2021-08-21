App = {
    web3Provider: null,
	overview: "#overview",
    interactions: "#interactions",
    over: "#over",

    init: async () => {
		App.bindEvents();
      	await App.initWeb3();  

		const hangmanContracts = await App.initContract();

		game = new Game(hangmanContracts);
		
		await App.reloadGameData();
    },

	initWeb3: async () => {
		// Modern dapp browsers...
		if (window.ethereum) {
			if(window.ethereum.chainId === "0x4" || window.ethereum.chainId === "0x539") {
				App.web3Provider = window.ethereum;
				try {
					// Request account access
					await window.ethereum.enable();
				} catch (error) {
					// User denied account access...
					console.error("User denied account access")
				}
			} else {
				$("#error").text("Please connect to Rinkeby Testnetzwerk and reload");
			}
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			App.web3Provider = window.web3.currentProvider;
		}
		// If no injected web3 instance is detected, fall back to Ganache
		else {
			App.web3Provider = new Web3.providers.HttpProvider("http://localhost:85452");
		}

		
  	},

	initContract: async () => {
		const HangmanArtifact = await $.getJSON("Hangman.json");
		// Get the necessary contract artifact file and instantiate it with @truffle/contract
		const hangmanContracts = TruffleContract(HangmanArtifact);
	
		// Set the provider for our contract
		hangmanContracts.setProvider(App.web3Provider);
		return hangmanContracts;
	},

  	bindEvents: () => {
    	$(document).on("click", ".btn-guess", App.handleGuessALetter);
    	$(document).on("click", ".btn-create", App.handleCreateGame);
  	},

	handleGuessALetter: async (event) => {
		event.preventDefault();
		const val = $("#guessLetter").val();
		if(!val || val === ""){
			throw new Error("No character given");
		}
		
		const accounts = await ethereum.request({ method: 'eth_accounts' });
		await game.guessALetter(val, accounts[0]);
		$("#guessLetter").val("");
		await App.reloadGameData();
	},

	handleCreateGame: async (event) => {
		event.preventDefault();
		const val = $("#newWord").val();
		if(!val || val === ""){
			throw new Error("No word given");
		}
		
		const accounts = await ethereum.request({ method: 'eth_accounts' });
		await game.createGame(val, accounts[0]);
		await App.reloadGameData();
		$("#newWord").val("");
	},

	reloadGameData: async () =>{
		// reload game data
		await game.collectGameData();

		if(game.gameStatus === "Over") {
			$("#winner").text(game.winner);
			$("#loading").hide();
			$("#runningGame").hide();
			$("#gameOver").show();
		} else {
			$("#pictureBox").html(`<img src="/img/${game.trysLeft}.png" alt="hangman ${game.trysLeft}">`);
			$("#burnedLetters").text(game.burnedLetters);
			$("#priceWord").text(game.prizeWord);
			$("#trysLeft").text(game.trysLeft);
			$("#loading").hide();
			$("#gameOver").hide();
			$("#runningGame").show();
		}
	}
};

$(() => {
	$(window).load(async () => {
		await App.init();
	});
});
