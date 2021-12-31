/*
boxjs地址 :
圈X配置如下，其他软件自行测试

[task_local]
#加油鸭
15 12 * * * https://raw.githubusercontent.com/dongfangbeimu/shouji/main/yd/jyy.js, tag=加油鸭,

[rewrite_local]
#加油鸭
^http://.+/api/wx/readSure url script-request-header https://raw.githubusercontent.com/dongfangbeimu/shouji/main/yd/jyy.js

[MITM]
hostname =
*/

const $ = new Env('加油鸭阅读');
const host = "zhengshih5jiekou.zhuandayup.cn"
$.desc = ""
const notify = $.isNode() ? require('./sendNotify') : '';

!(async () => {
    if ($.isNode()) {
        if (!process.env.wx_jyy_token && process.env.wx_jyy_token === '') {
            console.log(`\n【${$.name}】：未填写相对应的变量`);
            return;
        }

        if (!process.env.wx_jyy_token && process.env.wx_jyy_token === '') {
            console.log(`\n【${$.name}】：未填写相对应的变量`);
            return;
        }
        if (process.env.wx_jyy_token && process.env.wx_jyy_token.indexOf('@') > -1) {
            wx_jyy_token = process.env.wx_jyy_token.split('@');
        } else if (process.env.wx_jyy_token && process.env.wx_jyy_token.indexOf('\n') > -1) {
            wx_jyy_token = process.env.wx_jyy_token.split('\n');
        } else if (process.env.wx_jyy_token && process.env.wx_jyy_token.indexOf('#') > -1) {
            wx_jyy_token = process.env.wx_jyy_token.split('#');
        } else {
            wx_jyy_token = process.env.wx_jyy_token.split();
        }

        if (process.env.wx_jyy_User_Agent && process.env.wx_jyy_User_Agent.indexOf('@') > -1) {
            wx_jyy_User_Agent = process.env.wx_jyy_User_Agent.split('@');
        } else if (process.env.wx_jyy_User_Agent && process.env.wx_jyy_User_Agent.indexOf('\n') > -1) {
            wx_jyy_User_Agent = process.env.wx_jyy_User_Agent.split('\n');
        } else if (process.env.wx_jyy_User_Agent && process.env.wx_jyy_User_Agent.indexOf('#') > -1) {
            wx_jyy_User_Agent = process.env.wx_jyy_User_Agent.split('#');
        } else {
            wx_jyy_User_Agent = process.env.wx_jyy_User_Agent.split();
        }

        console.log(wx_jyy_User_Agent)
    } else {
        console.log('不支持此平台')
    }
    console.log(`------------- 共${wx_jyy_token.length}个账号-------------\n`)
    for (let i = 0; i < wx_jyy_token.length; i++) {
        if (wx_jyy_token[i]) {
            jyy_token = wx_jyy_token[i]
            jyy_User_Agent = wx_jyy_User_Agent[i]
            $.index = i + 1;
            console.log(`\n开始【加油鸭${$.index}】`)
            await jyyid()
        }
    }
    await notify.sendNotify(`加油鸭阅读 -- 账号${$.index}`, $.desc)
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

/**
 * 账户信息
 */
function jyyxx() {
    return new Promise((resolve) => {
        let options = {
            url: `http://${host}/api/wx/readerInfo`,
            headers: {
                "Host": host,
                "Origin": "http://mijih.shashahuaq.cn",
                "User-Agent": jyy_User_Agent,
                "Authorization": jyy_token,
                "Referer": "http://mijih.shashahuaq.cn/"
            }
        }
        $.get(options, async (error, response, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 200) {
                    console.log(`\n🌝【账号${$.index}-${result.data.nickname}】\n【账户信息】\n【今日已阅读】: ` + result.data.readCount + `\n【今日金币】:` + result.data.gold + `\n【阅读单价】:` + result.data.goldReward + `金币` + `\n🚫注: 不运行证明今日已达上限或阅读失效`)
                    $.desc += `\n🌝【账号${$.index}-${result.data.nickname}】\n【账户信息】\n【今日已阅读】: ` + result.data.readCount + `\n【今日金币】:` + result.data.gold + `\n【阅读单价】:` + result.data.goldReward + `金币` + `\n🚫【注】: 不运行证明今日已达上限或阅读失效`

                    let date = new Date(result.data.limitTime)
                    let msg = `\n🚫【阅读状态】: 阅读异常, 请在 ${date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()} 之后再来阅读吧`
                    console.log(msg)
                    $.desc += msg

                    // 提现
                    if (Number(result.data.gold >= 3000)) {
                        await jyytx()
                    }
                } else {
                    console.log(`\n🌝【账号${index}】: 接口请求失败，尝试更换链接`)
                    $.desc += `\n🌝【账号${index}】: 接口请求失败，尝试更换链接`;
                }
            } catch (e) {
                //$.logErr(e, response)
            } finally {
                resolve()
            }
        })
    })
}

