/*
删除声明文件， 避免每次同步大请求
[rewrite_local]
^https:\/\/script\.804612\.xyz\/syncScriptFrom(?:Server|Client)(?:\?.*)?$ url script-request-body https://raw.githubusercontent.com/Mingtha/MingQx/refs/heads/main/Scripting.js
[mitm]
hostname = script.804612.xyz
*/
