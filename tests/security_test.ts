import { assertEquals, assertNotEquals } from 'jsr:@std/assert';
import {
  loadSecurityBearer,
  purgeSingleFile,
  verifySecurity,
} from '../src/utils.ts';
import path from 'node:path';
import process from 'node:process';

Deno.test('security test', async (t) => {
  await t.step('should return true for valid security', async () => {
    const isSecurityGenerated = await verifySecurity();
    assertEquals(isSecurityGenerated, true);
  });

  await t.step('should return the security payload', async () => {
    const securityBearer = await loadSecurityBearer();
    assertNotEquals(securityBearer, null);
  });

  await t.step('should remove the created security files', () => {
    const SECURITY_DIR = path.resolve(
      process.cwd(),
      './security/security.json'
    );
    purgeSingleFile(SECURITY_DIR);
  });
});
