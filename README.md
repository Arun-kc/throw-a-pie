# Throw a pie 🥧

## Getting Started

Go to [buildspace](https://buildspace.so/) and start building your own Web3 app 🤩

You can follow the project in buildspace for step by step guidance. 

## Installation

```shell
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```

Go ahead and create a sample project 
```shell
npx hardhat
```
Now lets install the dependencies 
```shell
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

Use the following commands to run and test your hardhat project
```shell
 npx hardhat compile
 npx hardhat test

```

For testing out your contract locally use the following command
```shell
npx hardhat node
npx hardhat run scripts/run.js  
```

You can deploy your contract into rinkeby testnet by
```shell
npx hardhat run scripts/deploy.js --network rinkeby    
```

Following are some common hardhat commands:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```


