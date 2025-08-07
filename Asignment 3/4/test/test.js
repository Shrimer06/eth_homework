const XYZCoin = artifacts.require("XYZCoin");
contract("XYZCoin", async accounts => {
    it("should set the token name correctly", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        assert.equal(await xyzCoinInstance.name(), "XYZCoin", "The token name is not set correctly.");
    });

    it("initial token balance of creator account equals total supply", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let totalSupply = await xyzCoinInstance.totalSupply();
        let creatorBalance = await xyzCoinInstance.balanceOf(accounts[0]);
        assert.equal(creatorBalance.toString(), totalSupply.toString(), "The creator's balance does not equal the total supply.");
    });

    it("tokens can be transferred using transfer() function", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let amount = 10;
        await xyzCoinInstance.transfer(accounts[1], amount, { from: accounts[0] });
        let balance = await xyzCoinInstance.balanceOf(accounts[1]);
        assert.equal(balance.toString(), amount.toString(), "The transfer did not complete correctly.");
    });

    it("allowance can be set and read", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let amount = 10;
        await xyzCoinInstance.approve(accounts[1], amount, { from: accounts[0] });
        let allowance = await xyzCoinInstance.allowance(accounts[0], accounts[1]);
        assert.equal(allowance.toString(), amount.toString(), "The allowance is not set correctly.");
    });

    it("accounts can transfer tokens on behalf of other accounts", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let amount = 10;
        await xyzCoinInstance.approve(accounts[1], amount, { from: accounts[0] });
        await xyzCoinInstance.transferFrom(accounts[0], accounts[2], amount, { from: accounts[1] });
        let balance = await xyzCoinInstance.balanceOf(accounts[2]);
        assert.equal(balance.toString(), amount.toString(), "The transfer on behalf did not complete correctly.");
    });
});