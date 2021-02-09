Kendraio Coil API Proxy
---

A prototype Oauth proxy for BTP token retrival, to facilate Web Monetization payments on behalf of Coil.com users.
Uses Kendraio's secret Oauth key and client ID key to help confirm our identity as an Oauth service acting on behalf of the user, and get's the BTP token for the user, which lasts half an hour.
Currently refreshing stale tokens is not yet implemented.

It is expected that this could be deloyed to Vercel, a hosted 'serverless' service.

Configure COIL_CLIENT_ID and COIL_CLIENT_SECRET environment variables before deployments.

If testing locally, CORS proxy can be enabled by setting a DEBUG environment variable to 'true'.

Additionally, since we specified an Oauth callback to kendra.io with no localhost for development or testing, a UserScript (which could be ran by a Tampermonkey browser extension) was used during development.

See debugging/kendraio-coil-callback-redirect.user.js