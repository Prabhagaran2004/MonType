// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MonadTypeToken
 * @dev ERC20 token for rewarding players in the MonadType game
 */
contract MonadTypeToken is ERC20, Ownable {
    
    constructor(address initialOwner) 
        ERC20("MonadType Token", "MNTYPE") 
        Ownable(initialOwner) 
    {
        // Mint initial supply to deployer (1 million tokens)
        _mint(initialOwner, 1_000_000 * 10**18);
    }

    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Get token decimals
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
