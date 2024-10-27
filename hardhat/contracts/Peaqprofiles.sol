// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Peaqprofiles is Ownable {

    struct Profile {
        string twitter;
        string website;
        uint256[] skills;
        string description;  // New field
    }

    mapping(address => Profile) private profiles;
    mapping(address => bool) private hasProfile;
    uint256 private totalProfiles;
    
    // Mapping of skill ID to skill name (stored on-chain for this example)
    mapping(uint256 => string) public skillNames;
    uint256 private nextSkillId;  // Tracks the next available skill ID

    event ProfileCreated(address indexed user, string twitter, string website, uint256[] skills, string description);
    event ProfileUpdated(address indexed user, string twitter, string website, uint256[] skills, string description);
    event SkillAdded(uint256 skillId, string skillName);
    event ProfileDeleted(address indexed user);
    event TwitterUpdated(address indexed user, string newTwitter);
    event WebsiteUpdated(address indexed user, string newWebsite);
    event SkillsUpdated(address indexed user, uint256[] newSkills);
    event SkillRemoved(uint256 skillId);
    event SkillUpdated(uint256 skillId, string newName);
    event DescriptionUpdated(address indexed user, string newDescription);

    // Modifier to ensure only the profile owner can update their profile
    modifier onlyProfileOwner(address _address) {
        require(msg.sender == _address, "You are not the owner of this profile.");
        _;
    }

    // Constructor initializes the contract and sets the first skill ID
    constructor() Ownable(msg.sender) {
        nextSkillId = 1;  // Initialize the first skill ID as 1
    }

    // Creates a new profile for the caller. Only one profile per address is allowed.
    function createProfile(string memory _twitter, string memory _website, uint256[] memory _skills, string memory _description) external {
        require(!hasProfile[msg.sender], "Profile already exists.");
        require(!hasDuplicateSkills(_skills), "Duplicate skills are not allowed.");
        
        // Check if all skills exist
        for (uint i = 0; i < _skills.length; i++) {
            require(skillExists(_skills[i]), "One or more skills do not exist.");
        }

        profiles[msg.sender] = Profile(_twitter, _website, _skills, _description);
        hasProfile[msg.sender] = true;
        totalProfiles++;
        emit ProfileCreated(msg.sender, _twitter, _website, _skills, _description);
    }

    // Updates an existing profile. Only the profile owner can update it.
    function updateProfile(string memory _twitter, string memory _website, uint256[] memory _skills, string memory _description) external onlyProfileOwner(msg.sender) {
        require(hasProfile[msg.sender], "Profile does not exist.");
        require(!hasDuplicateSkills(_skills), "Duplicate skills are not allowed.");
        
        // Check if all skills exist
        for (uint i = 0; i < _skills.length; i++) {
            require(skillExists(_skills[i]), "One or more skills do not exist.");
        }
        
        profiles[msg.sender] = Profile(_twitter, _website, _skills, _description);
        emit ProfileUpdated(msg.sender, _twitter, _website, _skills, _description);
    }

    // Retrieves a profile by address. Returns Twitter, Website, Skills (as integers), and Description.
    function viewProfile(address _user) external view returns (string memory, string memory, uint256[] memory, string memory) {
        require(hasProfile[_user], "Profile does not exist.");
        Profile memory userProfile = profiles[_user];
        return (userProfile.twitter, userProfile.website, userProfile.skills, userProfile.description);
    }

    // Adds a new skill to the skill list. Only the contract owner can call this.
    function addSkill(string memory skillName) external onlyOwner {
        skillNames[nextSkillId] = skillName;

        emit SkillAdded(nextSkillId, skillName);

        nextSkillId++;  // Increment the next available skill ID
    }

    // Retrieves the skill name associated with a given skill ID
    function getSkillName(uint256 skillId) external view returns (string memory) {
        return skillNames[skillId];
    }

    // Deletes the caller's profile. Only the profile owner can delete it.
    function deleteProfile() external onlyProfileOwner(msg.sender) {
        require(hasProfile[msg.sender], "Profile does not exist.");
        delete profiles[msg.sender];
        hasProfile[msg.sender] = false;
        emit ProfileDeleted(msg.sender);
    }

    // Updates only the Twitter handle of the caller's profile
    function updateTwitter(string memory _twitter) external onlyProfileOwner(msg.sender) {
        require(hasProfile[msg.sender], "Profile does not exist.");
        profiles[msg.sender].twitter = _twitter;
        emit TwitterUpdated(msg.sender, _twitter);
    }

    // Updates only the website of the caller's profile
    function updateWebsite(string memory _website) external onlyProfileOwner(msg.sender) {
        require(hasProfile[msg.sender], "Profile does not exist.");
        profiles[msg.sender].website = _website;
        emit WebsiteUpdated(msg.sender, _website);
    }

    // Updates only the skills of the caller's profile
    function updateSkills(uint256[] memory _skills) external onlyProfileOwner(msg.sender) {
        require(hasProfile[msg.sender], "Profile does not exist.");
        require(!hasDuplicateSkills(_skills), "Duplicate skills are not allowed.");
        
        // Check if all skills exist
        for (uint i = 0; i < _skills.length; i++) {
            require(skillExists(_skills[i]), "One or more skills do not exist.");
        }
        
        profiles[msg.sender].skills = _skills;
        emit SkillsUpdated(msg.sender, _skills);
    }

    // Checks if a profile exists for a given address
    function profileExists(address _user) external view returns (bool) {
        return hasProfile[_user];
    }

    // Returns the total number of profiles created
    function getTotalProfiles() external view returns (uint256) {
        return totalProfiles;
    }

    // Removes a skill from the skill list. Only the contract owner can call this.
    function removeSkill(uint256 skillId) external onlyOwner {
        require(bytes(skillNames[skillId]).length != 0, "Skill does not exist");
        delete skillNames[skillId];
        emit SkillRemoved(skillId);
    }

    // Updates the name of an existing skill. Only the contract owner can call this.
    function updateSkillName(uint256 skillId, string memory newName) external onlyOwner {
        require(bytes(skillNames[skillId]).length != 0, "Skill does not exist");
        skillNames[skillId] = newName;
        emit SkillUpdated(skillId, newName);
    }

    // Returns the total number of skills in the skill list
    function getSkillsCount() external view returns (uint256) {
        return nextSkillId - 1;
    }

    // Add this new function to check if a skill exists
    function skillExists(uint256 skillId) public view returns (bool) {
        return bytes(skillNames[skillId]).length > 0;
    }

    // Add this helper function to check for duplicate skills
    function hasDuplicateSkills(uint256[] memory skills) private pure returns (bool) {
        for (uint i = 0; i < skills.length; i++) {
            for (uint j = i + 1; j < skills.length; j++) {
                if (skills[i] == skills[j]) {
                    return true;
                }
            }
        }
        return false;
    }

    // New function to update only the description
    function updateDescription(string memory _description) external onlyProfileOwner(msg.sender) {
        require(hasProfile[msg.sender], "Profile does not exist.");
        profiles[msg.sender].description = _description;
        emit DescriptionUpdated(msg.sender, _description);
    }
}
