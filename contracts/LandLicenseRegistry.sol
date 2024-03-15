// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;


import "./AccessManager.sol";


contract LandLicenseRegistry  {
    struct LandLicense {
        address owner;
        string landAddress;
        uint256 area;
        string ipfsHash;
    }


    mapping(uint256 => LandLicense) public landLicenses;
    mapping(address => uint256[]) public userLandLicenses;



AccessManager public accessManager;


modifier onlyNotary {
    require(accessManager.hasNotaryRole(msg.sender), "Notary permission required");
    _;
}

    event LandLicenseRegistered(uint256 licenseId, address indexed owner, string landAddress, uint256 area);



constructor(AccessManager _accessManager) {
        accessManager = _accessManager;
    }
    
    function registerLandLicense(address _owner, uint256 _licenseId, string memory _landAddress, uint256 _area, string memory _ipfsHash) external onlyNotary {
    require(_owner != address(0), "Invalid owner address");
    require(bytes(_landAddress).length > 0, "Land address must be provided");
    require(_area > 0, "Area must be greater than 0");
    require(bytes(_ipfsHash).length > 0, "ipfsHash must be provided");
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

    function getUserLandLicenses() external view returns (uint256[] memory) {
        return userLandLicenses[msg.sender];
    }

    function getLandLicense(uint256 _licenseId) external view returns (address owner, string memory landAddress, uint256 area, string memory ipfsHash) {
        LandLicense storage landLicense = landLicenses[_licenseId];
        require(landLicense.owner != address(0), "Land license not found");

        owner = landLicense.owner;
        landAddress = landLicense.landAddress;
        area = landLicense.area;
        ipfsHash = landLicense.ipfsHash;
    }
}


