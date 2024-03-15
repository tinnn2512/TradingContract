// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessManager {
    // Mapping để lưu trữ vai trò của từng địa chỉ
    mapping(address => bool) public isAdmin;
    mapping(address => bool) public isNotary;
    mapping(address => bool) public isUser;

    // Sự kiện được kích hoạt khi một vai trò mới được cấp
    event RoleGranted(address indexed account, string role);

    // Sự kiện được kích hoạt khi một vai trò bị thu hồi
    event RoleRevoked(address indexed account, string role);

    // Hàm khởi tạo, chỉ được gọi một lần khi triển khai hợp đồng
    constructor() { // Gán vai trò ADMIN_ROLE cho địa chỉ cụ thể 
    isAdmin[0xFA5E4c04B88fA7bcE290b1358d90deCA12646aF8] = true; 
    emit RoleGranted(0xFA5E4c04B88fA7bcE290b1358d90deCA12646aF8, "ADMIN"); }

    // Hàm để cấp quyền cho một tài khoản
    function grantNotaryRole(address account) external {
        // Kiểm tra xem người gọi hàm có quyền ADMIN_ROLE không
        require(isAdmin[msg.sender], "Only admins can grant roles");

        // Cấp quyền NOTARY_ROLE cho tài khoản được chỉ định
        isNotary[account] = true;
        isUser[account] = false;

        emit RoleGranted(account, "NOTARY");
    }

    // Hàm để thu hồi quyền NOTARY_ROLE của một tài khoản
    function revokeNotaryRole(address account) external {
        // Kiểm tra xem người gọi hàm có quyền ADMIN_ROLE không
        require(isAdmin[msg.sender], "Only admins can revoke roles");

        // Thu hồi quyền NOTARY_ROLE của tài khoản được chỉ định
        isNotary[account] = false;
        emit RoleRevoked(account, "NOTARY");
    }

    // Hàm để kiểm tra xem một tài khoản có vai trò NOTARY_ROLE hay không?
    // public
    function hasNotaryRole(address account) public view returns (bool) {
        return isNotary[account];
    }
}
