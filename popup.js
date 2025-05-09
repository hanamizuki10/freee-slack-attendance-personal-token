


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
            // 不足項目を個別に明示
            let missing = [];
            if (!slackUserToken) missing.push('Slackユーザートークン');
            if (!slackChannelId) missing.push('チャンネルID');
            const message = `${missing.join('と')}が未入力です。`;
            document.getElementById('saveStatus').textContent = message;
            document.getElementById('saveStatus').style.color = '#d32f2f'; // エラー時は赤色
            console.warn('[popup.js] 入力不足:', { slackUserToken, slackChannelId });
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
                const saveStatus = document.getElementById('saveStatus');
                if (response.success) {
                    saveStatus.textContent = '設定を保存しました。freeeの勤怠ページをリロードしてください（再読み込みしないと新しい設定が反映されません）';
                    saveStatus.style.color = '#2196F3'; // 通常時は青色
                } else {
                    let errorMsg = '設定の保存に失敗しました。';
                    if (response && response.error) {
                        errorMsg += ` エラー内容: ${response.error}`;
                    }
                    saveStatus.textContent = errorMsg;
                    saveStatus.style.color = '#d32f2f'; // エラー時は赤色
                    console.error('[popup.js] 設定保存失敗:', response);
                }
            }
        );
    });
});
