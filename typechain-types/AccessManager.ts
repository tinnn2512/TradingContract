/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
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

export interface AccessManagerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "grantAdmin"
      | "grantNotaryRole"
      | "hasNotaryRole"
      | "isAdmin"
      | "isNotary"
      | "isUser"
      | "revokeAdmin"
      | "revokeNotaryRole"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AdminRoleGrant"
      | "AdminRoleRevoke"
      | "RoleGranted"
      | "RoleRevoked"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "grantAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantNotaryRole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hasNotaryRole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isNotary",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "isUser", values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: "revokeAdmin",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeNotaryRole",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "grantAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "grantNotaryRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hasNotaryRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isAdmin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isNotary", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isUser", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "revokeAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "revokeNotaryRole",
    data: BytesLike
  ): Result;
}

export namespace AdminRoleGrantEvent {
  export type InputTuple = [account: AddressLike, role: string];
  export type OutputTuple = [account: string, role: string];
  export interface OutputObject {
    account: string;
    role: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace AdminRoleRevokeEvent {
  export type InputTuple = [account: AddressLike, role: string];
  export type OutputTuple = [account: string, role: string];
  export interface OutputObject {
    account: string;
    role: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleGrantedEvent {
  export type InputTuple = [account: AddressLike, role: string];
  export type OutputTuple = [account: string, role: string];
  export interface OutputObject {
    account: string;
    role: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleRevokedEvent {
  export type InputTuple = [account: AddressLike, role: string];
  export type OutputTuple = [account: string, role: string];
  export interface OutputObject {
    account: string;
    role: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface AccessManager extends BaseContract {
  connect(runner?: ContractRunner | null): AccessManager;
  waitForDeployment(): Promise<this>;

  interface: AccessManagerInterface;

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

  grantAdmin: TypedContractMethod<[account: AddressLike], [void], "nonpayable">;

  grantNotaryRole: TypedContractMethod<
    [account: AddressLike],
    [void],
    "nonpayable"
  >;

  hasNotaryRole: TypedContractMethod<[account: AddressLike], [boolean], "view">;

  isAdmin: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  isNotary: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  isUser: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  revokeAdmin: TypedContractMethod<
    [account: AddressLike],
    [void],
    "nonpayable"
  >;

  revokeNotaryRole: TypedContractMethod<
    [account: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "grantAdmin"
  ): TypedContractMethod<[account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "grantNotaryRole"
  ): TypedContractMethod<[account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "hasNotaryRole"
  ): TypedContractMethod<[account: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isAdmin"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isNotary"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isUser"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "revokeAdmin"
  ): TypedContractMethod<[account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "revokeNotaryRole"
  ): TypedContractMethod<[account: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "AdminRoleGrant"
  ): TypedContractEvent<
    AdminRoleGrantEvent.InputTuple,
    AdminRoleGrantEvent.OutputTuple,
    AdminRoleGrantEvent.OutputObject
  >;
  getEvent(
    key: "AdminRoleRevoke"
  ): TypedContractEvent<
    AdminRoleRevokeEvent.InputTuple,
    AdminRoleRevokeEvent.OutputTuple,
    AdminRoleRevokeEvent.OutputObject
  >;
  getEvent(
    key: "RoleGranted"
  ): TypedContractEvent<
    RoleGrantedEvent.InputTuple,
    RoleGrantedEvent.OutputTuple,
    RoleGrantedEvent.OutputObject
  >;
  getEvent(
    key: "RoleRevoked"
  ): TypedContractEvent<
    RoleRevokedEvent.InputTuple,
    RoleRevokedEvent.OutputTuple,
    RoleRevokedEvent.OutputObject
  >;

  filters: {
    "AdminRoleGrant(address,string)": TypedContractEvent<
      AdminRoleGrantEvent.InputTuple,
      AdminRoleGrantEvent.OutputTuple,
      AdminRoleGrantEvent.OutputObject
    >;
    AdminRoleGrant: TypedContractEvent<
      AdminRoleGrantEvent.InputTuple,
      AdminRoleGrantEvent.OutputTuple,
      AdminRoleGrantEvent.OutputObject
    >;

    "AdminRoleRevoke(address,string)": TypedContractEvent<
      AdminRoleRevokeEvent.InputTuple,
      AdminRoleRevokeEvent.OutputTuple,
      AdminRoleRevokeEvent.OutputObject
    >;
    AdminRoleRevoke: TypedContractEvent<
      AdminRoleRevokeEvent.InputTuple,
      AdminRoleRevokeEvent.OutputTuple,
      AdminRoleRevokeEvent.OutputObject
    >;

    "RoleGranted(address,string)": TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;
    RoleGranted: TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;

    "RoleRevoked(address,string)": TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;
    RoleRevoked: TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;
  };
}
