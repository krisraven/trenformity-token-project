//Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// implements the ERC721 standard
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // this makes sure we are meeting the ERC721 standards
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; // fix for _setTokenURI issue
// keeps track of the number of toekns issued
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Accessing the Ownable method ensures that only the creator of the smart contract can interact with it
contract TTPNFT is ERC721URIStorage, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	mapping(string => uint8) hashes; // fix for _setTokenURI

	// the name and symbol for the NFT
	constructor() public ERC721("TrenformityToken", "TTP") {}

	// Create a function to mint the NFT
	// Receiver takes a type of address. This is the wallet address of the user that should receive the NFT minted using the smart contract
	// tokenURI takes a string that contains metadata about the NFT

	function createNFT(address receiver, string memory tokenURI)
		public onlyOwner
		returns (uint256)
	{
		_tokenIds.increment();

		uint256 newItemId = _tokenIds.current();
		_mint(receiver, newItemId);
		_setTokenURI(newItemId, tokenURI);

		// returns the id for the newly created token
		return newItemId;
	}
}
