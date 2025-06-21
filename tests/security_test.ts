import { Buffer } from "node:buffer";
import { test } from "bun:test";
import {
  decrypt,
  encrypt,
  generateKeys,
} from "../src/utils/security/cryptography";
import { TestAssertions } from "../src/utils/test/mod";

test("security test", async (t) => {
  let keys: {
    secretKey: Buffer;
    iv: Buffer;
  };
  const encryptContent = "Hello world";
  let encrypted: string;
  const k = generateKeys();
  keys = {
    secretKey: Buffer.from(k.secretKey, "hex"),
    iv: Buffer.from(k.iv, "hex"),
  };
  TestAssertions.assertEqual(keys.secretKey.length, 32);
  TestAssertions.assertEqual(keys.iv.length, 16);
  const { secretKey, iv } = keys;
  encrypted = encrypt(encryptContent, secretKey, iv);
  TestAssertions.assertNotEquals(encrypted, encryptContent);
  
  const decrypted = decrypt(encrypted, secretKey, iv);
  TestAssertions.assertEqual(decrypted, encryptContent);
});
