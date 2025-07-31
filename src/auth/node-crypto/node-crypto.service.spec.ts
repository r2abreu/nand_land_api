import { Test } from "@nestjs/testing";
import { describe, beforeEach, it, vi } from "vitest";
import { RANDOM_BYTES, ENCRYPT } from "./tokens";
import { NodeCryptoService } from "./node-crypto.service";

describe("NodeCryptoService", () => {
  let service: NodeCryptoService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NodeCryptoService,
        {
          provide: RANDOM_BYTES,
          useValue: vi.fn(),
        },
        {
          provide: ENCRYPT,
          useValue: vi.fn(),
        },
      ],
    }).compile();

    service = module.get<NodeCryptoService>(NodeCryptoService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
