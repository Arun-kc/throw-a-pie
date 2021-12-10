//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PiePortal {
    uint256 totalPies;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function pie() public {
        totalPies += 1;
        console.log(unicode"%s has thrown a pie! 🥧", msg.sender);
    }

    function getTotalPies() public view returns (uint256) {
        console.log(unicode"We have %d total pies! 🥧", totalPies);
        return totalPies;
    }
}
