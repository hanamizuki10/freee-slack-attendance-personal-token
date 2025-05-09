// Slackユーザートークン・チャンネルIDの初期値
let SLACK_USER_TOKEN = '';
let SLACK_CHANNEL_ID = '';

// カスタムメッセージの初期値
let CUSTOM_MESSAGES = {
    clockIn: '',
    clockOut: '',
    breakStart: '',
    breakEnd: ''
};

// chrome.storage.localから設定を取得
chrome.storage.local.get([
    'slackUserToken',
    'slackChannelId',
    'messageClockIn',
    'messageClockOut',
    'messageBreakStart',
    'messageBreakEnd'
], function(result) {
    SLACK_USER_TOKEN = result.slackUserToken || '';
    SLACK_CHANNEL_ID = result.slackChannelId || '';
    CUSTOM_MESSAGES.clockIn = result.messageClockIn || '';
    CUSTOM_MESSAGES.clockOut = result.messageClockOut || '';
    CUSTOM_MESSAGES.breakStart = result.messageBreakStart || '';
    CUSTOM_MESSAGES.breakEnd = result.messageBreakEnd || '';
});

// 設定変更を監視
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local') {
        if (changes.slackUserToken) {
            SLACK_USER_TOKEN = changes.slackUserToken.newValue || '';
        }
        if (changes.slackChannelId) {
            SLACK_CHANNEL_ID = changes.slackChannelId.newValue || '';
        }
        if (changes.messageClockIn) {
            CUSTOM_MESSAGES.clockIn = changes.messageClockIn.newValue || '';
        }
        if (changes.messageClockOut) {
            CUSTOM_MESSAGES.clockOut = changes.messageClockOut.newValue || '';
        }
        if (changes.messageBreakStart) {
            CUSTOM_MESSAGES.breakStart = changes.messageBreakStart.newValue || '';
        }
        if (changes.messageBreakEnd) {
            CUSTOM_MESSAGES.breakEnd = changes.messageBreakEnd.newValue || '';
        }
    }
});

// ボタンのクリックイベントをフック
function hookButtons() {
    // console.log('hookButtons関数が実行されました');
    
    // 対象とするボタンテキストを配列で定義
    const targetButtonTexts = ['出勤', '退勤', '休憩開始', '休憩終了'];
    
    // すべてのvb-buttonを取得
    const buttons = document.querySelectorAll('.vb-button');
    // console.log(`検出されたボタン数: ${buttons.length}`);
    
    // 対象ボタンの数をカウントする変数
    let targetButtonCount = 0;
    
    buttons.forEach(button => {
        const buttonText = button.querySelector('.vb-button__text')?.textContent?.trim();
        
        if (!buttonText) return;
        
        // 対象ボタンかチェック
        if (!targetButtonTexts.includes(buttonText)) {
            return; // 対象外のボタンはスキップ
        }
        
        // 既にイベントリスナーが設定されているかチェック
        if (button.hasAttribute('data-event-attached')) {
            targetButtonCount++; // 対象ボタンとしてカウント
            return; // 既にイベントリスナーが設定されている場合はスキップ
        }
        
        // ボタンにデータ属性を設定してイベントリスナーが設定済みであることをマーク
        button.setAttribute('data-event-attached', 'true');
        targetButtonCount++; // 対象ボタンとしてカウント
        
        // console.log(`ボタンにイベントリスナーを設定: ${buttonText}`);
        
        // クリックイベントリスナーを設定 - キャプチャフェーズで処理
        button.addEventListener('click', function(event) {
            // NOTE:イベントの伝播を停止しない（元のボタンアクションも実行されるようにする）
            
            // console.log(`ボタンがクリックされました: ${buttonText}`);
            
            // ボタンのテキストに基づいてメッセージを送信
            // 非同期で処理して元のボタンアクションをブロックしない
            setTimeout(() => {
                switch(buttonText) {
                    case '出勤':
                        sendSlackMessage(CUSTOM_MESSAGES.clockIn || '勤務開始します');
                        break;
                    case '退勤':
                        sendSlackMessage(CUSTOM_MESSAGES.clockOut || '退勤します');
                        break;
                    case '休憩開始':
                        sendSlackMessage(CUSTOM_MESSAGES.breakStart || '休憩します');
                        break;
                    case '休憩終了':
                        sendSlackMessage(CUSTOM_MESSAGES.breakEnd || '再開します');
                        break;
                }
            }, 0);
        });
    });
    
    // console.log(`対象ボタン数: ${targetButtonCount}`);
    
    // すべての対象ボタンが見つかった場合はオブザーバーを停止
    if (targetButtonCount >= targetButtonTexts.length && window.buttonObserver) {
        // console.log('すべての対象ボタンが見つかったため、オブザーバーを停止します');
        window.buttonObserver.disconnect();
        window.buttonObserver = null;
    }
}

// Slackにメッセージを送信（background.js経由でCORS回避）
async function sendSlackMessage(message) {
    if (!SLACK_USER_TOKEN || !SLACK_CHANNEL_ID) {
        alert('SlackユーザートークンまたはチャンネルIDが設定されていません。設定画面で入力してください。');
        return;
    }
    try {
        chrome.runtime.sendMessage({
            type: 'sendSlackMessage',
            slackUserToken: SLACK_USER_TOKEN,
            slackChannelId: SLACK_CHANNEL_ID,
            message: message
        }, function(response) {
            if (response && response.success) {
                // 成功時は特に何もしない（必要ならここで通知）
            } else {
                let errorMsg = (response && response.error) ? response.error : 'Slack APIエラー';
                alert(`Slackメッセージ送信失敗: ${errorMsg}`);
                console.error('Slackメッセージ送信失敗:', errorMsg, response);
            }
        });
    } catch (error) {
        alert(`Slackメッセージ送信中にエラー: ${error.message}`);
        console.error('Slackメッセージ送信中にエラー:', error);
    }
}

// ページが読み込まれたときにボタンをフック
window.addEventListener('load', function() {
    // console.log('ページ読み込み完了、ボタンフックを開始します');
    hookButtons();
    
    // ページのDOMが変更されたときにボタンを再フック
    window.buttonObserver = new MutationObserver(function(mutations) {
        // DOM変更があった場合のみボタンをフック
        const hasRelevantChanges = mutations.some(mutation => {
            // 追加されたノードにボタンが含まれているかチェック
            return Array.from(mutation.addedNodes).some(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    return node.classList?.contains('vb-button') || 
                           node.querySelector?.('.vb-button');
                }
                return false;
            });
        });
        
        if (hasRelevantChanges) {
            // console.log('DOM変更を検出、ボタンフックを再実行します');
            hookButtons();
        }
    });
    
    window.buttonObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});
