CLIENT_ID = ""
CLIENT_SECRET = ""
REDIRECT_URI = ""

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  resp = await test_graph()
  return new Response(resp, { status: 200 })
}

addEventListener('scheduled', event => {
  event.waitUntil(
    handleSchedule(event.scheduledTime)
  )
})

async function handleSchedule(scheduledDate) {
  resp = await test_graph()
  console.log(resp)
}

function to_urlencoded(obj) {
  var params = [];
  for (const [key, value] of Object.entries(obj)) {
    params.push(key + '=' + encodeURIComponent(value))
  }
  return params.join('&');
}

class Client {
  constructor(access_token) {
    this.access_token = access_token
  }

  async call_api(endpoint) {
    let resp = await fetch(
      'https://graph.microsoft.com/v1.0' + endpoint,
      {
        method: 'GET',
        headers: {
          'Authorization': this.access_token,
        }
      }
    )
    console.log('calling ' + endpoint)
    return resp.status_code === 200
  }
}

async function test_graph() {
  refresh_token = await GRAPH_TEST.get('refresh_token', 'text')
  post_data = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'scope': 'offline_access User.Read Files.ReadWrite.All',
    'redirect_uri': REDIRECT_URI,
    'refresh_token': refresh_token,
    'grant_type': 'refresh_token',
  }
  token_resp = await fetch(
    'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    {
      method: 'POST',
      body: to_urlencoded(post_data),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    }
  )
  token_result = await token_resp.json()
  if (token_result.error !== undefined) {
    return JSON.stringify(token_result)
  }
  GRAPH_TEST.put('refresh_token', token_result.refresh_token)
  client = new Client(token_result.access_token)
  await client.call_api('/me/drive')
  await client.call_api('/me/drive/root')
  return "ok"
}
