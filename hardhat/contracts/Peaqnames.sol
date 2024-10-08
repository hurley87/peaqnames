// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; // Import the Strings library
import "@openzeppelin/contracts/utils/Pausable.sol"; // Add this import

contract Peaqnames is ERC721Enumerable, ERC721URIStorage, Ownable, Pausable {

    struct Name {
        string name;
        uint256 expiration;
    }

    mapping(uint256 => Name) public names; // Maps tokenId to name details
    mapping(string => uint256) public nameToTokenId; // Maps name to tokenId
    uint256 public nextTokenId;
    uint256 public flatFeePerMonth = 0.01 ether; // Fixed flat fee per month
    mapping(address => bool) public allowlist;

    // Events
    event NameMinted(address indexed renter, uint256 indexed tokenId, string name, uint256 expiration);
    event FeeUpdated(uint256 newFee);
    event AddedToAllowlist(address indexed user);
    event EarlyMintActivated(bool status);
    event NameMintedByOwner(address indexed recipient, uint256 indexed tokenId, string name, uint256 expiration);
        // Add this state variable near the top of the contract
    bool public earlyMintActive;

    constructor() ERC721("Peaqnames", "PEAQNAMES") Ownable(msg.sender) {
        earlyMintActive = true; // Set early minting to active from the start
        _pause();
    }

    // Function to resolve a name to an address
    function resolveName(string memory _name) external view returns (address) {
        uint256 tokenId = nameToTokenId[_name];
        require(tokenId != 0, "Name not registered");
        return ownerOf(tokenId); // Return the owner of the token
    }

    // Function to mint a name for a custom period
    function mintName(string memory _name, uint256 _months, string memory _uri) external payable whenNotPaused {
        require(!earlyMintActive, "Public mint not active yet");
        _mintName(_name, _months, _uri);
    }

    // Internal function with the minting logic
    function _mintName(string memory _name, uint256 _months, string memory _uri) internal {
        require(_months >= 1, "Minimum ownership period is 1 month");
        require(msg.value >= _months * flatFeePerMonth, "Insufficient payment");
        require(validateName(_name), "Invalid name format");

        uint256 tokenId = nameToTokenId[_name];

        // Check if the name is available or expired
        if (tokenId != 0) {
            require(isNameAvailable(tokenId), "Name is currently owned");
            _burn(tokenId); // Burn the expired token
        }

        // Assign a new tokenId and expiration
        tokenId = nextTokenId++;
        uint256 expiration = block.timestamp + (_months * 30 days);

        names[tokenId] = Name({
            name: _name,
            expiration: expiration
        });

        nameToTokenId[_name] = tokenId;

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);

        emit NameMinted(msg.sender, tokenId, _name, expiration);
    }

    // Function to check if a name is available (has expired)
    function isNameAvailable(uint256 tokenId) public view returns (bool) {
        return block.timestamp > names[tokenId].expiration;
    }

    // Allow the contract owner to update the flat fee per year
    function setFlatFeePerMonth(uint256 _fee) external onlyOwner {
        flatFeePerMonth = _fee;
        emit FeeUpdated(_fee);
    }

    // Function to get the expiration time for a specific tokenId
    function getExpiration(uint256 tokenId) external view returns (uint256) {
        return names[tokenId].expiration;
    }

    // Name validation function to enforce format rules
    function validateName(string memory _name) internal pure returns (bool) {
        bytes memory byteName = bytes(_name);
        if (byteName.length < 3 || byteName.length > 32) return false; // Adjust name length limits
        for (uint256 i = 0; i < byteName.length; i++) {
            bytes1 char = byteName[i];
            if (
                !(char >= 0x30 && char <= 0x39) && // 0-9
                !(char >= 0x61 && char <= 0x7A)    // a-z
            ) {
                return false;
            }
        }
        return true;
    }

    // Allow the contract owner to withdraw payments
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Function to pause the contract
    function pause() external onlyOwner {
        _pause();
    }

    // Function to unpause the contract
    function unpause() external onlyOwner {
        _unpause();
    }

    // New function to add users to the allowlist
    function addToAllowlist(address[] calldata _users) external onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            allowlist[_users[i]] = true;
            emit AddedToAllowlist(_users[i]);
        }
    }

    // New function to toggle early mint status
    function setEarlyMintActive(bool _status) external onlyOwner {
        earlyMintActive = _status;
        emit EarlyMintActivated(_status);
    }

    // New function for early minting
    function earlyMint(string memory _name, uint256 _months, string memory _uri) external payable {
        require(earlyMintActive, "Early mint is not active");
        require(allowlist[msg.sender], "Not on allowlist");
        
        // Use the existing mintName logic
        _mintName(_name, _months, _uri);
    }

    // let owner reserve a name for free 
    function reserveName(address _recipient, string memory _name, uint256 _months, string memory _uri) external onlyOwner {
        require(_recipient != address(0), "Invalid recipient address");
        
        uint256 tokenId = nameToTokenId[_name];

        // Check if the name is available or expired
        if (tokenId != 0) {
            require(isNameAvailable(tokenId), "Name is currently rented");
            _burn(tokenId); // Burn the expired token
        }

        // Assign a new tokenId and expiration
        tokenId = nextTokenId++;
        uint256 expiration = block.timestamp + (_months * 30 days);

        names[tokenId] = Name({
            name: _name,
            expiration: expiration
        });

        nameToTokenId[_name] = tokenId;

        _mint(_recipient, tokenId);
        _setTokenURI(tokenId, _uri);

        emit NameMintedByOwner(_recipient, tokenId, _name, expiration);
    }

    // Function to renew a name
    function renewName(uint256 tokenId, uint256 _months) external payable whenNotPaused {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");
        require(_months > 0, "Renewal period must be greater than 0");
        require(msg.value >= _months * flatFeePerMonth, "Insufficient payment");

        uint256 newExpiration = names[tokenId].expiration + (_months * 30 days);
        names[tokenId].expiration = newExpiration;

        emit NameMinted(msg.sender, tokenId, names[tokenId].name, newExpiration);
    }

    // Function to get all names owned by an address
    function getNamesByOwner(address owner) external view returns (string[] memory) {
        uint256 balance = balanceOf(owner);
        string[] memory ownedNames = new string[](balance);
        
        uint256 index = 0;
        for (uint256 i = 0; i < nextTokenId; i++) {
            if (ownerOf(i) == owner) {
                ownedNames[index] = names[i].name;
                index++;
            }
        }
        
        return ownedNames;
    }

      // Override functions to resolve conflicts
  function _increaseBalance(
    address account,
    uint128 value
  ) internal virtual override(ERC721, ERC721Enumerable) {
    super._increaseBalance(account, value);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
    return super._update(to, tokenId, auth);
  }

  function supportsInterface(
    bytes4 interfaceId
  )
    public
    view
    virtual
    override(ERC721Enumerable, ERC721URIStorage)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(
    uint256 tokenId
  ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function _exists(uint256 tokenId) internal view returns (bool) {
    return _ownerOf(tokenId) != address(0);
  }
}
