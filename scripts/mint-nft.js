require("dotenv").config();

const API_URL = process.env.API_URL;
const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const WALLET_RECEIVER_ADDRESS = process.env.WALLET_RECEIVER_ADDRESS;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contractAddress = process.env.CONTRACT_ADDRESS;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const alchemyWeb3 = createAlchemyWeb3(API_URL);
const contract = require("../artifacts/contracts/ttpNFT.sol/TTPNFT.json");

const nftContract = new alchemyWeb3.eth.Contract(contract.abi, contractAddress);
const METAMASK_PUBLIC_KEY = process.env.METAMASK_PUBLIC_KEY;


async function mintNFT(tokenURI) {
	const nonce = await alchemyWeb3.eth.getTransactionCount(
		METAMASK_PUBLIC_KEY,
		"latest"
	);
	/**
	 * the nonce is needed for security reasons
	 * It keeps track of transaction sent from our address and prevents replay attacks
	 */
	const tx = {
		from: METAMASK_PUBLIC_KEY,
		to: contractAddress,
		nonce: nonce, // nonce with the number of transactions from our account
		gas: 1000000, // fee estimate to complete the transaction
		data: nftContract.methods
			.createNFT(WALLET_RECEIVER_ADDRESS, tokenURI)
			.encodeABI()
	};

	const signPromise = alchemyWeb3.eth.accounts.signTransaction(
		tx,
		METAMASK_PRIVATE_KEY
	);
	signPromise
		.then(signedTx => {
			alchemyWeb3.eth.sendSignedTransaction(
				signedTx.rawTransaction,
				function (error, hash) {
					if (!error) {
						console.log(
							"The hash of our transaction is: ",
							hash,
							"Check Alchemy's Mempool to view the status of our transaction!"
						);
					} else {
						console.log(
							"Something went wrong when submitting our transaction: ",
							error
						);
					}
				}
			);
		})
		.catch(error => {
			console.log("Promise failed: ", error);
		});
}

mintNFT("https://ipfs.io/ipfs/Qmc7hUiDnRaP5wifX8wJANT6Str8c4oVphQ5yNVatzLqqA");
