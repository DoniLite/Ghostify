// @ts-types="@types/express"
import { Request, Response } from 'express';
import { QueryXData } from '../@types/index.d.ts';
import { HealthChecker } from '../class/HealthChecker.ts';

interface TestQuery {
  health: string;
  /**
   * The type of the data you want to retrieve
   * it may be some `posts` or some `chunk` of html snippets
   */
  data: TestLabel;
  ordered: string;
  by: 'type' | 'key';
  service: string;
  endpoint: string;
}

type TestLabel = 'url' | 'random' | 'post' | 'comment' | 'chunk';

export const test = async (req: Request, res: Response) => {
  const { health, data, service, ordered, by, endpoint } = req
    .query as unknown as QueryXData<TestQuery>;

  /**
   * The boolean parsed of the `health` parameter
   */
  let bool;

  if (health) {
    try {
      bool = Boolean(health);
    } catch (err) {
      console.error(err);
      res.status(400).json({
        message: 'you provided a bad information for the current action',
        code: 900,
        ref: `https://github.com/DoniLite/Ghostify`,
      });
      return;
    }
  }

  const testClass = new HealthChecker();

  if (!health || !data || !service) {
    const checker = await testClass.health();
    if (checker.internals && checker.API) {
      res.status(200).json({ health: true, services: checker });
      return;
    }
    res.status(500).json({ message: 'the health checking failed' });
    return;
  }

  if (ordered && !by) {
    res.status(400).json({
      message: 'you povided a bad request parameters',
      code: 901,
      ref: `https://github.com/DoniLite/Ghostify`,
    });
    return;
  }

  if (by && !ordered) {
    res.status(400).json({
      message: 'you povided a bad request parameters',
      code: 901,
      ref: `https://github.com/DoniLite/Ghostify`,
    });
    return;
  }

  if (bool) {
    const checker = await testClass.checkServices();
    if (checker.pass) {
      res.status(200).json({ success: true, services: checker.services });
      return;
    }
    res.status(400).json({ success: false, services: checker.services });
    return;
  }

  if (service && endpoint) {
    const result = await testClass.check(service, endpoint);
    if (result) {
      res.status(200).json({ success: true, message: 'Service is alive' });
      return;
    }
    res.status(400).json({ success: false, message: 'Service is not alive' });
    return;
  }
};
