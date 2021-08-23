const HDWalletProvider = require("@truffle/hdwallet-provider");
const seed = "";
const rinkebyUrl = "https://rinkeby.infura.io/v3/c5923576f7f94496bdd34d21d19dd703";

module.exports = {
  networks: {
    development: {
      host: "192.168.178.29",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(seed, rinkebyUrl),
      network_id: 4,       // Ropsten's id
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