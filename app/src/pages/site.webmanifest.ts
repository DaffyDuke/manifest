import { SITE, absoluteUrl } from '~/lib/site';
import { jsonResponse } from '~/lib/response';

export function GET() {
  return jsonResponse(
    {
      name: SITE.name,
      short_name: SITE.shortName,
      description: SITE.description,
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: SITE.themeLight,
      theme_color: SITE.themeLight,
      lang: SITE.lang,
      dir: SITE.dir,
      icons: [
        {
          src: absoluteUrl('/icon-192.png'),
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: absoluteUrl('/icon-512.png'),
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: absoluteUrl('/maskable-icon-192.png'),
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: absoluteUrl('/maskable-icon-512.png'),
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } }
  );
}
