const HDWalletProvider = require("@truffle/hdwallet-provider");
const seed = "render demise thrive later scan destroy monitor more elegant crazy silk alone";
const godWokenUrl = "https://godwoken-testnet-web3-rpc.ckbapp.dev";

module.exports = {
  networks: {
    development: {
      host: "192.168.178.29",
      port: 8545,
      network_id: "*" // Match any network id
    },
    godwoken: {
      provider: () => new HDWalletProvider(seed, godWokenUrl),
      network_id: 71393,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}