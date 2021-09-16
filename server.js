/* eslint-disable no-undef */
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const qs = require('qs');

const STATUS_OK = 200;
const STATUS_BAD_REQUEST = 400;

if ((!process.env.API_URL) || (!process.env.CLIENT_ID) || (!process.env.CLIENT_SECRET)) {
    console.error('DEFINE ENV VARS PLEASE!')
}
if (process.env.API_URL.includes('oauth2/token')) {
    console.error('OLD URL, PLEASE FIX');
}

const ALLOWED_HEADERS = ["authorization", "content-type"];

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*'
};

function loginHandler(req, res) {

    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            ...CORS_HEADERS,
            'Access-Control-Expose-Headers': Object.keys(req.headers).join(','),
        });

        return res.end();
    }
    const url = new URL(process.env.API_URL + req.url);
    const code = url.searchParams.get('code');

    axios.post(process.env.API_URL + '/oauth2/token',
        qs.stringify({
            code: code,
            grant_type: 'authorization_code'
        }), {
        auth: {
            username: process.env.CLIENT_ID,
            password: process.env.CLIENT_SECRET,
        }, headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (oauthTokenResponse) {

        res.writeHead(STATUS_OK, CORS_HEADERS);
        res.write(JSON.stringify(oauthTokenResponse.data));
        res.end();
        return;

    }).catch(function () {
        console.log('loginHandler error');

        res.writeHead(STATUS_BAD_REQUEST, {
            'Content-Type': 'application/json',
            ...CORS_HEADERS
        });
        res.end();
        return;
    });
}

function proxyHandler(req, res) {
    // proxy the request to the API server and get a response back from it 
    // and log all request status codes to console

    let cleanHeaders = JSON.parse(JSON.stringify(req.headers))
    Object.keys(cleanHeaders).forEach((key) => {
        if (!ALLOWED_HEADERS.includes(key)) {
            delete cleanHeaders[key];
        }
    });
    var dataBody;
    if (req.method === 'POST' || req.method === 'PUT') {

        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            dataBody = body;

            const responder = function (a_request) {
                a_request.then(function (response) {
                    console.log('response: ' + response.status);
                    res.writeHead(response.status, {
                        ...response.headers,
                        ...CORS_HEADERS
                    });

                    res.write(JSON.stringify(response.data));
                    res.end();
                }).catch(function (error) {
                    console.log('error during proxy', error);
                    res.writeHead(500, CORS_HEADERS);
                    res.end();
                });
            }
            responder(axios({
                method: req.method,
                url: process.env.API_URL + req.url,
                headers: cleanHeaders,
                data: dataBody
            }))
        });


    } else {
        const responder = function (a_request) {
            a_request.then(function (response) {
                console.log('response: ' + response.status);
                res.writeHead(response.status, {
                    ...response.headers,
                    ...CORS_HEADERS
                });

                res.write(JSON.stringify(response.data));
                res.end();
            }).catch(function (error) {
                console.log('error during proxy', error);
                res.writeHead(500, CORS_HEADERS);
                res.end();
            });
        }
        responder(axios({
            method: req.method,
            url: process.env.API_URL + req.url,
            headers: cleanHeaders
        }))
    }
}
https.createServer({
    key: fs.readFileSync('privatekey.pem', 'utf8'),
    cert: fs.readFileSync('fullchain.pem', 'utf8')
}, function (req, res) {

    console.log(req.method + ' request: ' + req.url);
    if (req.method === 'OPTIONS') {
        res.writeHead(200, CORS_HEADERS);
        res.end();
    }

    if (req.url.includes('/api/login?code=')) {
        loginHandler(req, res);
    } else {
        proxyHandler(req, res);
    }

}).listen(443);