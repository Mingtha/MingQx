/*
精简同步请求，转发后返回服务器真实响应。
[rewrite_local]
^https:\/\/script\.804612\.xyz\/syncScriptFrom(?:Server|Client)(?:\?|$) url script-analyze-echo-response https://raw.githubusercontent.com/Mingtha/MingQx/refs/heads/main/scripting.js
[mitm]
hostname = script.804612.xyz
*/
(async () => {
  try {
    if ($request.method !== 'POST' || !/^https:\/\/script\.804612\.xyz\/syncScriptFrom(?:Server|Client)(?:\?.*)?$/.test($request.url)) throw Error('Unexpected sync request');
    const data = JSON.parse($request.body);
    if (!data || Array.isArray(data) || typeof data.scriptName !== 'string' || !data.scriptName || typeof data.socketId !== 'string' || !data.socketId) throw Error('Invalid sync data');
    delete data['global.d.ts'];
    delete data['scripting.d.ts'];
    delete data.extraDtsFiles;
    const response = await $task.fetch({
      url: $request.url + ($request.url.includes('?') ? '&' : '?') + 'qx_sync_relay=1',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      opts: { redirection: false },
    });
    $done({
      status: 'HTTP/1.1 ' + response.statusCode + (response.statusCode === 200 ? ' OK' : ' Upstream'),
      headers: { 'Content-Type': 'application/json' },
      body: response.body,
    });
  } catch (error) {
    $done({
      status: 'HTTP/1.1 502 Bad Gateway',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: String(error.message || error.error || error) }),
    });
  }
})();
