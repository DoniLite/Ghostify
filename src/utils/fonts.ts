import { join } from 'std/path/mod.ts';

const { readFile, cwd } = Deno;

const projectRoot = cwd();

export async function loadFonts() {
  try {
    // Solution A: Utiliser Google Fonts via fetch (recommandé)
    const fonts = await loadLocalFonts();
    if (fonts.length > 0) {
      return fonts;
    }

    // Solution B: Utiliser des polices locales si disponibles
    return await loadGoogleFonts();
  } catch (error) {
    console.warn('Failed to load fonts, using system fallback:', error);
    return getSystemFallbackFonts();
  }
}

// Solution A: Charger depuis Google Fonts (plus fiable)
async function loadGoogleFonts() {
  try {
    const [regularResponse, boldResponse] = await Promise.all([
      fetch(
        'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff',
      ),
      fetch(
        'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff',
      ),
    ]);

    if (!regularResponse.ok || !boldResponse.ok) {
      throw new Error('Failed to fetch Google Fonts');
    }

    const [regularBuffer, boldBuffer] = await Promise.all([
      regularResponse.arrayBuffer(),
      boldResponse.arrayBuffer(),
    ]);

    return [
      {
        name: 'Inter',
        data: regularBuffer,
        weight: 400,
        style: 'normal' as const,
      },
      {
        name: 'Inter',
        data: boldBuffer,
        weight: 700,
        style: 'normal' as const,
      },
    ];
  } catch (error) {
    console.warn('Google Fonts loading failed:', error);
    return [];
  }
}


async function loadLocalFonts() {
  try {
    const fontFiles = [
      join(projectRoot, 'static/fonts/Inter.ttf'),
      join(projectRoot, 'static/fonts/Inter_bold.ttf'),
    ];


    const fontBuffers = [];
    for (const fontPath of fontFiles) {
      try {
        const buffer = await readFile(fontPath);
        // Validation basique du format
        if (isValidFontBuffer(buffer)) {
          fontBuffers.push(buffer);
        } else {
          console.warn(`Invalid font file: ${fontPath}`);
        }
      } catch (_error) {
        console.warn(`Font file not found: ${fontPath}`);
      }
    }

    if (fontBuffers.length === 0) {
      throw new Error('No valid local fonts found');
    }

    return [
      {
        name: 'Inter',
        data: fontBuffers[0],
        weight: 400,
        style: 'normal' as const,
      },
      ...(fontBuffers[1]
        ? [{
          name: 'Inter',
          data: fontBuffers[1],
          weight: 700,
          style: 'normal' as const,
        }]
        : []),
    ];
  } catch (error) {
    console.warn('Local fonts loading failed:', error);
    return [];
  }
}


function isValidFontBuffer(buffer: Uint8Array): boolean {
  if (buffer.length < 4) return false;

  const signature = new TextDecoder().decode(buffer.slice(0, 4));


  const validSignatures = ['wOFF', 'OTTO', 'true', 'typ1', '\x00\x01\x00\x00'];

  return validSignatures.some((sig) => signature.startsWith(sig)) ||
    buffer[0] === 0x00 && buffer[1] === 0x01 && buffer[2] === 0x00 &&
      buffer[3] === 0x00; // TTF
}


function getSystemFallbackFonts() {
  console.log('Using system fallback fonts');
  return [
    {
      name: 'system-ui',
      data: new ArrayBuffer(0),
      weight: 400,
      style: 'normal' as const,
    },
    {
      name: 'system-ui',
      data: new ArrayBuffer(0),
      weight: 700,
      style: 'normal' as const,
    },
  ];
}


export async function downloadGoogleFonts() {
  try {
    const fonts = [
      {
        url:
          'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
        filename: 'inter-regular.woff2',
      },
      {
        url:
          'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2',
        filename: 'inter-bold.woff2',
      },
    ];

    for (const font of fonts) {
      const response = await fetch(font.url);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        await Deno.writeFile(
          `./src/assets/fonts/${font.filename}`,
          new Uint8Array(buffer),
        );
        console.log(`Downloaded: ${font.filename}`);
      }
    }
  } catch (error) {
    console.error('Error downloading fonts:', error);
  }
}
