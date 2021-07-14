import axios from "axios";
import qs from 'qs';


if ((!process.env.API_URL) || (!process.env.CLIENT_ID) || (!process.env.CLIENT_SECRET)) {
  console.error('DEFINE ENV VARS PLEASE!')
}

export default function handler(req, res) {

  axios.post(process.env.API_URL,
    qs.stringify({
      code: req.query.code,
      grant_type: 'authorization_code'
    }), {
    auth: {
      username: process.env.CLIENT_ID,
      password: process.env.CLIENT_SECRET,
    }, headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (oauthTokenResponse) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(oauthTokenResponse.data);

  }).catch(function (error) {
    console.error(error)
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.json(error.message)

  });

}
