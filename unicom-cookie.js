/*
中国联通 Cookie 获取
作者：ming
开启重写和 MitM 后，打开联通 App 刷新首页。
成功后保存 unicom_cookie、unicom_updated。

[rewrite_local]
^https:\/\/m\.client\.10010\.com\/mobileserviceimportant\/home\/queryUserInfoSeven(?:\?|$) url script-response-body https://raw.githubusercontent.com/Mingtha/MingQx/refs/heads/main/unicom-cookie.js

[mitm]
hostname = m.client.10010.com
*/

// Quantumult X · 联通 Cookie 获取
// 仅在接口查询成功后保存，不修改请求或响应。
const KEY = "unicom_cookie";
const TIME = "unicom_updated";

try {
  const url = String($request.url || "");
  if (/^https:\/\/m\.client\.10010\.com\/mobileserviceimportant\/home\/queryUserInfoSeven(?:\?|$)/.test(url)) {
    const body = JSON.parse($response.body);
    const rows = body.data && body.data.dataList;
    const valid = body.code === "Y" && Array.isArray(rows) &&
      ["fee", "flow"].every(type =>
        rows.some(x => x && x.type === type && x.number != null)
      );

    if (valid) {
      const headers = $request.headers || {};
      const name = Object.keys(headers).find(k => k.toLowerCase() === "cookie");
      const cookie = name && String(headers[name]).trim();

      if (cookie && cookie.includes("=") && !/[\r\n]/.test(cookie)) {
        const changed = $prefs.valueForKey(KEY) !== cookie;
        if (!$prefs.setValueForKey(cookie, KEY)) throw Error("保存失败");
        $prefs.setValueForKey(new Date().toISOString(), TIME);
        if (changed) {
          $notify("中国联通", "Cookie 已保存", "可在 BoxJS 查看，随后刷新小组件。");
        }
      } else {
        $notify("中国联通", "未获取到 Cookie", "本次请求头中没有有效 Cookie。");
      }
    }
  }
} catch (_) {
  $notify("中国联通", "Cookie 获取失败", "请检查响应格式或 QX 存储状态。");
} finally {
  $done({});
}
