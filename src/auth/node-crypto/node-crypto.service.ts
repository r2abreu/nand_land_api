import { Inject, Injectable } from "@nestjs/common";
import type { Cryptable } from "src/interfaces/cryptable.interface";
import { RANDOM_BYTES, ENCRYPT } from "./tokens";
import type { randomBytes } from "crypto";

// TODO: There should be a better way
type ScryptAsync = (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
) => Promise<Buffer>;

@Injectable()
export class NodeCryptoService implements Cryptable {
  constructor(
    @Inject(RANDOM_BYTES) private nodeRandomBytes: typeof randomBytes,
    @Inject(ENCRYPT) private nodeEncrypt: ScryptAsync,
  ) {}

  randomBytes(size: number): Buffer {
    return this.nodeRandomBytes(size);
  }

  async encrypt(password: string, salt: string): Promise<Buffer> {
    return this.nodeEncrypt(salt, password, 32);
  }
}
