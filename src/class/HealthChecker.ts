import { HealthCheckerInterface, Service } from 'index';
import { prismaClient } from '../config/db';
import puppeteer, { Browser } from 'puppeteer';
import {Service as PlatformServices} from '@prisma/client'

export class HealthChecker implements HealthCheckerInterface {
  #browser: Browser;
  #services: Service['APIs'] & {type: PlatformServices}[];
  #platform: Service['Platform'];

  constructor() {
    const services = prismaClient.services.findMany({
      select: {
        name: true,
        endpoint: true,
        isSecure: true,
        docs: true,
        type: true,
      },
    });
    services
      .then((serv) => {
        this.#services = [...serv];
      })
      .catch(() => console.error);
    const browser = puppeteer.launch({
      browser: 'chrome',
    });
    browser
      .then((brow) => {
        this.#browser = brow;
      })
      .catch(() => console.error);
  }

  async check(serviceParam: string, endpoint?: string): Promise<boolean> {
    if (endpoint) {
      const req = await fetch(endpoint);
      const status = req.status;
      if (status >= 200 && status <= 300) {
        return true;
      }
      return false;
    }

    const serviceEndpoint = (await prismaClient.services.findMany()).filter(
      (service) => service.name === serviceParam
    )[0].endpoint;

    const req = await fetch(serviceEndpoint);
    const status = req.status;
    if (status >= 200 && status <= 300) {
      return true;
    }
    return false;
  }

  async health(): Promise<boolean> {
      const page = await this.#browser.newPage();
      this.#services.forEach(async(service) => {
      })
  }
}
