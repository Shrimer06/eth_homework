const { Web3 } = require('web3'); // Use the endpoint
const web3 = new Web3('https://mainnet.infura.io/v3/3a65f6a64a7a43dbb1744678d0e33ee0');

async function findFirstContractCreation() {
    let currentBlock = await web3.eth.getBlockNumber();
    let found = false;

    while (!found && currentBlock !== 0) {
        let block = await web3.eth.getBlock(currentBlock, true);
        for (let tx of block.transactions) {
            if (tx.to === null) {
                console.log(`First contract creation transaction found in block ${currentBlock}`);
                console.log(`Transaction hash: ${tx.hash}`);
                found = true;
                break;
            }
        }
        currentBlock--; // Move to the previous block
    }

    if (!found) {
        console.log('No contract creation transaction found.');
    }
}

findFirstContractCreation().catch(console.error);

