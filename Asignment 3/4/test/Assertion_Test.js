const XYZCoin = artifacts.require("XYZCoin");
const truffleAssertions = require('truffle-assertions');

contract("XYZCoin", accounts => {
    const [admin, recipient, anotherAccount] = accounts;

    it("An insufficient balance throws an error when trying to transfer tokens", async () => {
        let instance = await XYZCoin.deployed();
        let balance = await instance.balanceOf(admin);
        await truffleAssertions.reverts(
            instance.transfer(recipient, balance.toNumber() + 1, { from: admin }),
            "Insufficient balance."
        );
    });

    it("Transferring from an account that has not explicitly authorized the transfer should revert the transaction", async () => {
        let instance = await XYZCoin.deployed();
        await truffleAssertions.reverts(
            instance.transferFrom(admin, recipient, 1, { from: anotherAccount }),
            "Insufficient allowance."
        );
    });

   
});
