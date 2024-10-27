// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Events {

    uint256 public totalCheckpoints = 5;
    
    // Mapping to track which checkpoints a user has checked into
    mapping(address => bool[5]) public checkInStatus;

    // Event to emit when a user checks in
    event CheckIn(address indexed user, uint256 checkpoint);

    // Modifier to ensure that the checkpoint is valid and user hasn't checked in already
    modifier canCheckIn(uint256 checkpoint) {
        require(checkpoint < totalCheckpoints, "Invalid checkpoint");
        require(!checkInStatus[msg.sender][checkpoint], "Already checked in to this checkpoint");
        _;
    }

    // Function to check in to a checkpoint
    function checkIn(uint256 checkpoint) external canCheckIn(checkpoint) {
        checkInStatus[msg.sender][checkpoint] = true;
        emit CheckIn(msg.sender, checkpoint);
    }

    // Function to get the check-in status of a user at all checkpoints
    function getCheckInStatus(address user) external view returns (bool[5] memory) {
        return checkInStatus[user];
    }
}