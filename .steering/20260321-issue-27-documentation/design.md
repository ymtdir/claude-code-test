# 設計書

## アーキテクチャ概要

現在のプロジェクト（React + Vite）に適したドキュメント構成を設計します。

```
docs/
├── product-requirements.md     # 既存（更新）
├── functional-design.md        # 既存（更新）
├── architecture.md             # 既存（更新）
├── repository-structure.md     # 既存
├── development-guidelines.md   # 既存
├── glossary.md                # 既存
├── TROUBLESHOOTING.md         # 新規作成
├── CONTRIBUTING.md            # 新規作成
├── SECURITY.md                # 新規作成
└── api/                       # 新規（TypeDoc生成）
    └── (自動生成ファイル)
```

## ドキュメント設計

### 1. TROUBLESHOOTING.md - トラブルシューティングガイド

**責務**:
- 開発中に遭遇しやすい問題の解決方法を提供
- 具体的なコマンド例と手順を示す

**実装の要点**:
- セクション分け: ビルドエラー、開発サーバー、テスト、環境変数、その他
- 各問題に対して「症状」「原因」「解決方法」の3セットで記述
- コマンドは実行可能な形で記載

**構成案**:
```markdown
## ビルドエラー

### Vite: Cannot find module エラー
**症状**: モジュールが見つからないエラーが表示される
**原因**: 依存関係のインストール漏れまたはキャッシュの問題
**解決方法**:
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 開発サーバー

### ポート3000が既に使用されている
**症状**: `Error: listen EADDRINUSE: address already in use :::3000`
**原因**: 既に別のプロセスがポート3000を使用している
**解決方法**:
\`\`\`bash
lsof -ti:3000 | xargs kill -9
npm run dev
\`\`\`
```

### 2. CONTRIBUTING.md - コントリビューションガイド

**責務**:
- 開発者がプロジェクトに貢献するための手順を明示
- コーディング規約とワークフローを統一

**実装の要点**:
- 既存のdevelopment-guidelines.mdとの棲み分け
  - development-guidelines.md: 技術的な詳細ガイドライン
  - CONTRIBUTING.md: 実践的な貢献手順とワークフロー
- ステップバイステップのガイド
- 具体的なコマンド例

**構成案**:
```markdown
## はじめに
このプロジェクトへのコントリビューションに興味を持っていただきありがとうございます。

## 開発環境のセットアップ
1. リポジトリをフォーク
2. クローン: `git clone ...`
3. 依存関係インストール: `npm install`
4. 開発サーバー起動: `npm run dev`

## コーディング規約
詳細は[development-guidelines.md](./development-guidelines.md)を参照。

### TypeScript
- strict modeを有効化
- `any`の使用は原則禁止

### React
- 関数コンポーネントを使用
- Custom Hooksでロジック分離

## Gitワークフロー
1. featureブランチ作成: `git checkout -b feature/my-feature`
2. 変更をコミット: 従来のコミット規約に従う
3. PRを作成
4. レビューを受ける
5. マージ

## PR作成ガイドライン
- 明確なタイトルと説明
- 関連Issueの参照
- スクリーンショット（UI変更時）
```

### 3. SECURITY.md - セキュリティガイドライン

**責務**:
- セキュリティベストプラクティスの明示
- 脆弱性報告の手順

**実装の要点**:
- GitHub標準のSECURITY.mdフォーマットに準拠
- 具体的な実践例を含む

**構成案**:
```markdown
## セキュリティポリシー

### サポートされているバージョン
現在メンテナンスされているバージョン

### 脆弱性の報告
セキュリティ上の問題を発見した場合は、公開Issueではなく以下の方法で報告してください：
- GitHubのSecurity Advisoryを使用
- または [メールアドレス] に連絡

### セキュリティベストプラクティス
1. 環境変数の管理
   - `.env`ファイルは`.gitignore`に追加
   - シークレット情報はGitHub Secretsを使用

2. 依存関係のセキュリティ
   - 定期的な`npm audit`実行
   - Dependabotによる自動更新

3. コードセキュリティ
   - XSS対策: ユーザー入力のサニタイゼーション
   - CSRF対策: トークン検証
```

### 4. TypeDoc設定

**責務**:
- TypeScriptコードからAPIドキュメントを自動生成
- 最新のコード変更を反映

**実装の要点**:
- `typedoc.json`設定ファイル作成
- `package.json`にスクリプト追加
- 生成されたドキュメントを`.gitignore`に追加

**設定内容**:
```json
{
  "entryPoints": ["src/index.tsx"],
  "out": "docs/api",
  "exclude": ["**/__tests__/**/*", "**/*.test.*"],
  "excludePrivate": true,
  "excludeInternal": true,
  "readme": "README.md",
  "plugin": ["typedoc-plugin-markdown"]
}
```

**package.jsonスクリプト**:
```json
{
  "scripts": {
    "docs:generate": "typedoc",
    "docs:serve": "serve docs/api",
    "docs:clean": "rm -rf docs/api"
  }
}
```

## データフロー

### ドキュメント生成フロー
```
1. 開発者がコードを変更
2. TypeDocが自動的にAPIドキュメント生成
3. 生成されたドキュメントはGitに含めない（.gitignore）
4. GitHub Pagesなどで公開（オプション）
```

## エラーハンドリング戦略

### TypeDoc生成エラー
- TypeScript型エラーがある場合は生成失敗
- CIでドキュメント生成をチェック（オプション）

## テスト戦略

### ドキュメントのリンクチェック
```bash
# markdown-link-checkを使用
npm install --save-dev markdown-link-check
npx markdown-link-check docs/**/*.md
```

## 依存ライブラリ

新規追加:
```json
{
  "devDependencies": {
    "typedoc": "^0.25.0",
    "typedoc-plugin-markdown": "^3.17.0",
    "markdown-link-check": "^3.12.0"
  }
}
```

## ディレクトリ構造

```
docs/
├── TROUBLESHOOTING.md         # 新規
├── CONTRIBUTING.md            # 新規
├── SECURITY.md                # 新規
├── product-requirements.md    # 更新（React Native → React + Vite）
├── architecture.md            # 更新（React Native → React + Vite）
├── api/                       # 新規（TypeDoc生成）
│   ├── index.html
│   └── (自動生成ファイル)
└── (既存ファイル)

.gitignore に追加:
- docs/api/
```

## 実装の順序

1. TypeDocの設定とテスト
2. TROUBLESHOOTING.mdの作成
3. CONTRIBUTING.mdの作成
4. SECURITY.mdの作成
5. 既存ドキュメントの更新検討（必要に応じて）
6. README.mdにリンク追加

## セキュリティ考慮事項

- SECURITY.mdに脆弱性報告の手順を明記
- .gitignoreに機密情報を確実に追加
- TypeDoc生成時に内部実装の露出を防ぐ（excludePrivate: true）

## パフォーマンス考慮事項

- TypeDoc生成はdevDependenciesに含め、本番ビルドには影響させない
- 生成されたドキュメントはGitに含めず、リポジトリサイズを抑える

## 将来の拡張性

- Storybookによるコンポーネントドキュメント
- E2Eテストのシナリオドキュメント化
- パフォーマンス測定結果の記録
- アクセシビリティガイドライン