//key
function jyyid() {
    return new Promise((resolve) => {
        if (typeof $.getdata('jyyhdArr') === 0) {
            $.msg($.name, "", '请先获取加油鸭数据!😓',)
            $.done()
        }
        let options = {
            url: `http://${host}/api/wx/read`,
            headers: {
                "Host": host,
                "Origin": "http://mijih.shashahuaq.cn",
                "User-Agent": jyy_User_Agent,
                "Authorization": jyy_token,
                "Referer": "http://mijih.shashahuaq.cn/"
            }
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(err, data)
                    notify.sendNotify(`加油鸭鸭 -- 🌝账号${$.index}`, `账号异常 ${err}`)
                } else {
                    const result = JSON.parse(data)
                    if (result.code === 200) {
                        if (result.data.limitFlag === 1) {
                            await jyyxx()
                        } else {
                            jyykey = result.data.recordId
                            let waitSeconds = Math.floor(getRandomArbitrary(6, 10))
                            console.log(`🌝账号${$.index}获取key回执成功，开始跳转阅读📖\n` + jyykey + `\n🌝等待 ${waitSeconds}秒 提交任务\n`)

                            await readArticle(result.data.readUrl)
                            await $.wait(waitSeconds * 1000);
                            await jyytj(result.data.recordId)
                        }
                    } else {
                        console.log(`\n🌝【账号${$.index}】: 🚫接口请求失败`)
                        $.desc += `\n🌝【账号${$.index}】: 🚫接口请求失败`
                    }
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        })
    })
}

/**
 * 请求微信文章
 *
 * @param readUrl 阅读地址
 */
function readArticle(readUrl) {
    return new Promise((resolve, reject) => {
        $.get({
            url: readUrl,
        }, async (error, response, data) => {
            try {
                if (error) {
                    console.log(error)
                } else {
                    console.log(`阅读 ${readUrl} 完毕`)
                }
            } catch (e) {
                $.logErr(e, response)
            } finally {
                resolve()
            }
        })
    })
}

//提交
function jyytj() {
    return new Promise((resolve) => {
        let options = {
            'method': 'POST',
            'url': `http://${host}/api/wx/readSure`,
            'headers': {
                'Host': host,
                'Accept': 'application/json',
                'Authorization': jyy_token,
                'Accept-Language': 'zh-cn',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json;charset=utf-8',
                'Origin': 'http://mijih.shashahuaq.cn',
                'User-Agent': jyy_User_Agent,
                'Connection': 'keep-alive',
                'Referer': 'http://mijih.shashahuaq.cn/'
            },
            body: `{"recordId": ${jyykey}}`
        };
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(err, data)
                } else {
                    console.log(data)
                    const result = JSON.parse(data)
                    if (result.code === 200) {
                        console.log(`\n🌝【状态】: 提交成功` + `\n`)
                        await jyyid()
                    } else {
                        console.log(`\n🌝【账号${$.index}】:🚫` + result.msg)
                        $.desc += `\n🌝【账户${$.index}】\n🚫【阅读状态】: ` + result.msg + `/n`
                    }
                }
            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        })
    })
}

//提现
function jyytx() {
    return new Promise((resolve) => {
        let url = {
            url: `http://${host}/api/wx/takeMoney`,
            'headers': {
                'Host': host,
                'Accept': 'application/json',
                'Authorization': jyy_token,
                'Accept-Language': 'zh-cn',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': 'application/json;charset=utf-8',
                'Origin': 'http://mijih.shashahuaq.cn',
                'User-Agent': jyy_User_Agent,
                'Connection': 'keep-alive',
                'Referer': 'http://mijih.shashahuaq.cn/'
            },
            body: '{"amount":30}'
        }
        $.post(url, async (err, resp, data) => {
            try {
                const result = JSON.parse(data)
                if (result.code === 200) {
                    console.log(`\n🌝【账户${$.index}提现状态】: 提现成功` + `\n`)
                    $.desc += `\n🌝【账户${$.index}提现状态】: 提现成功` + `\n`

                } else {
                    //console.log(`\n🌝【账号${$.index}】:🚫` +  result.msg)
                    //$.desc +=`\n🌝【账户${$.index}】\n🚫【阅读状态】: ` + result.msg + `/n`
                    console.log(`\n🚫【账户${$.index}提现状态】: 提现失败 ${result.msg}`)
                    $.desc += `\n🚫【账户${$.index}提现状态】: 提现失败 ${result.msg}`
                }

            } catch (e) {
                //$.logErr(e, resp);
            } finally {
                resolve()
            }
        })
    })
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// prettier-ignore @formatter:off
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0===+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1===RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
