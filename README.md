# blip

Simple site tracker using AdonisJS and SQLite.

## Setup

```bash
npm ci
npm run build
node ace migration:run
```

## Usage

Add a site:
```bash
node ace site:add example.com
```

This outputs a snippet to add to your `<head>`:
```html
<script>navigator.sendBeacon('https://blip.example.com?p='+location.pathname+'&r='+document.referrer)</script>
```

List sites:
```bash
node ace site:list
```

View stats:
```bash
node ace site:stats           # overview
node ace site:stats example.com   # specific site
```

## Deployment

### systemd

Create `/etc/systemd/system/blip.service`:

```ini
[Unit]
Description=blip
After=network.target

[Service]
WorkingDirectory=/opt/blip
ExecStart=/usr/bin/node build/bin/server.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3333
Environment=HOST=127.0.0.1

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable blip
sudo systemctl start blip
```

### Caddy

Add to Caddyfile:

```
blip.* {
    reverse_proxy localhost:3333
}
```
