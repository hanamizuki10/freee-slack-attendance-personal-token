# freee勤怠Slack通知ツール

freeeの出勤・退勤・休憩開始・休憩終了ボタンをクリックすると、自動的にSlackに通知を送信するChrome拡張機能です。

## 機能

- freeeの出勤・退勤・休憩開始・休憩終了ボタンのクリックを検知
- 自動的にSlackに通知を送信（出勤、退勤、休憩開始、休憩終了）
- 簡単な設定画面で通知のカスタマイズ

## インストール方法

1. このリポジトリをダウンロードまたはクローンします
   ```
   git clone https://github.com/yourusername/freee-slack-attendance.git
   ```
   または右上の「Code」ボタンから「Download ZIP」を選択し、解凍します

2. Chromeブラウザを開きます

3. 拡張機能の管理ページを開きます
   - アドレスバーに `chrome://extensions` と入力するか
   - Chromeメニュー（右上の三点リーダー）→「その他のツール」→「拡張機能」を選択

4. 右上にある「開発者モード」をオンにします（スイッチが青色になります）

5. 「パッケージ化されていない拡張機能を読み込む」ボタンをクリックします

6. ダウンロードしたプロジェクトのディレクトリを選択します

7. 拡張機能がインストールされると、Chromeの右上に拡張機能のアイコンが表示されます

## SlackのWebhook URLの取得方法

この拡張機能を使用するには、SlackのIncoming Webhook URLが必要です。以下のいずれかの手順で取得してください。

### ① 初めてアプリを作成する場合（1人目）

1. [Slack API ウェブサイト](https://api.slack.com/apps)にアクセスします
2. 「Create New App」ボタンをクリックします
   - 「From scratch」を選択
   - アプリ名（例：「freee勤怠通知」）を入力
   - Short description（例）：「freeeの勤怠打刻をSlackに自動通知する拡張機能です」
   - 使用するSlackワークスペースを選択し、「Create App」をクリック
3. 左側のメニューから「Incoming Webhooks」を選択します
4. 「Activate Incoming Webhooks」をオンにします
5. 左側のメニューから「Bot Users」（または「App Home」）をクリックし、「Add Bot User」ボタンをクリックします
   - Display name（表示名）: 「freee勤怠通知」などを入力
   - Default username（デフォルトユーザー名）: 「freee_attendance_bot」などを入力
   - 必要に応じて「Always Show My Bot as Online」にチェックを入れる
6. 左側のメニューから「Incoming Webhooks」に戻ります
7. ページ下部の「Add New Webhook to Workspace」ボタンをクリックします
8. 通知を送信するチャンネルを選択し、「許可する」をクリックします
9. 「Webhook URL」が生成されるので、このURLをコピーします
   - 例：`https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

### ② すでにアプリが作成されている場合（2人目以降）

1. [Slack API ウェブサイト](https://api.slack.com/apps)にアクセスします
2. 既存の「freee勤怠通知」アプリを選択します
3. 左側のメニューから「Incoming Webhooks」を選択します
4. ページ下部の「Add New Webhook to Workspace」ボタンをクリックします
5. 通知を送りたいチャンネルを選択し、「許可する」をクリックします
6. 新しい「Webhook URL」が生成されるので、このURLをコピーします

## 拡張機能の設定方法

1. Chromeの右上にある拡張機能アイコンをクリックします

2. 「freee Slack Attendance」の拡張機能アイコンをクリックして設定画面を開きます

3. 「Slack Webhook URL」の欄に、先ほどコピーしたWebhook URLを貼り付けます

4. 「保存」ボタンをクリックします
   - 「設定を保存しました」というメッセージが表示されれば設定完了です

## 使用方法

1. freeeの勤怠管理ページ（https://*.freee.co.jp/*）にアクセスします

2. 通常通り出勤・退勤・休憩開始・休憩終了ボタンをクリックします

3. ボタンをクリックすると自動的にSlackの設定したチャンネルに通知が送信されます
   - 出勤ボタン → 「勤務開始します」
   - 退勤ボタン → 「退勤します」
   - 休憩開始ボタン → 「休憩します」
   - 休憩終了ボタン → 「再開します」

## トラブルシューティング

- **通知が送信されない場合**
  - Webhook URLが正しく設定されているか確認してください
  - ブラウザのコンソールでエラーメッセージを確認してください（F12キーを押してDeveloper Toolsを開き、「Console」タブを選択）
  - インターネット接続が正常か確認してください

- **拡張機能が動作しない場合**
  - 拡張機能が有効になっているか確認してください
  - freeeのURLが正しいか確認してください（https://*.freee.co.jp/*）
  - ページを再読み込みしてみてください

## 注意事項

- この拡張機能はfreeeのページ（https://*.freee.co.jp/*）でのみ動作します
- SlackのWebhook URLは事前に設定する必要があります
- 通知の送信にはインターネット接続が必要です
- Webhook URLは他人に教えないでください（第三者がメッセージを送信できる可能性があります）

## ライセンス

MIT License
