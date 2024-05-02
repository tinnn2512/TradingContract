// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SafeMath.sol";

interface ILandLicenseRegistry {
    function getOwnersOfCert(string memory _licenseId)
        external
        view
        returns (address[] memory);

    function getRepresentativeOfOwners(string memory _licenseId)
        external
        view
        returns (address);

    // 0: PENDING - 1: ACTIVATE - 2: IN_TRANSACTION
    function getStateOfCert(string memory _licenseId)
        external
        view
        returns (uint8);

    function setStateOfCertInTransaction(string memory _licenseId) external;

    function setStateOfCertOutTransaction(string memory _licenseId) external;

   function transferLandOwnership(string memory _licenseId, address _newOwner)
        external;
        }

contract TransactionContract {
    uint256 public id;
    address private owner;
    ILandLicenseRegistry LandLicenseRegistry;
    using SafeMath for uint256;

    enum State {
        DEPOSIT_REQUEST, // Transaction created
        DEPOSIT_CANCELED_BY_BUYER, // Buyer cancel transaction, transaction has not been signed
        DEPOSIT_CANCELED_BY_SELLER, // Seller cancel transaction, transaction has not been signed
        DEPOSIT_SIGNED, // seller sign transaction
        DEPOSIT_BROKEN_BY_BUYER, // Buyer cancel transaction, transaction signed
        DEPOSIT_BROKEN_BY_SELLER, // Seller cancel transaction, transaction signed
        TRANSFER_REQUEST, // Buyer transfer remaining amount (same requrest transfer contract)
        TRANSFER_CANCELED_BY_SELLER, // Seller refuse (same BRAKE_DEPOSIT)
        TRANSFER_SIGNED // Seller sign transaction => Finish
    }

    mapping(uint256 => State) public idToState; // mapping id to state of transaction
    mapping(uint256 => Transaction) public idToTransaction; // mapping id to data of transaction

    struct Transaction {
        address[] buyers;
        address[] sellers;
        string licenseId;
        uint256 depositPrice;
        uint256 transferPrice;
        uint256 timeStart;
        uint256 timeEnd;
    }
    // -------------------------------- Event --------------------------------
    event TransactionCreated(
        address[] buyers,
        address[] sellers,
        uint256 idTransaction,
        string licenseId,
        uint256 depositPrice,
        uint256 transferPrice,
        uint256 timeStart,
        uint256 timeEnd
    );

    event DepositSigned(uint256 idTransaction);

    event TransactionCanceled(uint256 idTransaction, State state);

    event Payment(uint256 idTransaction);

    event TransactionSuccess(uint256 idTransaction);

    constructor(ILandLicenseRegistry _LandLicenseRegistryContractAddress) {
        LandLicenseRegistry = ILandLicenseRegistry(_LandLicenseRegistryContractAddress);
    }

    function setLandLicenseRegistryContract(ILandLicenseRegistry _LandLicenseRegistryContractAddress)
        public
    {
        LandLicenseRegistry = ILandLicenseRegistry(_LandLicenseRegistryContractAddress);
    }

    //---------------------------------Modifier-------------------------------------
    modifier onlyState(uint256 _idTransaction, State _state) {
        require(
            (idToState[_idTransaction] == _state),
            "OnlyState: Require state."
        );
        _;
    }
    modifier allowModify(uint256 _idTransaction) {
        require(
            (idToState[_idTransaction] == State.DEPOSIT_REQUEST ||
                idToState[_idTransaction] == State.DEPOSIT_SIGNED ||
                idToState[_idTransaction] == State.TRANSFER_REQUEST),
            "AllowModify: Transaction can't allow modifier."
        );
        _;
    }

    // ------------------------------ Core Function ------------------------------
    /**
     * @notice Create transaction (same send request deposit contract)
     * @dev Buyer create transaction and send deposit amount to contract address
     */
    function createTransaction(
        address[] memory _buyers,
        string memory _licenseId,
        uint256 _depositPrice, //amount
        uint256 _transferPrice,
        uint256 _depositTime // days-30day depositPaymentTime
    ) public payable {
        require(
            LandLicenseRegistry.getStateOfCert(_licenseId) == 1,
            "CreateTransaction: Require state of certificate is ACTIVATE"
        );
        require(
            msg.value >= _depositPrice,
            "CreateTransaction: Require value greater than deposit price"
        );
        require(
            _depositPrice <= _transferPrice,
            "CreateTransaction: Deposit price must be smaller than transfer price"
        );

        address[] memory owners = LandLicenseRegistry.getOwnersOfCert(_licenseId);

        uint256 timeEnd = block.timestamp + _depositTime * 24 * 60 * 60; // convert days to seconds
        Transaction memory transaction = Transaction({
            buyers: _buyers,
            sellers: owners,
            licenseId: _licenseId,
            depositPrice: _depositPrice,
            transferPrice: _transferPrice,
            timeStart: block.timestamp,
            timeEnd: timeEnd
        });
        id = id + 1;
        idToTransaction[id] = transaction;
        idToState[id] = State.DEPOSIT_REQUEST;
        emit TransactionCreated(
            _buyers,
            owners,
            id,
            _licenseId,
            _depositPrice,
            _transferPrice,
            block.timestamp,
            timeEnd
        );
    }

    /**
     * @notice Accept deposit (same signed the deposit contract)
     * @dev Allow only representative of seller call
     * Seller will receive the deposit amount and set state to SIGNED
     */

    function acceptTransaction(uint256 _idTransaction)
        public
        onlyState(_idTransaction, State.DEPOSIT_REQUEST)
    {
        Transaction memory transaction = idToTransaction[_idTransaction];
        require(
            block.timestamp <= transaction.timeEnd,
            "AcceptTransaction: Transaction has expired"
        );
        address representativeOwners = transaction.sellers[0];
        require(
            (msg.sender == representativeOwners),
            "AcceptTransaction: require representative of owner"
        );
        address payable payableSender = payable(msg.sender);
        payableSender.transfer(transaction.depositPrice);
        idToState[_idTransaction] = State.DEPOSIT_SIGNED;
        LandLicenseRegistry.setStateOfCertInTransaction(transaction.licenseId);
        emit DepositSigned(_idTransaction);
    }

    /**
     * @notice Buyer cancel transaction
     * @dev Only transactions are subject to change (can modify state of transaction)
     * if transaction not signed => refund deposit amount to buyers
     * if transaction signed => buyer lost the deposit price
     */

    function buyerCancelTransaction(uint256 _idTransaction)
        public
        allowModify(_idTransaction)
    {
        Transaction memory transaction = idToTransaction[_idTransaction];
        require(
            msg.sender == transaction.buyers[0],
            "BuyerCancelTransaction: require representative buyers"
        );

        // if state of transaction DEPOSIT_REQUEST => cancel and recive deposit price
        if (idToState[_idTransaction] == State.DEPOSIT_REQUEST) {
            address payable payableSender = payable(msg.sender);
            payableSender.transfer(transaction.depositPrice);
            idToState[_idTransaction] = State.DEPOSIT_CANCELED_BY_BUYER;
        } else if (idToState[_idTransaction] == State.DEPOSIT_SIGNED) {
            idToState[_idTransaction] = State.DEPOSIT_BROKEN_BY_BUYER;
        } else if (idToState[_idTransaction] == State.TRANSFER_REQUEST) {
            address payable payableSender = payable(msg.sender);
            payableSender.transfer(
                transaction.transferPrice.sub(transaction.depositPrice).add(
                    transaction.transferPrice.div(200)
                )
            );
            idToState[_idTransaction] = State.DEPOSIT_BROKEN_BY_BUYER;
        }
        LandLicenseRegistry.setStateOfCertOutTransaction(transaction.licenseId);
        emit TransactionCanceled(_idTransaction, idToState[_idTransaction]);
    }

    /**
     * @notice Seller cancel transaction
     * @dev Only transactions are subject to change (can modify state of transaction)
     * if transaction not signed => refund deposit amount to buyers
     * if transaction signed => seller send compensation = 2 * deposit price to buyer
     */
    function sellerCancelTransaction(uint256 _idTransaction)
        public
        payable
        allowModify(_idTransaction)
    {
        Transaction memory transaction = idToTransaction[_idTransaction];
        require(
            msg.sender == transaction.sellers[0],
            "SellerCancelTransaction: require representative sellers"
        );
        // seller refuse DEPOSIT_REQUEST of buyer => buyers recive depositPrice previously transferred
        if (idToState[_idTransaction] == State.DEPOSIT_REQUEST) {
            address payable buyer = payable(
                address(uint160(transaction.buyers[0]))
            );
            buyer.transfer(transaction.depositPrice);
            idToState[_idTransaction] = State.DEPOSIT_CANCELED_BY_SELLER;
        }
        // seller break transaction (deposit contract) => compensation for buyer
        else if (idToState[_idTransaction] == State.DEPOSIT_SIGNED) {
            uint256 compensationAmount = transaction.depositPrice.mul(2);
            require(
                msg.value >= compensationAmount,
                "SellerCancelTransaction: Value must be greater than 2 * deposit price"
            );
            address payable buyer = payable(
                address(uint160(transaction.buyers[0]))
            );
            buyer.transfer(compensationAmount);
            idToState[_idTransaction] = State.DEPOSIT_BROKEN_BY_SELLER;
        }
        // if buyer sended payment => refund payment + 0.5% tax and compensation amount
        else if (idToState[_idTransaction] == State.TRANSFER_REQUEST) {
            uint256 compensationAmount = transaction.depositPrice.mul(2);
            uint256 transferAmount = transaction.transferPrice.sub(
                transaction.depositPrice
            );
            uint256 totalAmount = transferAmount.add(compensationAmount).add(
                transaction.transferPrice.div(200)
            ); // value return to buyer
            require(
                msg.value >= compensationAmount,
                "SellerCancelTransaction: Value must be greater than 2 * deposit price"
            );
            require(
                address(this).balance >= totalAmount,
                "Balace contract address not enough"
            );
            address payable buyer = payable(
                address(uint160(transaction.buyers[0]))
            );
            buyer.transfer(totalAmount);
            idToState[_idTransaction] = State.TRANSFER_CANCELED_BY_SELLER;
        }
        LandLicenseRegistry.setStateOfCertOutTransaction(transaction.licenseId);
        emit TransactionCanceled(_idTransaction, idToState[_idTransaction]);
    }

    /**
     * @notice Cancel transaction
     * @dev Only transactions are subject to change (can modify state of transaction)
     * if transaction not signed => refund deposit amount to buyers
     * if transaction signed and sellers call => send compensation for buyers
     */

    function cancelTransaction(uint256 _idTransaction)
        public
        payable
        allowModify(_idTransaction)
    {
        Transaction memory transaction = idToTransaction[_idTransaction];
        if (msg.sender == transaction.buyers[0]) {
            // buyer cancel DEPOSTI_REQUEST and recive depositPrice
            if (idToState[_idTransaction] == State.DEPOSIT_REQUEST) {
                payable(msg.sender).transfer(transaction.depositPrice);
                idToState[_idTransaction] = State.DEPOSIT_CANCELED_BY_BUYER;
            }
            // buyer break transaction (deposit contract) => never recive the depositPrice previously transferred
            else if (idToState[_idTransaction] == State.DEPOSIT_SIGNED) {
                idToState[_idTransaction] = State.DEPOSIT_BROKEN_BY_BUYER;
            } else if (idToState[_idTransaction] == State.TRANSFER_REQUEST) {
                address payable sender = payable(msg.sender);
                sender.transfer(
                    transaction.transferPrice -
                        transaction.depositPrice +
                        transaction.transferPrice /
                        200
                );
                idToState[_idTransaction] = State.DEPOSIT_BROKEN_BY_BUYER;
            }
        } else if (msg.sender == transaction.sellers[0]) {
            // seller refuse DEPOSIT_REQUEST of buyer => buyers recive depositPrice previously transferred
            if (idToState[_idTransaction] == State.DEPOSIT_REQUEST) {
                address payable buyer = payable(
                    address(uint160(transaction.buyers[0]))
                );
                buyer.transfer(transaction.depositPrice);
                idToState[_idTransaction] = State.DEPOSIT_CANCELED_BY_SELLER;
            }
            // seller break transaction (deposit contract) => compensation for buyer
            else if (idToState[_idTransaction] == State.DEPOSIT_SIGNED) {
                uint256 compensationAmount = transaction.depositPrice.mul(2);
                require(
                    msg.value >= compensationAmount,
                    "CancelTransaction: Value must be greater compensation amount."
                );
                address payable buyer = payable(
                    address(uint160(transaction.buyers[0]))
                );
                buyer.transfer(compensationAmount);
                idToState[_idTransaction] = State.DEPOSIT_BROKEN_BY_BUYER;
            }
            // if buyer sended payment => refund payment and compensation
            else if (idToState[_idTransaction] == State.TRANSFER_REQUEST) {
                uint256 compensationAmount = transaction.depositPrice.mul(2);
                uint256 totalAmount = transaction
                    .transferPrice
                    .add(compensationAmount)
                    .add(transaction.transferPrice.div(200));
                require(
                    msg.value >= compensationAmount,
                    "CancelTransaction: Value must be greater than compensation amount."
                );
                address payable buyer = payable(transaction.buyers[0]);
                buyer.transfer(totalAmount);
                idToState[_idTransaction] = State.TRANSFER_CANCELED_BY_SELLER;
            }
        } else {
            revert("CancelTransaction: You're not permission.");
        }
        LandLicenseRegistry.setStateOfCertOutTransaction(transaction.licenseId);
        emit TransactionCanceled(_idTransaction, idToState[_idTransaction]);
    }

    /**
     * @notice Payment transaction
     * @dev Only representative of buyer (buyer[0])
     * buyer send remaining amount of transction to contract address (same sign transfer contract)
     */

    function payment(uint256 _idTransaction)
        public
        payable
        onlyState(_idTransaction, State.DEPOSIT_SIGNED)
    {
        Transaction memory transaction = idToTransaction[_idTransaction];
        require(
            block.timestamp <= transaction.timeEnd,
            "Payment: Transaction has expired."
        );
        address representativeBuyer = transaction.buyers[0];
        require(
            msg.sender == representativeBuyer,
            "Payment: Only representative of buyers."
        );
        uint256 remainingAmount = transaction.transferPrice.sub(
            transaction.depositPrice
        );
        uint256 registrationTax = transaction.transferPrice.div(200); // 0.5% tax
        uint256 totalAmount = remainingAmount.add(registrationTax);
        require(
            (msg.value >= totalAmount),
            "Payment: Value must be greater than total amount"
        );
        idToState[_idTransaction] = State.TRANSFER_REQUEST;
        emit Payment(_idTransaction);
    }

    /**
     * @notice Confirm transaction
     * @dev Seller confirm transaction recive remaining amount of transaction
     * and transfer ownership of certificate to buyer
     */
  	function confirmTransaction(uint256 _idTransaction)
		public payable
		onlyState(_idTransaction, State.TRANSFER_REQUEST)
	{
		Transaction memory transaction = idToTransaction[_idTransaction];
		require(block.timestamp  <= transaction.timeEnd, "ConfirmTransaction: Transaction has expired.");
		address representativeSellers = transaction.sellers[0];
		require(
			msg.sender == representativeSellers,
			"ConfirmTransaction: Require representative of sellers."
		);
		uint256 personalIncomeTax = transaction.transferPrice.div(50); // 2% tax
		uint256 remainingAmount = transaction.transferPrice.sub(transaction.depositPrice);
		// remaining amount < personal tax => it must pay more.
		if(remainingAmount < personalIncomeTax){
			uint256 costsIncurred = personalIncomeTax - remainingAmount;
			require(msg.value >= costsIncurred, "ConfirmTransaction: Value must be greater costs incurred.");
		}
		else{
			uint256 valueAfterTax = remainingAmount - personalIncomeTax;
			payable(msg.sender).transfer(valueAfterTax);
		}
		LandLicenseRegistry.transferLandOwnership(
			transaction.licenseId,
			transaction.buyers[0]
		);
        idToState[_idTransaction] = State.TRANSFER_SIGNED;
		LandLicenseRegistry.setStateOfCertOutTransaction(transaction.licenseId);
        emit TransactionSuccess(_idTransaction);
	}

    // ------------------------------ View Function ------------------------------
    /**
     * @notice Get information of transaction
     */
    function getTransaction(uint256 _idTransaction)
        public
        view
        returns (
            address[] memory,
            address[] memory,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        Transaction memory transaction = idToTransaction[_idTransaction];
        return (
            transaction.buyers,
            transaction.sellers,
            transaction.licenseId,
            transaction.depositPrice,
            transaction.transferPrice,
            transaction.timeStart,
            transaction.timeEnd
        );
    }
}
