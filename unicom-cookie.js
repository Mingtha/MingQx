/*
中国联通 Cookie 获取
作者：ming

[rewrite_local]
^https:\/\/m\.client\.10010\.com\/mobileserviceimportant\/home\/queryUserInfoSeven(?:\?|$) url script-response-body https://raw.githubusercontent.com/Mingtha/MingQx/refs/heads/main/unicom-cookie.js

[mitm]
hostname = m.client.10010.com
*/

const KEY = "unicom_cookie";
const TIME = "unicom_updated";

try {
  const body = JSON.parse($response.body || "{}");
  const rows = body?.data?.dataList;

  if (
    body.code === "Y" &&
    Array.isArray(rows) &&
    ["fee", "flow"].every(t => rows.some(x => x?.type === t && x.number != null))
  ) {
    const headers = $request.headers || {};
    const key = Object.keys(headers).find(k => k.toLowerCase() === "cookie");
    const cookie = key ? String(headers[key]).trim() : "";

    if (!cookie || !cookie.includes("=") || /[\r\n]/.test(cookie)) {
      $notify("中国联通", "未获取到 Cookie", "本次请求头中没有有效 Cookie。");
    } else if ($prefs.valueForKey(KEY) !== cookie) {
      if (!$prefs.setValueForKey(cookie, KEY)) throw Error("保存失败");

      $prefs.setValueForKey(new Date().toISOString(), TIME);
      $notify("中国联通", "Cookie 已更新", "可在 BoxJS 查看，随后刷新小组件。");
    }
  }
} catch (e) {
  console.log(`[中国联通] ${e}`);
  $notify("中国联通", "Cookie 获取失败", "请检查响应格式或 QX 存储状态。");
}

$done({});
