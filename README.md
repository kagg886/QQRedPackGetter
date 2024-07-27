# QQRedPackGetter

## 1. 原理和注意事项

- 基于DOM的模拟点击抢红包。所以要想监听到红包消息，现在无需打开你想监听的群窗口。
- 请自行修改:`LiteQQLoaderNT/data/QQRedPackGetter/config.json`(该文件需首次启动后才能生成)
- 每次修改 `config.json`后需要重启QQ才能生效

> 基于主播的Electron的菜鸡水平，欢迎提供一个设置页面以供配置(((

## 2. config.json配置

```json
{
	//延时500毫秒后抢包
	"delay": 500,
	//启用随机读秒。若该属性不为underfined，则delay属性无效。
	"randomDelay": underfined,

	"randomDelay": {
		//最小延迟和最大延迟，单位为毫秒。
		"min": 1000,
		"max": 2000
	}

}
```

## 3. TODO

实现与否看心情。

* [✔️ ] 包含关键词不领红包
* [ ] 指定窗口不领取
* [ ] 领取后自动回复
* [ ] 管理员不领取
