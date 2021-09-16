Kendraio Uphold Oauth and CORS API Proxy
---

A Oauth proxy / middleware to help Uphold.com users authenticate, so they can make cards and list balances, and facilate CORS requests.

Uses Kendraio's secret Oauth key and client ID key to help confirm our identity as an Oauth service acting on behalf of the user, and get's the Oauth token for the user.

It is expected that this could be deloyed with node directly using certbot to generate HTTPS certificates.

Configure environment variables before deployments:

- [ ] API_URL - production: https://api.uphold.com sandbox: https://api-sandbox.uphold.com
- [ ] CLIENT_ID
- [ ] CLIENT_SECRET
