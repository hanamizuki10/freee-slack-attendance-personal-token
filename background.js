// メッセージハンドラーを一つにまとめる
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 設定取得リクエストの処理
    if (request.type === 'getSettings') {
        chrome.storage.local.get([
            'slackWebhookUrl', 
            'messageClockIn', 
            'messageClockOut', 
            'messageBreakStart', 
            'messageBreakEnd'
        ], function(result) {
            sendResponse({ 
                slackWebhookUrl: result.slackWebhookUrl || '',
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
            slackWebhookUrl: request.slackWebhookUrl,
            messageClockIn: request.messageClockIn || '',
            messageClockOut: request.messageClockOut || '',
            messageBreakStart: request.messageBreakStart || '',
            messageBreakEnd: request.messageBreakEnd || ''
        }, function() {
            sendResponse({ success: true });
        });
        return true; // 非同期レスポンスのために必要
    }
    
    // Slackメッセージ送信リクエストの処理
    if (request.type === 'sendSlackMessage') {
        console.log('background.js: Slackメッセージ送信リクエストを受信しました');
        const slackWebhookUrl = request.slackWebhookUrl;
        const message = request.message;
        
        if (!slackWebhookUrl || !message) {
            console.error('background.js: 必要なパラメータが不足しています');
            sendResponse({ success: false, error: '必要なパラメータが不足しています' });
            return true;
        }
        
        console.log(`background.js: Webhook URL: ${slackWebhookUrl.substring(0, 30)}... にメッセージを送信します`);
        console.log(`background.js: 送信メッセージ: ${message}`);
        
        try {
            console.log('background.js: fetchを使用してメッセージを送信します');
            
            // Slack Webhook URLにメッセージを送信
            fetch(slackWebhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: message
                })
            })
            .then(response => {
                console.log(`background.js: レスポンスステータス: ${response.status}`);
                
                if (response.ok) {
                    console.log('background.js: メッセージ送信成功');
                    sendResponse({ success: true });
                } else {
                    return response.text().then(text => {
                        console.error(`background.js: レスポンスエラー - ステータス: ${response.status}, レスポンス: ${text}`);
                        sendResponse({ 
                            success: false, 
                            error: `ステータス: ${response.status}, レスポンス: ${text}` 
                        });
                    });
                }
            })
            .catch(error => {
                console.error(`background.js: fetchエラー: ${error.toString()}`);
                sendResponse({ 
                    success: false, 
                    error: `fetchエラー: ${error.toString()}` 
                });
            });
        } catch (error) {
            console.error(`background.js: 例外が発生しました: ${error.toString()}`);
            sendResponse({ success: false, error: `例外が発生しました: ${error.toString()}` });
        }
        
        return true; // 非同期レスポンスのために必要
    }
});
