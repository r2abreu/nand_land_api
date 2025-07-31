import { Inject, Injectable } from "@nestjs/common";
import type { Cryptable } from "src/interfaces/cryptable.interface";
import { RANDOM_BYTES, ENCRYPT } from "./tokens";

@Injectable()
export class NodeCryptoService implements Cryptable {
  constructor(
    @Inject(RANDOM_BYTES) private nodeRandomBytes: Cryptable["randomBytes"],
    @Inject(ENCRYPT) private nodeEncrypt: Cryptable["encrypt"],
  ) {}

  randomBytes(size: number): Buffer {
    return this.nodeRandomBytes(size);
  }

  async encrypt(password: string, salt: string): Promise<Buffer> {
    return this.nodeEncrypt(salt, password, 32);
  }
}
