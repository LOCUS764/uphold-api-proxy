import axios from "axios";
import qs from 'qs';

if ((!process.env.COIL_CLIENT_ID) || (!process.env.COIL_CLIENT_SECRET)) {
  console.error('DEFINE ENV VARS PLEASE!')
}

function getBtp(oauthTokenResponse, res) {
  const accessToken = oauthTokenResponse.data.access_token;
  axios.post('https://api.coil.com/user/btp', '', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + accessToken
    }
  }).then(function (btpResponse) {
    console.log(btpResponse)


    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(btpResponse.data)

  }).catch(function (error) {
    console.error(error)
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.json(error.message)
  });
}

export default function handler(req, res) {

  const encodedAuth = Buffer.from(process.env.COIL_CLIENT_ID + ':' + encodeURIComponent(process.env.COIL_CLIENT_SECRET)).toString('base64')

  axios.post('https://coil.com/oauth/token', qs.stringify({
    'grant_type': 'authorization_code',
    'redirect_uri': 'https://app.kendra.io/coil/callback',
    'code': req.query.code
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + encodedAuth
    }
  }).then(function (oauthTokenResponse) {
    console.log(oauthTokenResponse.data);
    getBtp(oauthTokenResponse, res);

  }).catch(function (error) {
    console.error(error)
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.json(error.message)

  });

}
