const path = require('path')
const fs = require("fs");

const pluginDataPath = LiteLoader.plugins["QQRedPackGetter"].path.data
const settingsPath = path.join(pluginDataPath, "settings.json")


function log(...data) {
    console.log('[自动抢红包]:', data)
}

if (!fs.existsSync(pluginDataPath)) {
    fs.mkdirSync(pluginDataPath, { recursive: true })
    log('配置文件夹不存在，已自动创建')
}
if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify(
        {
        delay: 500,
        keywords: ["gua", "测", "挂", "ti", "踢", "试"],
        randomDelayAble: 0,
        randomDelay: {
		min: 1000,
		max: 2000
	}
    }
));
    log('配置文件不存在，已自动创建')
}

const config = fs.readFileSync(settingsPath, { encoding: 'utf8', flag: 'r' });
log('读入配置:', config)

exports.onBrowserWindowCreated = (win) => {
    win.webContents.executeJavaScript(`window.redPackConfig=JSON.parse('${config}')`)
}
