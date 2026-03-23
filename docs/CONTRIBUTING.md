# コントリビューションガイド

このプロジェクトへのコントリビューションに興味を持っていただきありがとうございます！

このガイドでは、プロジェクトへの貢献方法、開発ワークフロー、コーディング規約について説明します。

## 目次

- [はじめに](#はじめに)
- [開発環境のセットアップ](#開発環境のセットアップ)
- [コーディング規約](#コーディング規約)
- [Gitワークフロー](#gitワークフロー)
- [PR作成ガイドライン](#pr作成ガイドライン)
- [テスト要件](#テスト要件)
- [コードレビュー](#コードレビュー)

## はじめに

このプロジェクトは、Claude Code を使用したスペック駆動開発のテストおよび検証用リポジトリです。

### 貢献できる内容

- バグ修正
- 新機能の追加
- ドキュメントの改善
- テストの追加・改善
- パフォーマンスの最適化

## 開発環境のセットアップ

### 前提条件

以下のツールがインストールされていることを確認してください:

- **Node.js**: v25.2.1 以上（推奨: v25.2.1）
- **npm**: v10.x 以上
- **Git**: v2.x 以上

### セットアップ手順

1. **リポジトリをフォーク**

   GitHub 上で本リポジトリをフォークしてください。

2. **クローン**

   ```bash
   git clone https://github.com/YOUR_USERNAME/claude-code-test.git
   cd claude-code-test
   ```

3. **依存関係のインストール**

   ```bash
   npm install
   ```

4. **開発サーバーの起動**

   ```bash
   npm run dev
   ```

   ブラウザで `http://localhost:5173` を開いて動作確認してください。

5. **テストの実行**

   ```bash
   # すべてのテストを実行
   npm test

   # カバレッジ付きでテストを実行
   npm run test:run -- --coverage
   ```

## コーディング規約

詳細なコーディング規約は [development-guidelines.md](./development-guidelines.md) を参照してください。

### TypeScript

- **Strict モードを有効化**: `any` の使用は原則禁止
- **型定義を明示**: 関数の引数と戻り値には必ず型を指定
- **インターフェースを活用**: オブジェクトの型定義には `interface` を使用

```typescript
// ❌ Bad
function processData(data: any): any {
  return data.value;
}

// ✅ Good
interface DataInput {
  value: string;
  timestamp: Date;
}

interface DataOutput {
  processedValue: string;
}

function processData(data: DataInput): DataOutput {
  return {
    processedValue: data.value.toUpperCase(),
  };
}
```

### React

- **関数コンポーネントを使用**: クラスコンポーネントは使用しない
- **Props の型定義**: すべてのコンポーネントで Props の型を定義
- **Custom Hooks でロジック分離**: ビジネスロジックは Custom Hooks に切り出す

```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={() => onEdit(user.id)}>編集</button>
    </div>
  );
};
```

### 命名規則

- **変数・関数**: camelCase (`userName`, `getUserData`)
- **コンポーネント**: PascalCase (`UserCard`, `TodoList`)
- **定数**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`, `API_BASE_URL`)
- **型・インターフェース**: PascalCase (`User`, `TodoItem`)
- **ファイル名**:
  - コンポーネント: PascalCase (`UserCard.tsx`)
  - ユーティリティ: camelCase (`dateUtils.ts`)
  - テスト: `*.test.ts` または `*.test.tsx`

### コードフォーマット

- **Prettier**: すべてのコードは Prettier でフォーマット
- **ESLint**: ESLint のルールに従う

```bash
# 自動フォーマット
npm run format

# フォーマットチェック
npm run format:check

# Lint チェック
npm run lint
```

## Gitワークフロー

### ブランチ戦略

- **main**: 本番環境のコード（保護ブランチ）
- **feature/\***: 新機能の開発（例: `feature/add-user-profile`）
- **bugfix/\***: バグ修正（例: `bugfix/fix-login-error`）
- **docs/\***: ドキュメント更新（例: `docs/update-readme`）

### ブランチ作成

```bash
# main ブランチから最新を取得
git checkout main
git pull origin main

# 新しいブランチを作成
git checkout -b feature/my-feature
```

### コミットメッセージ規約

Conventional Commits 仕様に従います:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type（必須）**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: フォーマット、セミコロンの追加など
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

**例**:

```bash
# 新機能追加
git commit -m "feat: ユーザープロフィール編集機能を追加"

# バグ修正
git commit -m "fix: ログイン時の認証エラーを修正"

# ドキュメント更新
git commit -m "docs: README にセットアップ手順を追加"
```

### プッシュ

```bash
# リモートブランチにプッシュ
git push origin feature/my-feature
```

## PR作成ガイドライン

### PR作成前のチェックリスト

- [ ] すべてのテストが通る（`npm run test:run`）
- [ ] Lint エラーがない（`npm run lint`）
- [ ] 型チェックが通る（`npm run typecheck`）
- [ ] ビルドが成功する（`npm run build`）
- [ ] コードがフォーマットされている（`npm run format`）

### PR作成手順

1. **GitHub でブランチをプッシュ**

   ```bash
   git push origin feature/my-feature
   ```

2. **Pull Request を作成**

   - GitHub の Pull Request ページで "New Pull Request" をクリック
   - ベースブランチ: `main`
   - 比較ブランチ: `feature/my-feature`

3. **PRテンプレートに記入**

   以下の情報を含めてください:

   - **変更内容の概要**: 何を変更したか
   - **変更理由**: なぜこの変更が必要か
   - **テスト方法**: どのようにテストしたか
   - **関連 Issue**: 関連する Issue があれば番号を記載（例: `Closes #123`）
   - **スクリーンショット**: UI の変更がある場合

### PRの例

```markdown
## 変更内容

ユーザープロフィール編集機能を追加しました。

## 変更理由

Issue #123 で報告されていた、ユーザー情報を編集できない問題を解決するため。

## テスト方法

1. ユーザープロフィールページにアクセス
2. 「編集」ボタンをクリック
3. 名前とメールアドレスを変更
4. 「保存」ボタンをクリック
5. 変更が反映されることを確認

## 関連 Issue

Closes #123

## スクリーンショット

![プロフィール編集画面](screenshot.png)
```

## テスト要件

### ユニットテストの追加

- **すべての新機能にテストを追加**: 新しい関数やコンポーネントには必ずテストを書く
- **バグ修正にはテストを追加**: 同じバグが再発しないようにテストを追加
- **カバレッジを維持**: テストカバレッジは 80% 以上を目標

### テストの書き方

```typescript
// src/utils/dateUtils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from './dateUtils';

describe('formatDate', () => {
  it('日付を YYYY-MM-DD 形式でフォーマットする', () => {
    const date = new Date('2026-03-21');
    expect(formatDate(date)).toBe('2026-03-21');
  });

  it('無効な日付の場合はエラーをスローする', () => {
    expect(() => formatDate(new Date('invalid'))).toThrow();
  });
});
```

### テストの実行

```bash
# すべてのテストを実行
npm test

# カバレッジ付きで実行
npm run test:run -- --coverage

# 特定のファイルのみ実行
npm test -- dateUtils.test.ts
```

## コードレビュー

### レビューのポイント

レビュー時には以下の点を確認します:

- **機能要件**: 機能が要件を満たしているか
- **コード品質**: コーディング規約に従っているか
- **テスト**: テストが十分に書かれているか
- **パフォーマンス**: パフォーマンスの問題がないか
- **セキュリティ**: セキュリティ上の問題がないか

### レビューコメントへの対応

1. コメントを確認し、必要な修正を行う
2. 修正をコミットしてプッシュ
3. コメントに返信して修正完了を報告

```bash
# 修正をコミット
git add .
git commit -m "fix: レビュー指摘事項を修正"
git push origin feature/my-feature
```

## その他のガイドライン

### Issue の作成

バグ報告や機能提案は GitHub Issues で行います:

1. 既存の Issue を検索して重複がないか確認
2. 適切なテンプレートを選択
3. 詳細な情報を記載（再現手順、期待される動作、実際の動作など）

### ドキュメントの更新

- 新機能を追加した場合は、関連ドキュメントも更新してください
- README.md、API ドキュメント、チュートリアルなどを最新の状態に保ちます

### コミュニケーション

- 質問や議論は GitHub Discussions または Issue で行います
- コードレビューでは建設的なフィードバックを心がけます

## 関連ドキュメント

- [README.md](../README.md) - プロジェクト概要
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - トラブルシューティング
- [SECURITY.md](./SECURITY.md) - セキュリティガイドライン
- [development-guidelines.md](./development-guidelines.md) - 詳細な開発ガイドライン
- [architecture.md](./architecture.md) - アーキテクチャ設計

## サポート

ご不明な点がある場合は、お気軽に Issue を作成してください。

コントリビューションをお待ちしています！
