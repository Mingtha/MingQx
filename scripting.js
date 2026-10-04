/*
删除声明文件， 避免每次同步大请求
[rewrite_local]
^https://script\.804612\.xyz/syncScriptFrom(?:Server|Client)(?:\?.*)?$ url script-request-body https://raw.githubusercontent.com/Mingtha/MingQx/refs/heads/main/Scripting.js
[mitm]
hostname = script.804612.xyz
*/
(function () {
  var result = {};
  try {
    if (
      $request.method !== 'POST' ||
      !/^https:\/\/script\.804612\.xyz\/syncScriptFrom(?:Server|Client)(?:\?.*)?$/.test($request.url)
    ) {
      return;
    }
    var raw = $request.body;
    console.log(
      '[scripting-sync-v2] entered; bodyType=' + typeof raw + '; chars=' + (typeof raw === 'string' ? raw.length : 0),
    );
    if (typeof raw !== 'string' || !raw.length) throw new Error('Request body unavailable');
    var data = JSON.parse(raw);
    if (
      !data ||
      Array.isArray(data) ||
      typeof data.scriptName !== 'string' ||
      !data.scriptName ||
      typeof data.socketId !== 'string' ||
      !data.socketId
    ) {
      throw new Error('Unexpected sync request fields');
    }
    // ponytail: reuse disk dts; disable this rule for one full sync after an app upgrade or dts loss.
    delete data['global.d.ts'];
    delete data['scripting.d.ts'];
    delete data.extraDtsFiles;
    result.body = JSON.stringify(data);
    console.log(
      '[scripting-sync-v2] rewritten; chars=' +
        raw.length +
        ' -> ' +
        result.body.length +
        '; fields=' +
        Object.keys(data).join(','),
    );
  } catch (error) {
    console.log('[scripting-sync-v2] unchanged; ' + String(error));
    result = {};
  } finally {
    // Quantumult X updates body-related headers; do not copy the old Content-Length.
    $done(result);
  }
})();
