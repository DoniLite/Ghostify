import { Request, Response } from 'express';
import { QueryXData } from 'index';
import { healthChecker } from '../hooks/healthChecker';

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
}

type TestLabel = 'url' | 'random' | 'post' | 'comment' | 'chunk';

export const test = async (req: Request, res: Response) => {
  const { health, data, service, ordered, by } =
    req.query as unknown as QueryXData<TestQuery>;

  if (!health || !data || !service) {
    const checker = await healthChecker();
    if (checker.pass) {
      res.status(200).json({ health: true, services: checker.services });
      return;
    }
    res.status(500).json({ message: 'the health checking failed' });
    return;
  }

  if (ordered && !by) {
    res
      .status(400)
      .json({
        message: 'you povided a bad request parameters',
        code: 901,
        ref: `https://github.com/DoniLite/Ghostify`,
      });
    return;
  }

  if (by && !ordered) {
    res
      .status(400)
      .json({
        message: 'you povided a bad request parameters',
        code: 901,
        ref: `https://github.com/DoniLite/Ghostify`,
      });
    return;
  }

  try {
    if (Boolean(health)) {
      const checker = await healthChecker();
    }
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({
        message: 'you provided a bad information for the current action',
        code: 900,
        ref: `https://github.com/DoniLite/Ghostify`,
      });
  }
};
