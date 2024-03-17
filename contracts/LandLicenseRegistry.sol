// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./AccessManager.sol";

contract LandLicenseRegistry {
    struct LandLicense {
        address owner;
        string landAddress;
        uint256 area;
        string ipfsHash;
    }

    mapping(uint256 => LandLicense) public landLicenses;
    mapping(address => uint256[]) public userLandLicenses;

    AccessManager public accessManager;

    modifier onlyNotary() {
        require(
            accessManager.hasNotaryRole(msg.sender),
            "Notary permission required"
        );
        _;
    }

    // modifier onlyUser() {
    //     require(
    //         msg.sender == landLicenses[licenseId].owner,
    //         "Only owner can transfer license"
    //     );
    //     _;
    // }

    event LandLicenseRegistered(
        uint256 licenseId,
        address indexed owner,
        string landAddress,
        uint256 area
    );
    event LandLicenseTransferred(uint256 licenseId, address from, address to);

    constructor(AccessManager _accessManager) {
        accessManager = _accessManager;
    }

    function registerLandLicense(
        address _owner,
        uint256 _licenseId,
        string memory _landAddress,
        uint256 _area,
        string memory _ipfsHash
    ) external onlyNotary {
        require(_owner != address(0), "Invalid owner address");
        require(
            bytes(_landAddress).length > 0,
            "Land address must be provided"
        );
        require(_area > 0, "Area must be greater than 0");
        require(bytes(_ipfsHash).length > 0, "ipfsHash must be provided");
        require(
            landLicenses[_licenseId].owner == address(0),
            "Land license with this ID already exists"
        );
        // kiểm tra landLicenses[licenseId] là chưa có

        // uint256 licenseId = landLicenses.length;
        LandLicense storage newLicense = landLicenses[_licenseId];
        newLicense.owner = _owner;
        newLicense.landAddress = _landAddress;
        newLicense.area = _area;
        newLicense.ipfsHash = _ipfsHash;

        userLandLicenses[_owner].push(_licenseId);

        emit LandLicenseRegistered(_licenseId, msg.sender, _landAddress, _area);
    }

    //Xem mình có bao nhiêu miếng đất
    function getUserLandLicenses() external view returns (uint256[] memory) {
        return userLandLicenses[msg.sender];
    }

    // xem ID đất
    function getLandLicense(uint256 _licenseId)
        external
        view
        returns (
            address owner,
            string memory landAddress,
            uint256 area,
            string memory ipfsHash
        )
    {
        LandLicense storage landLicense = landLicenses[_licenseId];
        require(landLicense.owner != address(0), "Land license not found");

        owner = landLicense.owner;
        landAddress = landLicense.landAddress;
        area = landLicense.area;
        ipfsHash = landLicense.ipfsHash;
    }

    function transferLandLicense(uint256 _licenseId, address _newOwner) external {
    LandLicense storage license = landLicenses[_licenseId];
    require(landLicenses[_licenseId].owner != address(0), "Land license does not exist");
    require(license.owner == msg.sender, "Only the owner can transfer the license");
    require(_newOwner != address(0), "Invalid recipient address");

    // Update ownership
    license.owner = _newOwner;

    // Update userLandLicenses mappings
    removeElement(userLandLicenses[msg.sender], _licenseId);
    userLandLicenses[_newOwner].push(_licenseId);

    emit LandLicenseTransferred(_licenseId, msg.sender, _newOwner);
  }

  // Helper function to remove an element from an array (not part of standard solidity)
  function removeElement(uint256[] storage arr, uint256 element) internal {
    for (uint i = 0; i < arr.length; i++) {
      if (arr[i] == element) {
        arr[i] = arr[arr.length - 1];
        arr.pop();
        break;
      }
    }
  }
}

//     function transferLandLicense(uint256 _licenseId, address _newOwner)
//         public
//         onlyUser
//     {
//         require(
//             landLicenses[_licenseId].owner == msg.sender,
//             "Only owner can transfer license"
//         );
//         require(_newOwner != address(0), "Invalid new owner address");

//         // Remove license from current owner's list
//         uint256[] storage ownerLicenses = userLandLicenses[msg.sender];
//         uint256 indexToRemove;
//         for (uint256 i = 0; i < ownerLicenses.length; i++) {
//             if (ownerLicenses[i] == _licenseId) {
//                 indexToRemove = i;
//                 break;
//             }
//         }
//         require(
//             indexToRemove < ownerLicenses.length,
//             "License not found in user's list"
//         );

//         // Remove element at the found index (potentially inefficient for large arrays)
//         ownerLicenses[indexToRemove] = ownerLicenses[ownerLicenses.length - 1];
//         ownerLicenses.pop();

//         // Update owner and add license to new owner's list
//         landLicenses[_licenseId].owner = _newOwner;
//         userLandLicenses[_newOwner].push(_licenseId);

//         emit LandLicenseTransferred(_licenseId, msg.sender, _newOwner);
//     }
// }

// // kiểm tra đất của user
// function getUserLandDetails(address _user) public view returns (uint256[] memory licenseIds, LandLicense[] memory details) {
//         uint256[] memory userLicenses = userLandLicenses[_user];
//         LandLicense[] memory userLandDetails = new LandLicense[](userLicenses.length);

//         for (uint256 i = 0; i < userLicenses.length; i++) {
//             uint256 licenseId = userLicenses[i];
//             LandLicense storage license = landLicenses[licenseId];
//             userLandDetails[i] = license;
//         }

//         return (userLicenses, userLandDetails);
//     }
// }


