import { Certificates, Secrets, UserActor, Inf } from 'index';
import path from 'path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { decrypt, encrypt } from '../utils';
import { tokenGenerator } from '../server';
import { prismaClient } from '../config/db';
import { Can } from '../utils';

const SUPER_USER_DEFAULT = process.env.SUPER_USER_DEFAULT;

export class SuperUser implements UserActor {
  userString;
  #passPhrase;
  #health: string;
  permissions = [Can.CreateUser];
  #secretFilePath;
  #certificatePath;
  actions;
  #certificate: Certificates;
  #encrypt;
  #decrypt;
  #token: string;
  #secrets: Secrets;
  #secretsFolder: string;
  constructor(
    userSecret: string,
    passPhrase: string,
    setUp = true,
    permissionSetup?: Can[]
  ) {
    this.userString = userSecret;
    this.#passPhrase = passPhrase;
    this.#encrypt = encrypt;
    this.#decrypt = decrypt;
    this.#token = tokenGenerator(Date.now().toString());
    this.#certificatePath = path.resolve(__dirname, '../data/certificates');
    this.#secretFilePath = path.join(
      __dirname,
      '../data/secrets/keystore.json'
    );
    this.#secretsFolder = path.resolve(__dirname, '../data/secrets');
    if (!fs.existsSync(this.#secretsFolder)) fs.mkdirSync(this.#secretsFolder);
    if (!fs.existsSync(this.#certificatePath))
      fs.mkdirSync(this.#certificatePath);
    this.#secrets = this.#loadKeys();
    if (!fs.existsSync(path.join(this.#certificatePath, 'default.json')))
      this.#initDefaultCertificate();
    if (!fs.existsSync(path.join(this.#secretsFolder, 'manifest.json')))
      fs.writeFileSync(
        path.join(this.#secretsFolder, 'manifest.json'),
        JSON.stringify({ manifest: 'v1.0' })
      );
    if (setUp) {
      this.#setUp();
      if (permissionSetup) this.#updatePermission();
    } else {
      this.permissions = permissionSetup;
      this.checkPermissions();
      this.#creator();
    }
    this.#checkHealth(this.userString, this.#health);
    this.actions = this.#updateActorWithPermissions(this.permissions);
  }

  public get health() {
    return this.#decrypt(this.#health, this.#secrets.key, this.#secrets.iv);
  }

  public get token() {
    return this.#token;
  }

  setHealth(heaht: string) {
    this.#health = this.#encrypt(
      String(heaht),
      this.#secrets.key,
      this.#secrets.iv
    );
  }

  checkPermissions(
    permissions: Can[] = [
      Can.CRUD,
      Can.CreateUser,
      Can.MakeComment,
      Can.UpdateCirtificate,
      Can.MakeSecureAction,
    ]
  ) {
    this.permissions.forEach((permission) => {
      if (!permissions.includes(permission))
        throw new Error('Permission ' + permission + 'is not allowed');
    });
  }

  #checkHealth(key: string, health: string) {
    const manifestFile = fs.readFileSync(
      path.join(this.#secretsFolder, 'manifest.json'),
      'utf8'
    );
    const manifest = JSON.parse(manifestFile) as Record<string, string>;
    if (typeof manifest[key] !== 'string') {
      throw new Error('This deps is not present in the manifest');
    }
    if (manifest[key] !== health) return false;
    return true;
  }

  #setUserHealth(key: string, health: string) {
    const manifestFile = fs.readFileSync(
      path.join(this.#secretsFolder, 'manifest.json'),
      'utf8'
    );
    const manifest = JSON.parse(manifestFile) as Record<string, string>;
    manifest[key] = health;
    fs.writeFileSync(
      path.join(this.#secretsFolder, 'manifest.json'),
      JSON.stringify(manifest),
      'utf8'
    );
  }

  #createAndSaveSecrets() {
    const secret = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const secretsData = {
      secret: secret.toString('hex'),
      iv: iv.toString('hex'),
    };

    fs.writeFileSync(this.#secretFilePath, JSON.stringify(secretsData), 'utf8');

    return {
      key: secret,
      iv: iv,
    };
  }

  #loadKeys() {
    if (!fs.existsSync(this.#secretFilePath)) {
      return this.#createAndSaveSecrets();
    }
    const str = fs.readFileSync(this.#secretFilePath, 'utf8');
    const data = JSON.parse(str);
    return {
      key: Buffer.from(data.secret, 'hex'),
      iv: Buffer.from(data.iv, 'hex'),
    };
  }

  #updateActorWithPermissions<T extends Can[]>(permissions: T) {
    if (permissions.includes(Can.CRUD))
      return {
        data: prismaClient,
      } as Inf<Can.CRUD[]>;
    if (permissions.includes(Can.CreateUser))
      return {
        data: prismaClient.user,
      } as Inf<Can.CreateUser[]>;
    if (permissions.includes(Can.MakeComment))
      return {
        data: prismaClient.comment,
      } as Inf<Can.MakeComment[]>;
    if (permissions.includes(Can.MakeSecureAction))
      return {
        data: prismaClient,
      } as Inf<Can.MakeSecureAction[]>;
    throw new Error('Invalid permissions');
  }

  #loadCertificate(cert: string, pass: string) {
    const allCerts = fs.readdirSync(this.#certificatePath);
    if (!allCerts.includes(`${cert}.json`)) {
      throw new Error('You must specify an existing certificate file');
    }
    const certFile = fs.readFileSync(
      path.join(this.#certificatePath, `${cert}.json`),
      'utf8'
    );
    const userCert = JSON.parse(certFile) as Certificates;
    if (userCert.pass !== pass) {
      throw new Error('Invalid certificate pass: ' + userCert.pass);
    }
    return userCert;
  }

  #setUp() {
    this.#certificate = this.#loadCertificate(
      this.userString,
      this.#passPhrase
    );
    this.setHealth(this.#certificate.health);
    this.#setUserHealth(this.userString, this.#health);
    this.#updateCertificate(this.userString, this.#health);
    this.permissions = this.#certificate.permissions;
  }

  #updateCertificate(cert: string, health: string) {
    const allCerts = fs.readdirSync(this.#certificatePath);
    if (!allCerts.includes(`${cert}.json`)) {
      throw new Error('You must specify an existing certificate file');
    }
    const certFile = fs.readFileSync(
      path.join(this.#certificatePath, `${cert}.json`),
      'utf8'
    );
    const userCert = JSON.parse(certFile) as Certificates;
    userCert.health = health;
    fs.writeFileSync(
      path.join(this.#certificatePath, `${cert}.json`),
      JSON.stringify(userCert),
      'utf8'
    );
  }

  #creator() {
    this.setHealth(Date.now().toString());
    const tecPass = this.#passPhrase.split('?');
    const defaultCert = this.#loadCertificate('default', SUPER_USER_DEFAULT);
    if (tecPass.length <= 1)
      throw new Error('you must specify a most explicit password');
    if (tecPass[2] !== defaultCert.pass)
      throw new Error('you must specify a valid password');
    const newCert = {
      pass: tecPass[1],
      health: this.#health,
      permissions: this.permissions,
    };
    this.#certificate = newCert;
    this.#setUserHealth(this.userString, this.#health);
    fs.writeFileSync(
      path.join(this.#certificatePath, `${this.userString}.json`),
      JSON.stringify(newCert)
    );
  }

  #initDefaultCertificate() {
    this.setHealth(Date.now().toString());
    const certificates = {
      pass: SUPER_USER_DEFAULT,
      health: this.#health,
      permissions: [Can.MakeSecureAction],
    };

    fs.writeFileSync(
      path.join(this.#certificatePath, 'default.json'),
      JSON.stringify(certificates)
    );
  }

  #updatePermission(...permissions: Can[]) {
    this.permissions.push(...permissions);
    this.#certificate.permissions = [...this.permissions];
    this.#updateCertificate(this.userString, this.#health);
  }
}
