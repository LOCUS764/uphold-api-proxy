Kendraio Uphold Oauth API Proxy
---

A Oauth proxy / middleware to help Uphold.com users authenticate, so they can make cards and list balances.

Uses Kendraio's secret Oauth key and client ID key to help confirm our identity as an Oauth service acting on behalf of the user, and get's the Oauth token for the user.

It is expected that this could be deloyed to Vercel, a hosted 'serverless' service.

Configure environment variables before deployments:

- [ ] API_URL - production: https://api.uphold.com/oauth2/token sandbox: https://api-sandbox.uphold.com/oauth2/token
- [ ] CLIENT_ID
- [ ] CLIENT_SECRET
- [ ] ALLOW_ORIGIN - true to enable wildcard CORS.