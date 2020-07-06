// 浏览器启动就运行
// const state = {
//     loaded: {}
// }

// function sendMessageToContentScript(message, callback)
// {
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
//     {
//         console.log(tabs);
//         chrome.tabs.sendMessage(tabs[0].id, message, function(response)
//         {
//             if(callback) callback(response);
//         });
//     });
// }
// sendMessageToContentScript({cmd:'test', value:'你好，我是bg！'}, function(response) {
//     console.log('来自content的回复：'+response);
// });

// 点击扩展插件图标
// chrome.browserAction.onClicked.addListener(function({id: tab_id}) {
//     if(!state.loaded[tab_id]) {
//         // 生成时间规划模块
//         state.loaded[tab_id] = true;
//     } else {
//         // 移除新生成的时间规划模块
//         state.loaded[tab_id] = false;
//     }
// });


// chrome.browserAction.setBadgeText({text: 'new'});
// chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});

/**
 * 自定义菜单百度搜索
 */
chrome.contextMenus.create({
    title: "使用百度搜索：%s",
    contexts: ["selection"],  // 只有当选中文字才会出现此菜单
    onclick: function(param) {
        let t = encodeURI(param.selectionText);
        chrome.tabs.create({
            url: `https://www.baidu.com/s?ie=utf-8&wd=${t}`
        })
    }
});

setInterval(() => {
    chrome.storage.sync.get(["list"], (r) => {
        (r.list || []).forEach(item => {
            if(item.timeDimension === 4) {
                let timeNow = moment().format("HH:mm");
                if(item.time === timeNow) {
                    chrome.notifications.create(null, {
                        type: 'basic',
                        iconUrl: 'img/icon.png',
                        title: '提示',
                        message: `到了${item.name}的时间了！！`
                    });
                }
            }
        });
    });
}, 10000);