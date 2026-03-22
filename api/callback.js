export default async function handler(req, res) {
  const { code } = req.query;

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

  if (data.error) {
    res.status(400).send(`OAuth error: ${data.error_description}`);
    return;
  }

  const provider = 'github';
  const payload = JSON.stringify(JSON.stringify({ token: data.access_token, provider }));

  res.send(`<!DOCTYPE html><html><body><script>
    (function() {
      function receiveMessage(e) {
        window.opener.postMessage(
          'authorization:${provider}:success:' + ${payload},
          e.origin
        );
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:${provider}', '*');
    })();
  </script></body></html>`);
}
