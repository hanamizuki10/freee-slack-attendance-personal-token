# コントリビューションガイドライン

## コミットメッセージのルール

- すべてのコミットには、必ず修正内容を簡潔に説明するコミットメッセージを記載してください。
- 例:  
  - `バグ修正: ログイン時のエラーを修正`
  - `機能追加: 勤怠データのエクスポート機能を追加`
- 意味のないメッセージ（例: `fix`, `update` だけ）は禁止です。

## その他のルール

- プルリクエスト時にも、変更内容の要約を記載してください。

## Cascade（AIアシスタント）利用時のルール

- CascadeのWriteモードでコード修正を行った場合、AIが提案するコミットメッセージを確認し、内容に問題がなければそのまま利用してください。
- AIが提案したコミットメッセージが不十分な場合は、プロジェクトのコミットメッセージルールに従い、適切な内容に修正してください。
- すべてのコミットには、修正内容を簡潔に説明するメッセージが必要です（上記「コミットメッセージのルール」参照）。
- 【追加ルール】質問してファイルに修正を加えた場合は、必ずコミットメッセージもセットでレスポンスとして返すこと。AIアシスタントは、コード修正時に毎回コミットメッセージ案を提示します。
