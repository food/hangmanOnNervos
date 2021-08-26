import Web3  from "web3";
import { PolyjuiceHttpProvider, PolyjuiceAccounts } from "@polyjuice-provider/web3";
import { Game } from "./game";
import * as Hangman from "../data/Hangman.json";

const CONFIG = {
    WEB3_PROVIDER_URL: "https://godwoken-testnet-web3-rpc.ckbapp.dev",
    ROLLUP_TYPE_HASH: "0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a",
    ETH_ACCOUNT_LOCK_CODE_HASH: "0x6d6fa9effb1af59c5a6aa73c4d71e510b635d49557a92e1b42d030fed1aee0dc"
};

const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
const polyjuiceConfig = {
    rollupTypeHash: '0x4cc2e6526204ae6a2e8fcf12f7ad472f41a1606d5b9624beebd215d780809f6a',
    ethAccountLockCodeHash: '0xdeec13a7b8e100579541384ccaf4b5223733e4a5483c3aec95ddc4c1d5ea5b22',
    web3Url: godwokenRpcUrl
};

const provider = new PolyjuiceHttpProvider(
    godwokenRpcUrl,
    polyjuiceConfig,
);

// @ts-ignore
const jq = window.$;

export class App {
	web3: Web3;
    web3Provider?: PolyjuiceHttpProvider;
	overview: string = "#overview";
    interactions: string = "#interactions";
    over: string = "#over";
	game?: Game;
	accountAddress: string;

    constructor() {
		this.bindEvents();
    }

	async initWeb3(): Promise<void> {
		// Modern dapp browsers...
		if (window.ethereum) {
			if(window.ethereum.chainId === "0x116e1" || window.ethereum.chainId === "0x539") { // alloow intern and godwoken
				await window.ethereum.request({ method: 'eth_requestAccounts' });
				this.accountAddress = (await window.ethereum.request({ method: 'eth_accounts' }))[0];
				this.web3 = new Web3(provider);
				(window as any).web3 = this.web3;
				this.web3.eth.accounts = new PolyjuiceAccounts(polyjuiceConfig);
				this.web3Provider = provider;
				try {
					// Request account access
					await window.ethereum.enable();
				} catch (error) {
					// User denied account access...
					console.error("User denied account access")
				}
			} else {
				jq("#error").text("Please connect Metamsak to Godwoken Testnet and reload");
			}
		}
  	}

	async loadContractAndGame () {
		const hangmanContracts = await this.initContract();
		this.game = new Game(hangmanContracts, this.accountAddress);
	}

	async initContract () {
		const hangmanContracts = new this.web3.eth.Contract(Hangman.abi as any, "0xA203D7C76a29792dfC926C936D9974e357895077") as any;
		// Set the provider for our contract
		hangmanContracts.setProvider(this.web3Provider);
		return hangmanContracts;
	}

  	bindEvents () {
    	jq(document).on("click", ".btn-guess", this.handleGuessALetter);
    	jq(document).on("click", ".btn-create", this.handleCreateGame);
  	}

	async handleGuessALetter (e: Event): Promise<void> {
		e.preventDefault();
		const val = jq("#guessLetter").val() as string;
		if(!val || val === ""){
			throw new Error("No character given");
		}

		await (window as any).app.game.guessALetter(val);
		jq("#guessLetter").val("");
		await (window as any).app.reloadGameData();
	}

	async handleCreateGame (event: Event) {
		event.preventDefault();
		const val = jq("#newWord").val() as string;
		if(!val || val === ""){
			throw new Error("No word given");
		}

		await (window as any).app.game.createGame(val);
		await (window as any).app.reloadGameData();
		jq("#newWord").val("");
	}

	async reloadGameData () {
		jq("#loading").show();
		// reload game data
		await (window as any).app.game.collectGameData();

		if(this.game!.gameStatus === "Over") {
			jq("#winner").text(this.game!.winner);
			jq("#loading").hide();
			jq("#runningGame").hide();
			jq("#gameOver").show();
		} else {
			jq("#pictureBox").html(`<img src="/img/${this.game.trysLeft}.png" alt="hangman ${this.game.trysLeft}">`);
			jq("#burnedLetters").text(this.game!.burnedLetters.join(","));
			jq("#priceWord").text(this.game!.prizeWord);
			jq("#trysLeft").text(this.game!.trysLeft);
			jq("#loading").hide();
			jq("#gameOver").hide();
			jq("#runningGame").show();
		}
	}
};

jq(() => {
	jq(window).load(async (): Promise<void> => {
		const app = new App();
		(window as any).app = app;
		await app.initWeb3();
		await app.loadContractAndGame();
		await app.reloadGameData();
	});
});
