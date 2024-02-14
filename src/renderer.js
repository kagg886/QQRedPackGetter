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

    function log(...data) {
        console.log('[自动抢红包]:', data)
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


                    const delay = redPackConfig.randomDelay !== undefined
                        ? (Math.random() * (redPackConfig.randomDelay.max - redPackConfig.randomDelay.min) + redPackConfig.randomDelay.min)
                        : redPackConfig.delay


                    setTimeout(() => {
                        click('.lucky-money__bg', target)
                        setTimeout(() => {
                            click('.q-popup .close-icon')
                        }, 500)
                    }, delay);
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

try {
    redPackDOMInjected()
} catch (e) {
    console.error('初始化失败!', e)
}