document.addEventListener('DOMContentLoaded', function() {
    // トグルセクションの動作設定
    const toggleMessages = document.getElementById('toggleMessages');
    const customMessages = document.getElementById('customMessages');
    
    toggleMessages.addEventListener('click', function() {
        customMessages.classList.toggle('show');
        toggleMessages.textContent = customMessages.classList.contains('show') ? '▼ カスタムメッセージ設定' : '▶ カスタムメッセージ設定';
    });
    
    // 設定の読み込み
    chrome.runtime.sendMessage({ type: 'getSettings' }, function(response) {
        document.getElementById('slackWebhookUrl').value = response.slackWebhookUrl || '';
        
        // カスタムメッセージの設定を読み込む
        if (response.messageClockIn) {
            document.getElementById('messageClockIn').value = response.messageClockIn;
        }
        if (response.messageClockOut) {
            document.getElementById('messageClockOut').value = response.messageClockOut;
        }
        if (response.messageBreakStart) {
            document.getElementById('messageBreakStart').value = response.messageBreakStart;
        }
        if (response.messageBreakEnd) {
            document.getElementById('messageBreakEnd').value = response.messageBreakEnd;
        }
    });

    // 保存ボタンのクリックイベント
    document.getElementById('saveButton').addEventListener('click', function() {
        const slackWebhookUrl = document.getElementById('slackWebhookUrl').value;
        
        if (!slackWebhookUrl) {
            alert('Slack Webhook URLを入力してください');
            return;
        }
        
        // カスタムメッセージを取得
        const messageClockIn = document.getElementById('messageClockIn').value;
        const messageClockOut = document.getElementById('messageClockOut').value;
        const messageBreakStart = document.getElementById('messageBreakStart').value;
        const messageBreakEnd = document.getElementById('messageBreakEnd').value;

        chrome.runtime.sendMessage(
            { 
                type: 'saveSettings', 
                slackWebhookUrl,
                messageClockIn,
                messageClockOut,
                messageBreakStart,
                messageBreakEnd
            },
            function(response) {
                if (response.success) {
                    alert('設定を保存しました');
                }
            }
        );
    });
});
