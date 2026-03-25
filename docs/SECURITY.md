# セキュリティポリシー

## サポートされているバージョン

現在メンテナンスされているバージョンは以下の通りです:

| バージョン | サポート状況 |
| --------- | ------------ |
| 0.0.x     | :white_check_mark: |

このプロジェクトは開発中のため、セキュリティアップデートは main ブランチで提供されます。

## 脆弱性の報告

セキュリティ上の問題を発見した場合は、**公開 Issue として報告しないでください**。

以下の方法で報告してください:

### GitHub Security Advisory（推奨）

1. [Security Advisories](https://github.com/ymtdir/claude-code-test/security/advisories) ページにアクセス
2. "Report a vulnerability" をクリック
3. 以下の情報を含めて報告:
   - 脆弱性の詳細な説明
   - 再現手順
   - 影響範囲
   - 可能であれば、修正案

### 報告時に含めるべき情報

- **脆弱性の種類**: XSS、SQL Injection、CSRF など
- **影響を受けるコンポーネント**: ファイル名や関数名
- **再現手順**: ステップバイステップの手順
- **影響範囲**: どのような攻撃が可能か
- **環境情報**: ブラウザ、OS、Node.js バージョンなど

### 対応プロセス

1. **報告受領**: 24時間以内に受領確認を返信
2. **調査**: 脆弱性の詳細を調査し、影響範囲を特定
3. **修正**: 修正パッチを作成
4. **通知**: 報告者に修正内容を共有
5. **公開**: 修正後、適切なタイミングで脆弱性情報を公開

## セキュリティベストプラクティス

### 1. 環境変数の管理

#### 機密情報を環境変数で管理

```bash
# .env ファイル（Git にコミットしない）
VITE_API_URL=https://api.example.com
VITE_API_KEY=your-secret-key
```

#### .gitignore に追加

```
# .gitignore
.env
.env.local
.env.*.local
```

#### 環境変数の命名規則

- クライアントサイドで使用する環境変数は `VITE_` で始める必要があります
- シークレット情報（API キー、トークンなど）は絶対にクライアントサイドで使用しない

```typescript
// ❌ Bad: シークレット情報をクライアントサイドで使用
const apiKey = import.meta.env.VITE_SECRET_API_KEY; // 危険！

// ✅ Good: 公開情報のみクライアントサイドで使用
const apiUrl = import.meta.env.VITE_API_URL; // OK
```

### 2. 依存関係のセキュリティ

#### 定期的な脆弱性チェック

```bash
# npm audit で脆弱性をチェック
npm audit

# 自動修正可能な脆弱性を修正
npm audit fix

# 重大な脆弱性のみチェック
npm audit --audit-level=high
```

#### Dependabot による自動更新

このプロジェクトでは Dependabot が有効化されており、以下のように動作します:

- 毎週月曜日に依存関係をチェック
- 脆弱性が見つかった場合は PR を自動作成
- セキュリティアップデートを優先的に通知

#### パッケージのインストール前確認

```bash
# パッケージの評価を確認
npm info <package-name>

# パッケージのライセンスを確認
npm view <package-name> license

# パッケージのダウンロード数を確認
npm view <package-name> dist.tarball
```

### 3. コードセキュリティ

#### XSS（クロスサイトスクリプティング）対策

React はデフォルトで XSS 対策が施されていますが、以下の点に注意してください:

```typescript
// ❌ Bad: dangerouslySetInnerHTML は避ける
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Good: React の自動エスケープを利用
<div>{userInput}</div>

// ❌ Bad: 外部入力をそのまま URL に使用
<a href={userInput}>リンク</a>

// ✅ Good: URL をバリデーション
const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

<a href={isValidUrl(userInput) ? userInput : '#'}>リンク</a>
```

#### インジェクション攻撃対策

```typescript
// ❌ Bad: ユーザー入力をそのままクエリに使用
const query = `SELECT * FROM users WHERE name = '${userName}'`;

// ✅ Good: プリペアドステートメントを使用
// （このプロジェクトではバックエンドがないため例示のみ）
const query = 'SELECT * FROM users WHERE name = ?';
db.execute(query, [userName]);
```

#### 入力バリデーション

```typescript
import { z } from 'zod'; // Zod などのバリデーションライブラリを使用

// ユーザー入力のバリデーション
const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
});

function validateUser(input: unknown) {
  try {
    return userSchema.parse(input);
  } catch (error) {
    throw new Error('Invalid user data');
  }
}
```

### 4. 認証とアクセス制御

#### JWT トークンの管理

```typescript
// ✅ Good: トークンを HttpOnly Cookie に保存（CSRF 対策も実施）
// または、sessionStorage/localStorage に保存し、XSS 対策を徹底

// ❌ Bad: トークンをクライアントサイドの JavaScript で管理
localStorage.setItem('token', jwtToken); // XSS のリスク
```

#### セッションタイムアウト

```typescript
// セッションの有効期限をチェック
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
```

### 5. HTTPS の使用

- 本番環境では必ず HTTPS を使用
- Mixed Content（HTTP と HTTPS の混在）を避ける
- Content Security Policy（CSP）を設定

```html
<!-- index.html で CSP を設定 -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
/>
```

## セキュリティチェックリスト

### 開発時のチェック項目

- [ ] 環境変数に機密情報を含めない（クライアントサイドの場合）
- [ ] ユーザー入力を適切にバリデーション
- [ ] XSS 対策（`dangerouslySetInnerHTML` を避ける）
- [ ] 依存関係の脆弱性をチェック（`npm audit`）
- [ ] `.gitignore` に機密情報ファイルを追加
- [ ] HTTPS を使用（本番環境）

### リリース前のチェック項目

- [ ] すべての依存関係が最新かつ脆弱性がない
- [ ] セキュリティテストが通過
- [ ] 環境変数が適切に設定されている
- [ ] CSP ヘッダーが設定されている
- [ ] CORS 設定が適切
- [ ] エラーメッセージに機密情報が含まれていない

### PR レビュー時のチェック項目

- [ ] 新しい依存関係に脆弱性がない
- [ ] ユーザー入力の処理が安全
- [ ] 認証・認可が適切に実装されている
- [ ] 機密情報がハードコードされていない
- [ ] セキュリティテストが追加されている

## CI/CD セキュリティ

このプロジェクトでは以下のセキュリティチェックが自動実行されます:

### GitHub Actions ワークフロー

- **Security Scan**: 毎週月曜日と PR 時に `npm audit` を実行
- **Dependabot**: 依存関係の自動更新

```yaml
# .github/workflows/security.yml
name: Security Scan
on:
  pull_request:
  schedule:
    - cron: '0 0 * * 1' # 毎週月曜日
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm audit --audit-level=moderate
```

## 参考リソース

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [npm Security Best Practices](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)
- [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories)

## 関連ドキュメント

- [README.md](../README.md) - プロジェクト概要
- [CONTRIBUTING.md](./CONTRIBUTING.md) - コントリビューションガイド
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - トラブルシューティング

## 連絡先

セキュリティに関する質問や懸念がある場合は、GitHub Security Advisory を通じてご連絡ください。
