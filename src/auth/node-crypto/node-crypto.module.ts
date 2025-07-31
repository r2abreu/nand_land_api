import { ClassProvider, Module, ValueProvider } from "@nestjs/common";
import { RANDOM_BYTES, ENCRYPT, CRYPTABLE } from "./tokens";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { NodeCryptoService } from "./node-crypto.service";
import type { Cryptable } from "src/interfaces/cryptable.interface";

const randomBytesProvider: ValueProvider<Cryptable["randomBytes"]> = {
  provide: RANDOM_BYTES,
  useValue: randomBytes,
};

const encryptProvider: ValueProvider<Cryptable["encrypt"]> = {
  provide: ENCRYPT,
  useValue: promisify(scrypt),
};

const nodeCryptoServiceProvider: ClassProvider<Cryptable> = {
  provide: CRYPTABLE,
  useClass: NodeCryptoService,
};

@Module({
  providers: [nodeCryptoServiceProvider, randomBytesProvider, encryptProvider],
  exports: [CRYPTABLE],
})
export class NodeCryptoModule {}
