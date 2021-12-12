//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PiePortal {
    uint256 totalPies;

    uint256 private seed;

    event NewPie(address indexed from, uint256 timestamp, string message);

    struct Pie {
        address thrower; // The address of the user who throwed a pie.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user throwed the pie.
    }

    Pie[] pies;

    mapping(address => uint256) public lastThrowedAt;

    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart");
        seed = (block.timestamp + block.difficulty) % 100;
    }
    

    function pie(string memory _message) public {

        require(
            lastThrowedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastThrowedAt[msg.sender] = block.timestamp;


        totalPies += 1;
        console.log(unicode"%s has thrown a pie! 🥧", msg.sender);
        console.log("%s waved w/ message %s", msg.sender, _message);

        pies.push(Pie(msg.sender, _message, block.timestamp));

        seed = (block.difficulty + block.timestamp + seed) % 100;
        
        console.log("Random # generated: %d", seed);

        /*
         * Give a 50% chance that the user wins the prize.
         */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewPie(msg.sender, block.timestamp, _message);
    }

    function getAllPies() public view returns (Pie[] memory) {
        return pies;
    }

    function getTotalPies() public view returns (uint256) {
        console.log(unicode"We have %d total pies! 🥧", totalPies);
        return totalPies;
    }
}
