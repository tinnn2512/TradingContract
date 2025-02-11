/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface LandLicenseRegistryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "LandLicenseCount"
      | "accessManager"
      | "activate"
      | "getOwnerApproved"
      | "getOwnersOf"
      | "getOwnersOfCert"
      | "getRepresentativeOfOwners"
      | "getStateOfCert"
      | "getUserLandLicenses"
      | "isActivated"
      | "landLicenses"
      | "licenseExists"
      | "registerLandLicense"
      | "setStateOfCertInTransaction"
      | "setStateOfCertOutTransaction"
      | "tokenToNotary"
      | "tokenToState"
      | "transferLandOwnership"
      | "userLandLicenses"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "Activate" | "LandLicenseRegistered" | "Transfer"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "LandLicenseCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "accessManager",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "activate", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getOwnerApproved",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getOwnersOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getOwnersOfCert",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getRepresentativeOfOwners",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getStateOfCert",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserLandLicenses",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "isActivated", values: [string]): string;
  encodeFunctionData(
    functionFragment: "landLicenses",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "licenseExists",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "registerLandLicense",
    values: [AddressLike, string, string, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setStateOfCertInTransaction",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setStateOfCertOutTransaction",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenToNotary",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenToState",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferLandOwnership",
    values: [string, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "userLandLicenses",
    values: [AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "LandLicenseCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "accessManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "activate", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getOwnerApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOwnersOf",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOwnersOfCert",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRepresentativeOfOwners",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStateOfCert",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserLandLicenses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isActivated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "landLicenses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "licenseExists",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerLandLicense",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStateOfCertInTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStateOfCertOutTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenToNotary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenToState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferLandOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userLandLicenses",
    data: BytesLike
  ): Result;
}

export namespace ActivateEvent {
  export type InputTuple = [
    licenseId: string,
    owner: AddressLike,
    state: BigNumberish
  ];
  export type OutputTuple = [licenseId: string, owner: string, state: bigint];
  export interface OutputObject {
    licenseId: string;
    owner: string;
    state: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace LandLicenseRegisteredEvent {
  export type InputTuple = [
    licenseId: string,
    owner: AddressLike,
    notary: AddressLike
  ];
  export type OutputTuple = [licenseId: string, owner: string, notary: string];
  export interface OutputObject {
    licenseId: string;
    owner: string;
    notary: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}
export enum State {
  PENDING,
  ACTIVATED,
  IN_TRANSACTION
}

export namespace TransferEvent {
  export type InputTuple = [
    licenseId: string,
    oldOwner: AddressLike,
    newOwner: AddressLike
  ];
  export type OutputTuple = [
    licenseId: string,
    oldOwner: string,
    newOwner: string
  ];
  export interface OutputObject {
    licenseId: string;
    oldOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface LandLicenseRegistry extends BaseContract {
  connect(runner?: ContractRunner | null): LandLicenseRegistry;
  waitForDeployment(): Promise<this>;

  interface: LandLicenseRegistryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  LandLicenseCount: TypedContractMethod<[], [bigint], "view">;

  accessManager: TypedContractMethod<[], [string], "view">;

  activate: TypedContractMethod<[_Id: string], [void], "nonpayable">;

  getOwnerApproved: TypedContractMethod<[_id: string], [string[]], "view">;

  getOwnersOf: TypedContractMethod<[_id: string], [string[]], "view">;

  getOwnersOfCert: TypedContractMethod<
    [_licenseId: string],
    [string[]],
    "view"
  >;

  getRepresentativeOfOwners: TypedContractMethod<
    [_licenseId: string],
    [string],
    "view"
  >;

  getStateOfCert: TypedContractMethod<[_licenseId: string], [bigint], "view">;

  getUserLandLicenses: TypedContractMethod<[], [string[]], "view">;

  isActivated: TypedContractMethod<[_id: string], [boolean], "view">;

  landLicenses: TypedContractMethod<
    [arg0: string],
    [
      [string, string, string] & {
        owner: string;
        ipfsHash: string;
        notary: string;
      }
    ],
    "view"
  >;

  licenseExists: TypedContractMethod<[arg0: string], [boolean], "view">;

  registerLandLicense: TypedContractMethod<
    [
      _owner: AddressLike,
      _licenseId: string,
      _ipfsHash: string,
      _notary: AddressLike
    ],
    [void],
    "nonpayable"
  >;

  setStateOfCertInTransaction: TypedContractMethod<
    [_licenseId: string],
    [void],
    "nonpayable"
  >;

  setStateOfCertOutTransaction: TypedContractMethod<
    [_licenseId: string],
    [void],
    "nonpayable"
  >;

  tokenToNotary: TypedContractMethod<[arg0: string], [string], "view">;

  tokenToState: TypedContractMethod<[arg0: string], [bigint], "view">;

  transferLandOwnership: TypedContractMethod<
    [_licenseId: string, _newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  userLandLicenses: TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [string],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "LandLicenseCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "accessManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "activate"
  ): TypedContractMethod<[_Id: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getOwnerApproved"
  ): TypedContractMethod<[_id: string], [string[]], "view">;
  getFunction(
    nameOrSignature: "getOwnersOf"
  ): TypedContractMethod<[_id: string], [string[]], "view">;
  getFunction(
    nameOrSignature: "getOwnersOfCert"
  ): TypedContractMethod<[_licenseId: string], [string[]], "view">;
  getFunction(
    nameOrSignature: "getRepresentativeOfOwners"
  ): TypedContractMethod<[_licenseId: string], [string], "view">;
  getFunction(
    nameOrSignature: "getStateOfCert"
  ): TypedContractMethod<[_licenseId: string], [bigint], "view">;
  getFunction(
    nameOrSignature: "getUserLandLicenses"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "isActivated"
  ): TypedContractMethod<[_id: string], [boolean], "view">;
  getFunction(
    nameOrSignature: "landLicenses"
  ): TypedContractMethod<
    [arg0: string],
    [
      [string, string, string] & {
        owner: string;
        ipfsHash: string;
        notary: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "licenseExists"
  ): TypedContractMethod<[arg0: string], [boolean], "view">;
  getFunction(
    nameOrSignature: "registerLandLicense"
  ): TypedContractMethod<
    [
      _owner: AddressLike,
      _licenseId: string,
      _ipfsHash: string,
      _notary: AddressLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setStateOfCertInTransaction"
  ): TypedContractMethod<[_licenseId: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setStateOfCertOutTransaction"
  ): TypedContractMethod<[_licenseId: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "tokenToNotary"
  ): TypedContractMethod<[arg0: string], [string], "view">;
  getFunction(
    nameOrSignature: "tokenToState"
  ): TypedContractMethod<[arg0: string], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferLandOwnership"
  ): TypedContractMethod<
    [_licenseId: string, _newOwner: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "userLandLicenses"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [string],
    "view"
  >;

  getEvent(
    key: "Activate"
  ): TypedContractEvent<
    ActivateEvent.InputTuple,
    ActivateEvent.OutputTuple,
    ActivateEvent.OutputObject
  >;
  getEvent(
    key: "LandLicenseRegistered"
  ): TypedContractEvent<
    LandLicenseRegisteredEvent.InputTuple,
    LandLicenseRegisteredEvent.OutputTuple,
    LandLicenseRegisteredEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;

  filters: {
    "Activate(string,address,uint8)": TypedContractEvent<
      ActivateEvent.InputTuple,
      ActivateEvent.OutputTuple,
      ActivateEvent.OutputObject
    >;
    Activate: TypedContractEvent<
      ActivateEvent.InputTuple,
      ActivateEvent.OutputTuple,
      ActivateEvent.OutputObject
    >;

    "LandLicenseRegistered(string,address,address)": TypedContractEvent<
      LandLicenseRegisteredEvent.InputTuple,
      LandLicenseRegisteredEvent.OutputTuple,
      LandLicenseRegisteredEvent.OutputObject
    >;
    LandLicenseRegistered: TypedContractEvent<
      LandLicenseRegisteredEvent.InputTuple,
      LandLicenseRegisteredEvent.OutputTuple,
      LandLicenseRegisteredEvent.OutputObject
    >;

    "Transfer(string,address,address)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
  };
}
