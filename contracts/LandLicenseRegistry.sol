// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AccessManager.sol";
import "./SafeMath.sol";

contract LandLicenseRegistry {
    using SafeMath for uint256;
    uint256 public LandLicenseCount;

    struct LandLicense {
        address owner;
        string ipfsHash;
        address notary;
    }

    mapping(string => LandLicense) public landLicenses;
    mapping(address => string[]) public userLandLicenses;
    // mapping token to owners
    mapping(string => address[]) tokenToOwners;
    // mapping token to owner approved (activate || sell)
    mapping(string => address[]) tokenToApprovals;
    // mapping token to state of token
    mapping(string => State) public tokenToState; // Default: 0 => 'PENDDING' //require điều kiện
    // mapping token to notary
    mapping(string => address) public tokenToNotary;
    mapping(string => bool) public licenseExists;

    enum State {
        PENDDING,
        ACTIVATED,
        IN_TRANSACTION
    }

    constructor(AccessManager _accessManager) {
        accessManager = _accessManager;
    }

    AccessManager public accessManager;
    // -------------------------------------modifier---------------------------------------------------------------------
    modifier onlyNotary() {
        require(
            accessManager.hasNotaryRole(msg.sender),
            "Notary permission required"
        );
        _;
    }

    modifier onlyPending(string memory _id) {
        require(
            tokenToState[_id] == State.PENDDING,
            "RealEstate: Require state is PENDDING"
        );
        _;
    }

    modifier onlyActivated(string memory _id) {
        require(
            tokenToState[_id] == State.ACTIVATED,
            "RealEstate: Require state is ACTIVATED"
        );
        _;
    }

    modifier onlyInTransaction(string memory _id) {
        require(
            tokenToState[_id] == State.IN_TRANSACTION,
            "RealEstate: Require state is iN_TRANSACTION"
        );
        _;
    }

    event LandLicenseRegistered(
        string licenseId,
        address indexed owner,
        address notary
    );

    event Activate(string licenseId, address owner, State state);

    event Transfer(string licenseId, address oldOwner, address newOwner);

    function registerLandLicense(
        address _owner,
        string memory _licenseId,
        string memory _ipfsHash,
        address _notary
    ) public onlyNotary {
        require(_owner != address(0), "Invalid owner address");
        require(
            _owner != _notary,
            "Owner and notary cannot be the same address"
        );

        require(bytes(_ipfsHash).length > 0, "ipfsHash must be provided");
        require(
            !licenseExists[_licenseId], // Kiểm tra xem licenseId đã tồn tại chưa
            "Land license with this ID already exists"
        );

        LandLicense storage newLicense = landLicenses[_licenseId];
        newLicense.owner = _owner;
        newLicense.ipfsHash = _ipfsHash;
        newLicense.notary = _notary;

        userLandLicenses[_owner].push(_licenseId);
        LandLicenseCount = LandLicenseCount.add(1);
        tokenToOwners[_licenseId].push(_owner);

        tokenToNotary[_licenseId] = msg.sender;
        licenseExists[_licenseId] = true;
        emit LandLicenseRegistered(_licenseId, _owner, _notary);
    }

    function getUserLandLicenses() external view returns (string[] memory) {
        return userLandLicenses[msg.sender];
    }

    function activate(string memory _Id) public onlyPending(_Id) {
        tokenToApprovals[_Id].push(msg.sender);
        if (tokenToApprovals[_Id].length == tokenToOwners[_Id].length) {
            tokenToState[_Id] = State.ACTIVATED;
            delete tokenToApprovals[_Id];
        }
        emit Activate(_Id, msg.sender, tokenToState[_Id]);
    }

    function transferLandOwnership(
        string memory _licenseId,
        address _newOwner
    ) external onlyInTransaction(_licenseId) {
        require(
            _newOwner != address(0),
            "The new owner's address is not valid"
        );

        LandLicense storage landLicense = landLicenses[_licenseId];
        require(
            landLicense.owner != address(0),
            "Land license with this ID does not exist"
        );

        address[] storage currentOwners = tokenToOwners[_licenseId];
        require(
            currentOwners.length > 0,
            "There are no current owners of the land to transfer"
        );

        // require(
        //     currentOwners[0] == msg.sender,
        //     "You are not the current owner of the land"
        // );

        landLicense.owner = _newOwner;
        currentOwners[0] = _newOwner;

        emit Transfer(_licenseId, msg.sender, _newOwner);
    }

    function isActivated(string memory _id) public view returns (bool) {
        return tokenToState[_id] == State.ACTIVATED;
    }

    function getOwnersOfCert(
        string memory _licenseId
    ) external view returns (address[] memory) {
        return tokenToOwners[_licenseId];
    }

    function getOwnersOf(
        string memory _id
    ) public view returns (address[] memory) {
        return tokenToOwners[_id];
    }

    function getOwnerApproved(
        string memory _id
    ) public view returns (address[] memory) {
        return tokenToApprovals[_id];
    }

    function getRepresentativeOfOwners(
        string memory _licenseId
    ) external view returns (address) {
        return tokenToOwners[_licenseId][0];
    }

    function getStateOfCert(
        string memory _licenseId
    ) external view returns (State) {
        require(licenseExists[_licenseId], "License ID does not exist");
        return tokenToState[_licenseId];
    }

    function setStateOfCertInTransaction(string memory _licenseId) external {
        tokenToState[_licenseId] = State.IN_TRANSACTION;
    }

    function setStateOfCertOutTransaction(string memory _licenseId) external {
        tokenToState[_licenseId] = State.ACTIVATED;
    }
}
