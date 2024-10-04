// express-simple-cdn.d.ts

declare module 'express-simple-cdn' {
  import { Request, Response, NextFunction } from 'express';

  /**
   * Options interface for configuring the CDN middleware.
   */
  interface SimpleCDNOptions {
    /**
     * Base URL of the CDN (e.g., 'https://cdn.example.com').
     */
    baseURL: string;

    /**
     * A list of file types/extensions to be served via CDN.
     * Defaults to ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg'].
     */
    fileTypes?: string[];

    /**
     * Boolean indicating whether to force HTTPS for CDN URLs.
     * Defaults to `true`.
     */
    https?: boolean;

    /**
     * A function that transforms the original file URL into the CDN URL.
     * Takes the original URL as a parameter and returns the modified URL.
     */
    transform?: (url: string) => string;
  }

  /**
   * CDN middleware for Express.
   * Adds CDN URL to assets based on file extensions and options provided.
   *
   * @param options - Configuration options for the CDN middleware.
   * @returns A middleware function that modifies the asset URLs.
   */
  function expressSimpleCDN(
    options: SimpleCDNOptions
  ): (req: Request, res: Response, next: NextFunction) => void;

  export = expressSimpleCDN;
}
