import { Checker, HealthCheckerInterface, Service } from 'index';
import { prismaClient } from '../config/db';
import puppeteer, { Browser } from 'puppeteer';
import { Service as PlatformServices } from '@prisma/client';

export class HealthChecker implements HealthCheckerInterface {
  #browser: Browser;
  #services:
    & Service['APIs']
    & { type: PlatformServices; testingData?: string }[];

  /**
   * Health check class for the specified service and the platform services
   *
   * This class runs the health check task and returns the results
   * ```javascript
   *  const healthCheck = new HealthChecker();
   *  //to check the health of the specified service wich endpoint will be filtered in the database
   *  await healthCheck.check('Poster');
   *  //if you want to provide a valid endpoint
   *  await healthCheck.check('Poster', 'https://example.com');
   * ```
   * - If you provide a non-valid endpoint it will be ignored
   *
   * the `check` method returns a promise that will be resolved to boolean
   *
   * If successful the result will be `true` and `false` if not
   *
   * ```javascript
   *  const healthCheck = new HealthChecker();
   *  //if you just want to check the health of all services
   *  await healthCheck.checkServices();
   *  await healthCheck.health();
   * ```
   * The `health` method is used to check the entire list of services and plateform integrity notice that
   * - this function can cost a lot of resources
   * - if you want to see the status of all running services [check](https://ghostify.site/status/)
   */
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

  /**
   * function that test a specefic service using the endpoint if provided
   *
   * if not, the service endpoint will be found in the database. If no `service` corresponds the function will throw an error
   * @param serviceParam the service that will be test
   * @param endpoint  the test endpoint `url`
   * @returns boolean
   */
  async check(serviceParam: string, endpoint?: string): Promise<boolean> {
    if (endpoint) {
      const req = await fetch(endpoint);
      const { status } = req;
      if (status >= 200 && status <= 300) {
        return true;
      }
      return false;
    }

    const serviceEndpoint = (await prismaClient.services.findMany()).filter(
      (service) => service.name === serviceParam,
    )[0].endpoint;

    const req = await fetch(serviceEndpoint);
    const { status } = req;
    if (status >= 200 && status <= 300) {
      return true;
    }
    return false;
  }

  async checkServices(): Promise<Checker> {
    const checker: Checker = {
      pass: true,
      services: [],
    };
    await Promise.all(
      this.#services.map(async (service) => {
        const pass = await this.check(service.name, service.endpoint);
        checker.services.push({
          name: service.name,
          endpoint: service.endpoint,
        });
        if (!pass) {
          checker.pass = false;
        } else {
          checker.pass = true;
        }
      }),
    );
    return checker;
  }

  async health(): Promise<Service['Platform']> {
    const platformQuota: {
      APIs: { name: string; endpoint: string; pass: boolean }[];
      Poster: { name?: string; endpoint?: string; pass?: boolean };
      CVMaker: { name?: string; endpoint?: string; pass?: boolean };
    } = {
      APIs: [],
      Poster: {},
      CVMaker: {},
    };
    const page = await this.#browser.newPage();
    this.#services.forEach(
      async (service: {
        name: string;
        endpoint: string;
        docs?: string;
        isSecure?: boolean;
        type: PlatformServices;
        testingData?: string;
      }) => {
        if (service.type === 'APIs') {
          if (service.testingData) {
            const test = await fetch(service.endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(service.testingData),
            });
            const { status } = test;
            if (status >= 200 && status < 400) {
              platformQuota.APIs.push({
                name: service.name,
                endpoint: service.endpoint,
                pass: true,
              });
            }
            platformQuota.APIs.push({
              name: service.name,
              endpoint: service.endpoint,
              pass: false,
            });
          } else {
            const req = await fetch(service.endpoint);
            const { status } = req;
            if (status >= 200 && status < 400) {
              platformQuota.APIs.push({
                name: service.name,
                endpoint: service.endpoint,
                pass: true,
              });
            }
            platformQuota.APIs.push({
              name: service.name,
              endpoint: service.endpoint,
              pass: false,
            });
          }
        } else {
          await page.goto(service.endpoint);
          const res = await page.waitForNavigation();
          if (res.status() >= 200 && res.status() < 400) {
            await page
              .locator('input')
              .filter((el) => el.type === 'text' && el.placeholder === '')
              .fill('default');
            await page
              .locator('input')
              .filter((el) => el.type === 'password')
              .fill(
                process.env.SUPER_USER_DEFAULT +
                  ';' +
                  process.env.SUPER_USER_PASS_CODE,
              );
            await page.keyboard.press('Enter');
            const pageRes = await page.waitForNavigation();
            if (pageRes.status() >= 200 && pageRes.status() < 400) {
              page.locator('window').scroll({ scrollTop: 20 });
            }
          } else {
            try {
              platformQuota[service.name as 'Poster' | 'CVMaker'] = {
                endpoint: service.endpoint,
                pass: false,
                name: service.name,
              };
            } catch (e) {
              console.error(e);
            }
          }
        }
      },
    );
    return {
      internals: platformQuota.CVMaker.pass && platformQuota.Poster.pass,
      API: platformQuota.APIs.filter((el) => el.pass).length >
        platformQuota.APIs.length / 2,
    };
  }
}
