/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export function contribute(inputPath: string, outputPath: string, seed?: string | undefined | null): Promise<string>
export function verifyTransform(paramsPath: string, newParamsPath: string): Promise<string>
export const KEY_LENGTH: number
export const NONCE_LENGTH: number
export function randomBytes(bytesLength: number): Uint8Array
export interface BoxedMessage {
  nonce: string
  boxedMessage: string
}
export function boxMessage(plaintext: string, senderSecretKey: Uint8Array, recipientPublicKey: string): BoxedMessage
export function unboxMessage(boxedMessage: string, nonce: string, senderPublicKey: string, recipientSecretKey: Uint8Array): string
/**
 * # Safety
 * This is unsafe, it calls libc functions
 */
export function initSignalHandler(): void
/**
 * # Safety
 * This is unsafe, it intentionally crashes
 */
export function triggerSegfault(): void
export const ASSET_ID_LENGTH: number
export const ASSET_METADATA_LENGTH: number
export const ASSET_NAME_LENGTH: number
export const ASSET_LENGTH: number
export const NOTE_ENCRYPTION_KEY_LENGTH: number
export const MAC_LENGTH: number
export const ENCRYPTED_NOTE_PLAINTEXT_LENGTH: number
export const ENCRYPTED_NOTE_LENGTH: number
export const PUBLIC_ADDRESS_LENGTH: number
export const RANDOMNESS_LENGTH: number
export const MEMO_LENGTH: number
export const AMOUNT_VALUE_LENGTH: number
export const DECRYPTED_NOTE_LENGTH: number
export interface NativeSpendDescription {
  treeSize: number
  rootHash: Buffer
  nullifier: Buffer
}
export const PROOF_LENGTH: number
export const TRANSACTION_SIGNATURE_LENGTH: number
export const TRANSACTION_PUBLIC_KEY_RANDOMNESS_LENGTH: number
export const TRANSACTION_EXPIRATION_LENGTH: number
export const TRANSACTION_FEE_LENGTH: number
export const LATEST_TRANSACTION_VERSION: number
export function verifyTransactions(serializedTransactions: Array<Buffer>): boolean
export const enum LanguageCode {
  English = 0,
  ChineseSimplified = 1,
  ChineseTraditional = 2,
  French = 3,
  Italian = 4,
  Japanese = 5,
  Korean = 6,
  Spanish = 7
}
export interface Key {
  spendingKey: string
  viewKey: string
  incomingViewKey: string
  outgoingViewKey: string
  publicAddress: string
}
export function generateKey(): Key
export function spendingKeyToWords(privateKey: string, languageCode: LanguageCode): string
export function wordsToSpendingKey(words: string, languageCode: LanguageCode): string
export function generateKeyFromPrivateKey(privateKey: string): Key
export function initializeSapling(): void
export function isValidPublicAddress(hexAddress: string): boolean
export class BoxKeyPair {
  constructor()
  static fromHex(secretHex: string): BoxKeyPair
  get publicKey(): Buffer
  get secretKey(): Buffer
}
export type NativeRollingFilter = RollingFilter
export class RollingFilter {
  constructor(items: number, rate: number)
  add(value: Buffer): void
  test(value: Buffer): boolean
}
export type NativeAsset = Asset
export class Asset {
  constructor(creatorPublicAddress: string, name: string, metadata: string)
  metadata(): Buffer
  name(): Buffer
  nonce(): number
  creator(): Buffer
  static nativeId(): Buffer
  id(): Buffer
  serialize(): Buffer
  static deserialize(jsBytes: Buffer): NativeAsset
}
export type NativeNoteEncrypted = NoteEncrypted
export class NoteEncrypted {
  constructor(jsBytes: Buffer)
  serialize(): Buffer
  equals(other: NoteEncrypted): boolean
  /**
   * The commitment hash of the note
   * This hash is what gets used for the leaf nodes in a Merkle Tree.
   */
  hash(): Buffer
  /**
   * Hash two child hashes together to calculate the hash of the
   * new parent
   */
  static combineHash(depth: number, jsLeft: Buffer, jsRight: Buffer): Buffer
  /** Returns undefined if the note was unable to be decrypted with the given key. */
  decryptNoteForOwner(incomingHexKey: string): Buffer | null
  /** Returns undefined if the note was unable to be decrypted with the given key. */
  decryptNoteForSpender(outgoingHexKey: string): Buffer | null
}
export type NativeNote = Note
export class Note {
  constructor(owner: string, value: bigint, memo: string, assetId: Buffer, sender: string)
  static deserialize(jsBytes: Buffer): NativeNote
  serialize(): Buffer
  /**
   * The commitment hash of the note
   * This hash is what gets used for the leaf nodes in a Merkle Tree.
   */
  hash(): Buffer
  /** Value this note represents. */
  value(): bigint
  /**
   * Arbitrary note the spender can supply when constructing a spend so the
   * receiver has some record from whence it came.
   * Note: While this is encrypted with the output, it is not encoded into
   * the proof in any way.
   */
  memo(): string
  /** Asset identifier associated with this note */
  assetId(): Buffer
  /** Sender of the note */
  sender(): string
  /** Owner of the note */
  owner(): string
  /**
   * Compute the nullifier for this note, given the private key of its owner.
   *
   * The nullifier is a series of bytes that is published by the note owner
   * only at the time the note is spent. This key is collected in a massive
   * 'nullifier set', preventing double-spend.
   */
  nullifier(ownerViewKey: string, position: bigint): Buffer
}
export type NativeTransactionPosted = TransactionPosted
export class TransactionPosted {
  constructor(jsBytes: Buffer)
  serialize(): Buffer
  notesLength(): number
  getNote(index: number): Buffer
  spendsLength(): number
  getSpend(index: number): NativeSpendDescription
  fee(): bigint
  transactionSignature(): Buffer
  hash(): Buffer
  expiration(): number
}
export type NativeTransaction = Transaction
export class Transaction {
  constructor(spenderHexKey: string, version: number)
  /** Create a proof of a new note owned by the recipient in this transaction. */
  output(note: Note): void
  /** Spend the note owned by spender_hex_key at the given witness location. */
  spend(note: Note, witness: object): void
  /** Mint a new asset with a given value as part of this transaction. */
  mint(asset: Asset, value: bigint, transferOwnershipTo?: string | undefined | null): void
  /** Burn some supply of a given asset and value as part of this transaction. */
  burn(assetIdJsBytes: Buffer, value: bigint): void
  /**
   * Special case for posting a miners fee transaction. Miner fee transactions
   * are unique in that they generate currency. They do not have any spends
   * or change and therefore have a negative transaction fee. In normal use,
   * a miner would not accept such a transaction unless it was explicitly set
   * as the miners fee.
   */
  post_miners_fee(): Buffer
  /**
   * Used to generate invalid miners fee transactions for testing. Call
   * post_miners_fee instead in user-facing code.
   */
  _postMinersFeeUnchecked(): Buffer
  /**
   * Post the transaction. This performs a bit of validation, and signs
   * the spends with a signature that proves the spends are part of this
   * transaction.
   *
   * Transaction fee is the amount the spender wants to send to the miner
   * for mining this transaction. This has to be non-negative; sane miners
   * wouldn't accept a transaction that takes money away from them.
   *
   * sum(spends) - sum(outputs) - intended_transaction_fee - change = 0
   * aka: self.value_balance - intended_transaction_fee - change = 0
   */
  post(changeGoesTo: string | undefined | null, intendedTransactionFee: bigint): Buffer
  setExpiration(sequence: number): void
}
export class FoundBlockResult {
  randomness: string
  miningRequestId: number
  constructor(randomness: string, miningRequestId: number)
}
export class ThreadPoolHandler {
  constructor(threadCount: number, batchSize: number, pauseOnSuccess: boolean)
  newWork(headerBytes: Buffer, target: Buffer, miningRequestId: number): void
  stop(): void
  pause(): void
  getFoundBlock(): FoundBlockResult | null
  getHashRateSubmission(): number
}