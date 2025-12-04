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

Remove a site:
```bash
node ace site:remove example.com
```

View stats:
```bash
node ace site:stats           # overview
node ace site:stats example.com   # specific site
```

## Local Testing

```bash
# Add a site
node ace site:add example.com

# Start server
node ace serve

# In another terminal, test with curl (fake the Host header)
curl -X POST -H "Host: blip.example.com" "http://localhost:3333?p=/test-page&r=https://google.com"

# Check it recorded
node ace site:stats example.com
```

## Deployment

### Install on VPS

```bash
# Clone to /opt/blip
sudo git clone https://github.com/edadma/blip.git /opt/blip
cd /opt/blip

# Install and build
sudo npm ci
sudo npm run build
sudo node ace migration:run

# Configure environment
sudo cp .env.example .env
sudo nano .env  # set APP_KEY, NODE_ENV=production
```

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

```bash
sudo systemctl reload caddy
```

### Updating

```bash
cd /opt/blip
sudo git pull
sudo npm ci
sudo npm run build
sudo systemctl restart blip
```
