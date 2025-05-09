// メッセージハンドラーを一つにまとめる
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 設定取得リクエストの処理
    if (request.type === 'getSettings') {
        chrome.storage.local.get([
            'slackUserToken',
            'slackChannelId',
            'messageClockIn',
            'messageClockOut',
            'messageBreakStart',
            'messageBreakEnd'
        ], function(result) {
            // console.log('[background.js] getSettings取得:', result);
            sendResponse({ 
                slackUserToken: result.slackUserToken || '',
                slackChannelId: result.slackChannelId || '',
                messageClockIn: result.messageClockIn || '',
                messageClockOut: result.messageClockOut || '',
                messageBreakStart: result.messageBreakStart || '',
                messageBreakEnd: result.messageBreakEnd || ''
            });
        });
        return true; // 非同期レスポンスのために必要
    }
    
    // 設定保存リクエストの処理
    if (request.type === 'saveSettings') {
        chrome.storage.local.set({ 
            slackUserToken: request.slackUserToken,
            slackChannelId: request.slackChannelId,
            messageClockIn: request.messageClockIn || '',
            messageClockOut: request.messageClockOut || '',
            messageBreakStart: request.messageBreakStart || '',
            messageBreakEnd: request.messageBreakEnd || ''
        }, function() {
          /* console.log('[background.js] saveSettings保存:', {
                slackUserToken: request.slackUserToken,
                slackChannelId: request.slackChannelId,
                messageClockIn: request.messageClockIn,
                messageClockOut: request.messageClockOut,
                messageBreakStart: request.messageBreakStart,
                messageBreakEnd: request.messageBreakEnd
            }); */
            sendResponse({ success: true });
        });
        return true; // 非同期レスポンスのために必要
    }
    
    // Slackメッセージ送信リクエストの処理
    if (request.type === 'sendSlackMessage') {
        // console.log('background.js: Slackメッセージ送信リクエストを受信しました', request);
        const slackUserToken = request.slackUserToken;
        const slackChannelId = request.slackChannelId;
        const message = request.message;

        if (!slackUserToken || !slackChannelId || !message) {
            console.error('background.js: 必要なパラメータが不足しています');
            sendResponse({ success: false, error: '必要なパラメータが不足しています' });
            return true;
        }

        // Slack API (chat.postMessage) にPOST
        fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${slackUserToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channel: slackChannelId,
                text: message
            })
        })
        .then(async response => {
            const data = await response.json();
            // console.log('background.js: Slack APIレスポンス', data);
            if (response.ok && data.ok) {
                sendResponse({ success: true });
            } else {
                sendResponse({ success: false, error: data.error || 'Slack APIエラー' });
            }
        })
        .catch(error => {
            console.error('background.js: fetchエラー:', error);
            sendResponse({ success: false, error: error.toString() });
        });
        return true; // 非同期レスポンスのために必要
    }
});
