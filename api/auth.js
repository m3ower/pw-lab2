export default function handler(req, res) {
  const { host } = req.headers;
  const redirectUrl = `https://${host}/api/callback`;

  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID,
    redirect_uri: redirectUrl,
    scope: 'repo,user',
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
