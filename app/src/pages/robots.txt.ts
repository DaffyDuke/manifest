import { absoluteUrl } from '~/lib/site';
import { textResponse } from '~/lib/response';

export function GET() {
  return textResponse(`# AI-Driven Development crawler policy
User-agent: *
Allow: /
Disallow: /maintenance

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Content-Signal: search=yes, ai-input=yes, ai-train=yes
Sitemap: ${absoluteUrl('/sitemap.xml')}
Sitemap: ${absoluteUrl('/sitemap-index.xml')}
`);
}
