import { OGImageParams } from '../@types/og.ts';

export function useOGImage(
  type: 'page' | 'document' | 'resume',
  params: OGImageParams,
) {
  const searchParams = new URLSearchParams();
  searchParams.set('type', type);

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, String(value));
  });

  return `/api/v1/og?${searchParams.toString()}`;
}
