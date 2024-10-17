# lastfm-api_cloudflare-proxy
This is my Cloudflare worker code that runs as an API proxy for my blog's lastfm shortcode.

- Note:
  - I'm using large size image only because I resize them to 100px later.
  - I'm also doing the response reduction right on proxy.
  - It run every 60s and cache it for 60s so when the script calls it there will be less delay.

