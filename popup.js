// カスタムアラートの表示
function showCustomAlert(message) {
    document.getElementById('customAlertMessage').innerHTML = message;
    document.getElementById('customAlertOverlay').classList.add('active');
}


document.addEventListener('DOMContentLoaded', function() {
    // トグルセクションの動作設定
    const toggleMessages = document.getElementById('toggleMessages');
    const customMessages = document.getElementById('customMessages');
    // console.log('[popup.js] DOMContentLoaded: toggleMessages, customMessages取得', { toggleMessages, customMessages });
    
    toggleMessages.addEventListener('click', function() {
        customMessages.classList.toggle('show');
        toggleMessages.textContent = customMessages.classList.contains('show') ? '▼ カスタムメッセージ設定' : '▶ カスタムメッセージ設定';
        // console.log('[popup.js] カスタムメッセージセクションのトグル:', customMessages.classList.contains('show'));
    });
    
    // 設定の読み込み
    chrome.runtime.sendMessage({ type: 'getSettings' }, function(response) {
        // console.log('[popup.js] 設定取得レスポンス:', response);
        document.getElementById('slackUserToken').value = response.slackUserToken || '';
        document.getElementById('slackChannelId').value = response.slackChannelId || '';
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
        // console.log('[popup.js] 設定項目をフォームに反映完了');
    });

    // 保存ボタンのクリックイベント
    document.getElementById('saveButton').addEventListener('click', function() {
        const slackUserToken = document.getElementById('slackUserToken').value;
        const slackChannelId = document.getElementById('slackChannelId').value;
        if (!slackUserToken || !slackChannelId) {
            showCustomAlert('SlackユーザートークンとチャンネルIDを入力してください');
            console.warn('[popup.js] 入力不足: slackUserToken, slackChannelId', { slackUserToken, slackChannelId });
            return;
        }
        // カスタムメッセージを取得
        const messageClockIn = document.getElementById('messageClockIn').value;
        const messageClockOut = document.getElementById('messageClockOut').value;
        const messageBreakStart = document.getElementById('messageBreakStart').value;
        const messageBreakEnd = document.getElementById('messageBreakEnd').value;

        /* console.log('[popup.js] 保存ボタン押下: 保存内容', {
            slackUserToken, slackChannelId, messageClockIn, messageClockOut, messageBreakStart, messageBreakEnd
        }); */

        chrome.runtime.sendMessage(
            {
                type: 'saveSettings',
                slackUserToken,
                slackChannelId,
                messageClockIn,
                messageClockOut,
                messageBreakStart,
                messageBreakEnd
            },
            function(response) {
                // console.log('[popup.js] saveSettingsレスポンス:', response);
                if (response.success) {
                    showCustomAlert('設定を保存しました。<br>freeeの勤怠ページをリロードしてください（再読み込みしないと新しい設定が反映されません）');
                } else {
                    showCustomAlert('設定の保存に失敗しました');
                    console.error('[popup.js] 設定保存失敗:', response);
                }
            }
        );
    });
});
