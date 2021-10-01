async function contract() {
	const [deployer] = await ethers.getSigners();
	console.log("Deploying contracts with the account: ", deployer.address);

	console.log("Account balance:", (await deployer.getBalance()).toString());
	const token = await ethers.getContractFactory("TTPNFT");

	// Start deployment, returning a promise that resolves to a contract object
	const ttp = await token.deploy();
	console.log("Contract deployed to address:", ttp.address);
}

contract()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
