module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      gas: 4700000,
      gasPrice: 10000000000, // 10 gwei
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    kovan: {
      gas: 4700000,
      gasPrice: 10000000000, // 10 gwei
      host: "localhost",
      port: 8545,
      network_id: "42"
    },
    ropsten: {
      gas: 4700000,
      gasPrice: 10000000000, // 10 gwei
      host: "localhost",
      port: 8545,
      network_id: "3"
    }
  }
};
