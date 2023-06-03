import { ethers } from "hardhat";
import Web3 from "web3";
import chai from "chai";
import { solidity } from "ethereum-waffle";
chai.use(solidity);
const { expect } = chai;
const web3 = new Web3();
import { JediCoin__factory } from "../typechain";


describe("JediCoin", function () {
    let owner: any;
    let ownerAddress: string;
    let jediCoin: any;
    let jediCoinFactory: any;
    let jediCoinAddress: string;
    let uniswapV2Pair: any;
    let uniswapV2PairAddress: string;
    let public1: any;
    let public2: any;
    let publicAddress1: string;
    let publicAddress2: string;
    let bot1: any;
    let bot2: any;
    let bot3: any;
    let bot4: any;
    let bot5: any;
    let botAddress1: string;
    let botAddress2: string;
    let botAddress3: string;
    let botAddress4: string;
    let botAddress5: string;
    let botAddresses: string[];
    let ownerInstance: any;
    let addInstance1: any;
    let addInstance2: any;
    let botInstance1: any;
    let botInstance2: any;
    let botInstance3: any;
    let botInstance4: any;
    let botInstance5: any;
    let publicInstance1: any;
    let publicInstance2: any;
    let uniswapV2PairInstance: any;

    const zeroAddress = "0x0000000000000000000000000000000000000000";   

    beforeEach(async function () {
        [owner, public1, public2, uniswapV2Pair, bot1, bot2, bot3, bot4, bot5] = await ethers.getSigners();
        ownerAddress = await owner.getAddress();
        publicAddress1 = await public1.getAddress();
        publicAddress2 = await public2.getAddress();
        uniswapV2PairAddress = await uniswapV2Pair.getAddress();
        botAddress1 = await bot1.getAddress();
        botAddress2 = await bot2.getAddress();
        botAddress3 = await bot3.getAddress();
        botAddress4 = await bot4.getAddress();
        botAddress5 = await bot5.getAddress();
        botAddresses = [botAddress2, botAddress3, botAddress4];

        jediCoinFactory = new JediCoin__factory(owner);
        jediCoin = await jediCoinFactory.deploy();
        jediCoinAddress = jediCoin.address;

        ownerInstance = new JediCoin__factory(owner).attach(jediCoinAddress);
        publicInstance1 = new JediCoin__factory(public1).attach(jediCoinAddress);
        publicInstance2 = new JediCoin__factory(public2).attach(jediCoinAddress);
        uniswapV2PairInstance = new JediCoin__factory(uniswapV2Pair).attach(jediCoinAddress);
        botInstance1 = new JediCoin__factory(bot1).attach(jediCoinAddress);
        botInstance2 = new JediCoin__factory(bot2).attach(jediCoinAddress);
        botInstance3 = new JediCoin__factory(bot3).attach(jediCoinAddress);
        botInstance4 = new JediCoin__factory(bot4).attach(jediCoinAddress);
        botInstance5 = new JediCoin__factory(bot5).attach(jediCoinAddress);

    });

    it("Should have correct name, symbol, and decimals", async function () {
        expect(await jediCoin.name()).to.equal("JediCoin");
        expect(await jediCoin.symbol()).to.equal("JEDI");
        expect(await jediCoin.decimals()).to.equal(18);
    });

    it("Should have correct initial supply", async function () {
        expect(await jediCoin.totalSupply()).to.equal("369000000000000000000000000000");
    });

    it("Should have correct initial owner balance", async function () {
        expect(await jediCoin.balanceOf(owner.address)).to.equal("369000000000000000000000000000");
    });

    it("Should have the correct owner", async function () {
        expect(await jediCoin.owner()).to.equal(owner.address);
    });

    it("Should not allow renouncing ownership", async function () {
        await expect(ownerInstance.renounceOwnership()).to.be.revertedWith("JediCoin: ban is still active");
        expect(await jediCoin.isBanActive()).to.equal(true);
        await expect(ownerInstance.desactivateBan()).to.emit(jediCoin, "BanDesactivated");
        expect(await jediCoin.isBanActive()).to.equal(false);
        await expect(ownerInstance.renounceOwnership()).to.be.revertedWith("JediCoin: uniswapV2Pair is not set");
    });

    it("Should allow renouncing ownership after uniswapV2Pair is set", async function () {
        expect(await jediCoin.isBanActive()).to.equal(true);
        await expect(ownerInstance.desactivateBan()).to.emit(jediCoin, "BanDesactivated");
        expect(await jediCoin.isBanActive()).to.equal(false);
        await expect(ownerInstance.setPair(uniswapV2Pair.address))
            .to.emit(jediCoin, "SetPair(address)")
            .withArgs(uniswapV2Pair.address);
        await expect(ownerInstance.renounceOwnership()).to.emit(jediCoin, "OwnershipTransferred");
        expect(await jediCoin.owner()).to.equal(zeroAddress);
    });

    it("Should allow transfers from/to owner", async function () {
        expect(await jediCoin.balanceOf(publicAddress1)).to.equal("0");
        await expect(ownerInstance.transfer(publicAddress1, "100000000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(ownerAddress, publicAddress1, "100000000000000000000000000000");  
        expect(await jediCoin.balanceOf(publicAddress1)).to.equal("100000000000000000000000000000");
        expect(await jediCoin.balanceOf(ownerAddress)).to.equal("269000000000000000000000000000");
        await expect(publicInstance1.transfer(ownerAddress, "100000000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(publicAddress1, ownerAddress, "100000000000000000000000000000");
        expect(await jediCoin.balanceOf(ownerAddress)).to.equal("369000000000000000000000000000");
        expect(await jediCoin.balanceOf(publicAddress1)).to.equal("0");
    });

    it("Should allow transfer by owner's spender", async function () {
        expect(await jediCoin.balanceOf(publicAddress2)).to.equal("0");
        await expect(ownerInstance.approve(publicAddress1, "100000000000000000000000000000"))
            .to.emit(jediCoin, "Approval")
            .withArgs(ownerAddress, publicAddress1, "100000000000000000000000000000");
        await expect(publicInstance1.transferFrom(ownerAddress, publicAddress2, "100000000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(ownerAddress, publicAddress2, "100000000000000000000000000000");
        expect(await jediCoin.balanceOf(publicAddress2)).to.equal("100000000000000000000000000000");
        expect(await jediCoin.balanceOf(ownerAddress)).to.equal("269000000000000000000000000000");
        expect(await jediCoin.balanceOf(publicAddress1)).to.equal("0");
    });

    it("Should not allow trading yet", async function () {
        await expect(publicInstance1.transfer(publicAddress2, "100000000000000000000000000000"))
            .to.be.revertedWith("JediCoin: trading has not started yet");
    });

    it("Should set uniswapv2 pair and transfer/burn", async function () {
        expect(await jediCoin.uniswapV2Pair()).to.equal(zeroAddress);
        await expect(ownerInstance.setPair(uniswapV2Pair.address))
            .to.emit(jediCoin, "SetPair(address)")
            .withArgs(uniswapV2Pair.address);
        expect(await jediCoin.uniswapV2Pair()).to.equal(uniswapV2Pair.address);

        await expect(ownerInstance.transfer(publicAddress1, "100000000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(ownerAddress, publicAddress1, "100000000000000000000000000000");
        await expect(publicInstance1.transfer(publicAddress2, "100000000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(publicAddress1, publicAddress2, "100000000000000000000000000000");
        expect(await jediCoin.balanceOf(publicAddress2)).to.equal("100000000000000000000000000000");
        expect(await jediCoin.balanceOf(publicAddress1)).to.equal("0");

        expect(await jediCoin.balanceOf(ownerAddress)).to.equal("269000000000000000000000000000");
        await expect(ownerInstance.burn("100000000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(ownerAddress, zeroAddress, "100000000000000000000000000000");
        expect(await jediCoin.balanceOf(ownerAddress)).to.equal("169000000000000000000000000000");
    });

    it("Should set uniswapv2 pair and ban addresses", async function () {
        expect(await jediCoin.uniswapV2Pair()).to.equal(zeroAddress);
        await expect(ownerInstance.setPair(uniswapV2Pair.address))
            .to.emit(jediCoin, "SetPair(address)")
            .withArgs(uniswapV2PairAddress);
        expect(await jediCoin.uniswapV2Pair()).to.equal(uniswapV2PairAddress);

        await expect(ownerInstance.transfer(uniswapV2PairAddress, "100000000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(ownerAddress, uniswapV2PairAddress, "100000000000000000000000000000");
        expect(await jediCoin.balanceOf(uniswapV2PairAddress)).to.equal("100000000000000000000000000000");

        await expect(ownerInstance.transfer(botAddress1, "100000000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(ownerAddress, botAddress1, "100000000000000000000000000000");
        expect(await jediCoin.balanceOf(botAddress1)).to.equal("100000000000000000000000000000");

        expect(await jediCoin.banned(botAddress1)).to.equal(false);
        await expect(ownerInstance.banBot(botAddress1))
            .to.emit(jediCoin, "BanBot(address, bool)")
            .withArgs(botAddress1, true);
        expect(await jediCoin.banned(botAddress1)).to.equal(true);

        await expect(botInstance1.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.be.revertedWith("JediCoin: this address is banned");

        await expect(uniswapV2PairInstance.transfer(botAddress1, "5000000000000000000000000"))
            .to.be.revertedWith("JediCoin: this address is banned");

        await ownerInstance.unbanBot(botAddress1);
        expect(await jediCoin.banned(botAddress1)).to.equal(false);

        await expect(botInstance1.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(botAddress1, uniswapV2PairAddress, "5000000000000000000000000");
            
        await expect(uniswapV2PairInstance.transfer(botAddress1, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(uniswapV2PairAddress, botAddress1, "5000000000000000000000000");

        expect(await jediCoin.balanceOf(uniswapV2PairAddress)).to.equal("100000000000000000000000000000");

        await ownerInstance.banBots(botAddresses);

        expect(await jediCoin.banned(botAddress2)).to.equal(true);
        expect(await jediCoin.banned(botAddress3)).to.equal(true);
        expect(await jediCoin.banned(botAddress4)).to.equal(true);

        await expect(ownerInstance.transfer(botAddress2, "5000000000000000000000000"));
        await expect(ownerInstance.transfer(botAddress3, "5000000000000000000000000"));
        await expect(ownerInstance.transfer(botAddress4, "5000000000000000000000000"));

        await expect(botInstance2.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.be.revertedWith("JediCoin: this address is banned");

        await expect(botInstance3.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.be.revertedWith("JediCoin: this address is banned");

        await expect(botInstance4.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.be.revertedWith("JediCoin: this address is banned");

        await expect(uniswapV2PairInstance.transfer(botAddress2, "5000000000000000000000000"))
            .to.be.revertedWith("JediCoin: this address is banned");

        await expect(uniswapV2PairInstance.transfer(botAddress3, "5000000000000000000000000"))
            .to.be.revertedWith("JediCoin: this address is banned");

        await expect(publicInstance1.transfer(botAddress4, "5000000000000000000000000"))
            .to.be.revertedWith("JediCoin: this address is banned");

        await ownerInstance.unbanBots(botAddresses);

        expect(await jediCoin.banned(botAddress2)).to.equal(false);
        expect(await jediCoin.banned(botAddress3)).to.equal(false);
        expect(await jediCoin.banned(botAddress4)).to.equal(false);

        await expect(botInstance2.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(botAddress2, uniswapV2PairAddress, "5000000000000000000000000");

        await expect(botInstance3.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(botAddress3, uniswapV2PairAddress, "5000000000000000000000000");

        await expect(botInstance4.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(botAddress4, uniswapV2PairAddress, "5000000000000000000000000");

        await expect(uniswapV2PairInstance.transfer(botAddress2, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(uniswapV2PairAddress, botAddress2, "5000000000000000000000000");

        await expect(uniswapV2PairInstance.transfer(botAddress3, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(uniswapV2PairAddress, botAddress3, "5000000000000000000000000");

        await expect(uniswapV2PairInstance.transfer(botAddress4, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(uniswapV2PairAddress, botAddress4, "5000000000000000000000000");

        expect(await jediCoin.balanceOf(uniswapV2PairAddress)).to.equal("100000000000000000000000000000");
    });

    it("Should let every one perform transfers after renouncing ownership", async function () {
        expect(await jediCoin.uniswapV2Pair()).to.equal(zeroAddress);
        await expect(ownerInstance.setPair(uniswapV2Pair.address))
            .to.emit(jediCoin, "SetPair(address)")
            .withArgs(uniswapV2Pair.address);
        expect(await jediCoin.uniswapV2Pair()).to.equal(uniswapV2Pair.address);

        await expect(ownerInstance.transfer(uniswapV2PairAddress, "100000000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(ownerAddress, uniswapV2PairAddress, "100000000000000000000000000000");
        expect(await jediCoin.balanceOf(uniswapV2PairAddress)).to.equal("100000000000000000000000000000");

        await expect(ownerInstance.transfer(botAddress1, "100000000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(ownerAddress, botAddress1, "100000000000000000000000000000");
        expect(await jediCoin.balanceOf(botAddress1)).to.equal("100000000000000000000000000000");

        await expect(ownerInstance.transfer(botAddress2, "5000000000000000000000000"));
        await expect(ownerInstance.transfer(botAddress3, "5000000000000000000000000"));
        await expect(ownerInstance.transfer(botAddress4, "5000000000000000000000000"));

        expect(await jediCoin.banned(botAddress1)).to.equal(false);
        await expect(ownerInstance.banBot(botAddress1))
            .to.emit(jediCoin, "BanBot(address, bool)")
            .withArgs(botAddress1, true);
        expect(await jediCoin.banned(botAddress1)).to.equal(true);

        await ownerInstance.banBots(botAddresses);

        expect(await jediCoin.banned(botAddress2)).to.equal(true);
        expect(await jediCoin.banned(botAddress3)).to.equal(true);
        expect(await jediCoin.banned(botAddress4)).to.equal(true);

        expect(await jediCoin.isBanActive()).to.equal(true);
        await expect(ownerInstance.desactivateBan()).to.emit(jediCoin, "BanDesactivated");
        expect(await jediCoin.isBanActive()).to.equal(false);

        await expect(botInstance1.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(botAddress1, uniswapV2PairAddress, "5000000000000000000000000");
            
        await expect(uniswapV2PairInstance.transfer(botAddress1, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(uniswapV2PairAddress, botAddress1, "5000000000000000000000000");

        expect(await jediCoin.balanceOf(uniswapV2PairAddress)).to.equal("100000000000000000000000000000");

        await expect(botInstance2.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(botAddress2, uniswapV2PairAddress, "5000000000000000000000000");

        await expect(botInstance3.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(botAddress3, uniswapV2PairAddress, "5000000000000000000000000");

        await expect(botInstance4.transfer(uniswapV2PairAddress, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(botAddress4, uniswapV2PairAddress, "5000000000000000000000000");

        await expect(uniswapV2PairInstance.transfer(botAddress2, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(uniswapV2PairAddress, botAddress2, "5000000000000000000000000");

        await expect(uniswapV2PairInstance.transfer(botAddress3, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(uniswapV2PairAddress, botAddress3, "5000000000000000000000000");

        await expect(uniswapV2PairInstance.transfer(botAddress4, "5000000000000000000000000"))
            .to.emit(jediCoin, "Transfer")
            .withArgs(uniswapV2PairAddress, botAddress4, "5000000000000000000000000");

        expect(await jediCoin.balanceOf(uniswapV2PairAddress)).to.equal("100000000000000000000000000000");
    });
});
