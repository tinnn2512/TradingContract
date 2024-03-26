// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./AccessManager.sol";
import "./SafeMath.sol";

contract LandLicenseRegistry {
    using SafeMath for uint256;
    uint256 public LandLicenseCount;

    struct LandLicense {
        address owner;
        string landAddress;
        uint256 area;
        string ipfsHash;
        address notary;
    }
 // fix landLicense => Khi chuyển nhượng cho owner mới.
    mapping(uint256 => LandLicense) public landLicenses;
    mapping(address => uint256[]) public userLandLicenses;
    // mapping token to owners
    mapping(uint256 => address[]) tokenToOwners;
    // mapping token to owner approved (activate || sell)
    mapping(uint256 => address[]) tokenToApprovals;
    // mapping token to state of token
    mapping(uint256 => State) public tokenToState; // Default: 0 => 'PENDDING' //require điều kiện
    // mapping token to notary
    mapping(uint256 => address) public tokenToNotary;
    mapping(uint256 => bool) public licenseExists; 
    
    

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

    modifier onlyPending(uint256 _id) {
        require(
            tokenToState[_id] == State.PENDDING,
            "RealEstate: Require state is PENDDING"
        );
        _;
    }

    modifier onlyActivated(uint256 _id) {
        require(
            tokenToState[_id] == State.ACTIVATED,
            "RealEstate: Require state is ACTIVATED"
        );
        _;
    }

    modifier onlyInTransaction(uint256 _id) {
        require(
            tokenToState[_id] == State.IN_TRANSACTION,
            "RealEstate: Require state is iN_TRANSACTION"
        );
        _;
    }
  

    // modifier onlyOwnerOf(uint256 _id) {
    //     require(
    //         _checkExitInArray(tokenToOwners[_id], msg.sender),
    //         "RealEstate: You're not owner of certificate"
    //     );
    //     _;
    // }
    // ---------------------------------------event--------------------------------------------------------------------
    event LandLicenseRegistered(
        uint256 licenseId,
        address indexed owner,
        address notary
    );

    event Activate(uint256 licenseId, address owner, State state);

    event Transfer(uint256 licenseId, address oldOwner, address newOwner);

    // --------------------------------------------------function---------------------------------------------------------------
    function registerLandLicense(
        address _owner,
        uint256 _licenseId,
        string memory _landAddress,
        uint256 _area,
        string memory _ipfsHash,
        address _notary
    ) public onlyNotary {
        require(_owner != address(0), "Invalid owner address");
        require(
            _owner != _notary,
            "Owner and notary cannot be the same address"
        );
        require(
            bytes(_landAddress).length > 0,
            "Land address must be provided"
        );
        require(_area > 0, "Area must be greater than 0");
        require(bytes(_ipfsHash).length > 0, "ipfsHash must be provided");
         require(
            !licenseExists[_licenseId], // Kiểm tra xem licenseId đã tồn tại chưa
            "Land license with this ID already exists"
        );

        // uint256 licenseId = landLicenses.length;
        LandLicense storage newLicense = landLicenses[_licenseId];
        newLicense.owner = _owner;
        newLicense.landAddress = _landAddress;
        newLicense.area = _area;
        newLicense.ipfsHash = _ipfsHash;
        newLicense.notary = _notary;

        userLandLicenses[_owner].push(_licenseId);
        LandLicenseCount = LandLicenseCount.add(1);
        tokenToOwners[LandLicenseCount].push(_owner);

        tokenToNotary[LandLicenseCount] = msg.sender;
         licenseExists[_licenseId] = true;
        emit LandLicenseRegistered(LandLicenseCount, _owner, _notary);
    }

    function getUserLandLicenses() external view returns (uint256[] memory) {
        return userLandLicenses[msg.sender];
    }

    function activate(uint256 _Id) public onlyPending(_Id) {
        // require(
        tokenToApprovals[_Id].push(msg.sender);
        // if all owner approved => set state of certificate to 'ACTIVATED'
        if (tokenToApprovals[_Id].length == tokenToOwners[_Id].length) {
            tokenToState[_Id] = State.ACTIVATED;
            // set user approve to null
            delete tokenToApprovals[_Id];
        }
        emit Activate(_Id, msg.sender, tokenToState[_Id]);
    }

    function transferLandOwnership(uint256 _licenseId, address _newOwner)
        external
        onlyInTransaction(_licenseId)
    {
        // Đảm bảo địa chỉ của chủ mới là hợp lệ
        require(
            _newOwner != address(0),
            "The new owner's address is not valid"
        );
         LandLicense storage landLicense = landLicenses[_licenseId];
          // Đảm bảo rằng giấy phép đất tồn tại
    require(
        landLicense.owner != address(0),
        "Land license with this ID does not exist"
    );
        // Lấy danh sách các chủ sở hữu hiện tại của đất từ mapping
        address[] storage currentOwners = tokenToOwners[_licenseId];
        // Đảm bảo rằng đang có ít nhất một chủ sở hữu hiện tại của đất để chuyển nhượng
        require(
            currentOwners.length > 0,
            "There are no current owners of the land to transfer"
        );
        // Đảm bảo rằng người gọi hàm là chủ sở hữu hiện tại của đất
        require(
            currentOwners[0] == msg.sender,
            "You are not the current owner of the land"
        );
        // Cập nhật địa chỉ chủ sở hữu mới cho đất trong mapping landLicenses
          landLicense.owner = _newOwner;

        // Cập nhật địa chỉ chủ sở hữu mới cho đất
        currentOwners[0] = _newOwner;

        emit Transfer(_licenseId, msg.sender, _newOwner);
    }

    // Kiểm tra xem chứng chỉ có được kích hoạt không
    function isActivated(uint256 _id) public view returns (bool) {
        return tokenToState[_id] == State.ACTIVATED;
    }

    // Lấy danh sách các chủ sở hữu của chứng chỉ
    function getOwnersOfCert(uint256 _licenseId)
        external
        view
        returns (address[] memory)
    {
        return tokenToOwners[_licenseId];
    }

    // Lấy danh sách các chủ sở hữu của một tài sản
    function getOwnersOf(uint256 _id) public view returns (address[] memory) {
        return tokenToOwners[_id];
    }

    // Lấy danh sách các chủ sở hữu đã chấp thuận cho một chứng chỉ
    function getOwnerApproved(uint256 _id)
        public
        view
        returns (address[] memory)
    {
        return tokenToApprovals[_id];
    }

    // Lấy đại diện của các chủ sở hữu
    function getRepresentativeOfOwners(uint256 _licenseId)
        external
        view
        returns (address)
    {
        return tokenToOwners[_licenseId][0];
    }

    // Lấy trạng thái của một chứng chỉ
    function getStateOfCert(uint256 _licenseId) external view returns (State) {
    require(licenseExists[_licenseId], "License ID does not exist");
    return tokenToState[_licenseId];
}


    // Đặt trạng thái của chứng chỉ vào quá trình giao dịch
    function setStateOfCertInTransaction(uint256 _licenseId) external {
        tokenToState[_licenseId] = State.IN_TRANSACTION;
    }

    // Đặt trạng thái của chứng chỉ ra khỏi quá trình giao dịch
    function setStateOfCertOutTransaction(uint256 _licenseId) external {
        tokenToState[_licenseId] = State.ACTIVATED;
    }
}
