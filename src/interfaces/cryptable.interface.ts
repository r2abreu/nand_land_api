export interface Cryptable {
  randomBytes(size: number): Buffer;
  encrypt(password: string, salt: string, length: number): Promise<Buffer>;
}
