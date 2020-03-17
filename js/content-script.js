document.addEventListener('DOMContentLoaded', function() {
    console.log('我被执行了！');
});

// 和bg通信
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    if(request.cmd == 'test') alert(request.value);
    sendResponse('我收到了你的消息！');
});