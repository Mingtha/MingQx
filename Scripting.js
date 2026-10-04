/*
删除声明文件， 避免每次同步大请求
[rewrite_local]
^https://script\.804612\.xyz/syncScriptFromServer(?:\?.*)?$ url jsonjq-request-body 'del(.["global.d.ts"], .["scripting.d.ts"], .extraDtsFiles)'
[mitm]
hostname = script.804612.xyz
*/
