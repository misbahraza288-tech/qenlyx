# QENLYX — Beyond Imagination

**One name. Infinite future.** QENLYX is the parent company of **NextEdit Agency**, **Mxa AI** and the studios founded by **Misbah Raza** (Govindpur, Dhanbad): AI models & systems, web, apps, design and music.

**Live:** https://misbahraza288-tech.github.io/qenlyx/

## How this site is made
**Misbah Digital Computer** builds this website by itself. Its source lives in the private repo `misbah-digital-computer`:
- config: `brands/qenlyx/site.json` (text, companies, videos, websites, services, Hinglish lines)
- media: `brands/qenlyx/media/` (logo, photos, videos)
- template: `templates/sites/brand/` · builder: `scripts/build-brand-site.mjs` · workflow: `brand-site.yml`
- Telegram: `/brandsite qenlyx` or "qenlyx website banao". Editing `site.json` also rebuilds it automatically.

Files in this repo are **generated**, so don't edit them here. Change the config, and the bot publishes again (this README stays).

## Security, honestly
Anyone can view the HTML, CSS and JS of a public website in their browser. That is true for every website, Google's included. This is what actually protects this one:
- no secrets, API keys or passwords anywhere in the code
- no server, database or login, so there is nothing to break into
- a strict Content-Security-Policy: only the site's own files can run, with no inline scripts and no third-party code
- a referrer policy, and every external link opens with `rel="noopener noreferrer"`
- CSS and JS are minified on every build
- the contact form saves nothing. It only opens WhatsApp with the message filled in

© QENLYX · Misbah Raza
