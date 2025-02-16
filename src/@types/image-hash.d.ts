import 'image-hash';

declare module 'image-hash' {
  type Callback = (error: Error | null, hash: string) => void;

  export function hash(
    imagePath: string,
    bits: number,
    method: 'hex' | 'binary',
    callback: Callback,
  ): void;
}
