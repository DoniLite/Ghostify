import { Buffer } from 'node:buffer';
import { decrypt, encrypt, generateKeys } from '../src/utils/security/cryptography.ts';
import { TestAssertions } from '../src/utils/test/mod.ts';

Deno.test('security test', async (t) => {
    let keys: {
      secretKey: Buffer;
      iv: Buffer;
    };
    const encryptContent = 'Hello world';
    let encrypted: string;
    await t.step('should create the security hash', () => {
        const k = generateKeys();
        keys = {
            secretKey: Buffer.from(k.secretKey, 'hex'),
            iv: Buffer.from(k.iv, 'hex')
        }
        TestAssertions.assertEqual(keys.secretKey.length, 32);
        TestAssertions.assertEqual(keys.iv.length, 16);
    });
    await t.step('should encrypt the content with the security hash', () => {
        const {secretKey, iv} = keys;
        encrypted = encrypt(encryptContent, secretKey, iv);
        TestAssertions.assertNotEquals(encrypted, encryptContent);
    })

    await t.step('should decrypt the content with the security hash', () => {
        const {secretKey, iv} = keys;
        const decrypted = decrypt(encrypted, secretKey, iv);
        TestAssertions.assertEqual(decrypted, encryptContent);
    })
})