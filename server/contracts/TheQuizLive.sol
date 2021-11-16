pragma solidity >=0.4.21 <0.7.0;

import "./Context.sol";
import "./ERC20.sol";

contract TheQuizLive is Context, ERC20 {
    constructor() public ERC20("TheQuizLive", "TQL") {
        _mint(_msgSender(), 1000000000);
    }

    uint256 correctUser;
    uint256 totalAmount;
    address[] public userList;

    function addUsers(uint256 amount, address userAccount)
        public
        returns (bool)
    {
        userList.push(userAccount);
        correctUser++;
        totalAmount += amount;
        return true;
    }

    function increaseAmount(uint256 amount) public {
        totalAmount += amount;
    }

    function distributor() public {
        uint256 amount = uint256(totalAmount / correctUser) + 10;
        for (uint256 i = 0; i < userList.length; i++) {
            if (address(userList[i]) != address(0)) {
                transfer(userList[i], amount);
                delete userList[i];
            }
        }
        correctUser = 0;
        totalAmount = 0;
    }
}
