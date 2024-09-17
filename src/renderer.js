function log(...data) {
    console.log('[自动抢红包]:', data)
}

function redPackDOMInjected() {
    if (window.redPackObserver !== undefined) {
        log('已注入抢红包代码，本次初始化已跳过')
        return
    }

    window.uninstallRedPackPlugin = () => {
        window.redPackObserver.disconnect()
        window.redPackObserver = undefined
        log('已卸载抢红包插件')
    }


    function click(select, doc = document) {
        let event = new Event('click', { "bubbles": true, "cancelable": true });
        let div = doc.querySelector(select)
        if (div !== null) {
            div.dispatchEvent(event)
        }
    }

    window.redPackObserver = new MutationObserver(function (mutations) {
        try {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    let target = mutation.addedNodes[0]
                    if (target === undefined) {
                        return
                    }
                    // log('新消息被监听', mutation.addedNodes[0].querySelector('.lucky-money__content'))
                    if (target.querySelector('.lucky-money__mask') !== null) {
                        // log('已跳过抢红包!', target)
                        return
                    }
                    
                    var delay
                    log('randomDelayAble:',redPackConfig.randomDelayAble)
                    redPackConfig.randomDelayAble !== 0
                    ? delay = (Math.random() * (redPackConfig.randomDelay.max - redPackConfig.randomDelay.min) + redPackConfig.randomDelay.min)
                    : delay = redPackConfig.delay

                    const keywords = redPackConfig.keywords;


                    let text = target.querySelector('.lucky-money__content').textContent;
                    if (!keywords.some(keyword => text.includes(keyword))) {
                        setTimeout(() => {
                            click('.lucky-money__bg', target)
                            setTimeout(() => {
                                click('.q-popup .close-icon')
                            }, 500)
                        }, delay);
                    }
                }
            });
        } catch (e) {
            console.error(e)
        }
    });

    let id = setInterval(() => {
        let widget = document.querySelector('.ml-list')
        if (widget !== null) {
            redPackObserver.observe(widget, { childList: true });
            clearInterval(id)
            log('注入抢红包代码成功!')
            log('渲染进程接收配置:', window.redPackConfig)
        }
    }, 100)
}

function redPackfindObserver() {
    function click_message(div) {
        let rightClickEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0
        });
        div.dispatchEvent(rightClickEvent);
    }
    //log("get_list");
    var elements = document.querySelectorAll('.list-item.across-mode.recent-contact-item');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        // 对每个元素执行操作
        var text = element.textContent;
        if (text != null) {
            // if (text.includes("[红包]") && text.includes("[QQ红包]" && !text.includes("新版手机QQ查看")){
            // 可能在windows上是qq红包，在linux上是红包
            if ((text.includes("[QQ红包]") || text.includes("[红包]")) && !text.includes("新版手机QQ查看")) {
                try {
                    click_message(element)
                } catch (e) {
                    console.error(e)
                }
            }
        }
    }
    setTimeout(() => {
        redPackfindObserver()
    }, 300);
}
function initRedPackPlugins() {
    try {
        // 将两个观察者都定义为并行执行
        redPackDOMInjected();
        log('注入抢红包代码成功!');
        redPackfindObserver();
        log('注入find红包代码成功!');

    } catch (e) {
        console.error('初始化失败!', e);
    }
}
// 立即调用以同时启动两个观察者
initRedPackPlugins();
