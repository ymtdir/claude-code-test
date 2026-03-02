---
name: pr-creation
description: 現在のブランチの変更内容を分析し、適切なテンプレートでPull Requestを作成
allowed-tools: Read, Write, Bash, Glob, mcp__github__*
---

# Pull Request Creation スキル

現在のブランチの変更内容を分析し、GitHub Pull Requestを作成するスキルです。

## 使用方法

`/create-pr`コマンドから呼び出され、以下の処理を行います：

1. ブランチと変更内容の分析
2. 関連Issueの特定
3. 適切なテンプレートでPR作成
4. レビュー準備の完了

## PR作成プロセス

### ステップ1: ブランチ情報の収集

```bash
# 現在のブランチ
git branch --show-current

# ベースブランチとの差分
git diff --stat origin/main...HEAD

# コミット履歴
git log origin/main..HEAD --oneline

# 変更ファイル一覧
git diff --name-only origin/main...HEAD
```

### ステップ2: Issue番号の特定

ブランチ名から自動判定:
- `issue-123-fix-bug` → Issue #123
- `feature/user-auth` → コミットメッセージから検索
- その他 → 最近のコミットメッセージから`#\d+`を検索

### ステップ3: 変更内容の分類

コミットメッセージのプレフィックスから判定:
- **fix:** が多い → bug PR
- **feat:** が多い → feature PR
- **refactor:** が多い → refactor PR

### ステップ4: テンプレートの適用

判定された種類に応じてテンプレートを選択:
- **bug** → `templates/bug-fix.md`
- **feature** → `templates/feature.md`
- **refactor** → `templates/refactor.md`

### ステップ5: PR作成

```javascript
mcp__github__create_pull_request({
  "owner": "[owner]",
  "repo": "[repo]",
  "title": "[PRタイトル]",
  "body": "[テンプレートで生成した本文]",
  "head": "[現在のブランチ]",
  "base": "main",
  "draft": false
})
```

### ステップ6: 自動ラベル付与

PR作成成功後、関連Issueとコミットプレフィックスに基づいてラベルを付与：

```bash
# 1. 関連Issueのラベルを確認（最優先）
if [ -n "$ISSUE_NUMBER" ]; then
  ISSUE_LABELS=$(gh issue view $ISSUE_NUMBER --json labels -q '.labels[].name')

  # Issueにenhancement/bug/documentation/refactor/ui/uxラベルがあれば採用
  for label in enhancement bug documentation refactor "ui/ux"; do
    if echo "$ISSUE_LABELS" | grep -q "^$label$"; then
      LABEL="$label"
      echo "ℹ️ Issue #$ISSUE_NUMBER のラベル '$LABEL' を継承します"
      break
    fi
  done
fi

# 2. Issueラベルがない場合、コミットメッセージを解析
if [ -z "$LABEL" ]; then
  git log origin/main..HEAD --oneline > /tmp/commits.txt

  # プレフィックスを解析（重要度優先）
  # feat/fixがあれば優先、なければ他のプレフィックスを考慮
  if grep -q "^[a-z0-9]* feat:" /tmp/commits.txt; then
    PRIMARY_TYPE="feat"
  elif grep -q "^[a-z0-9]* fix:" /tmp/commits.txt; then
    PRIMARY_TYPE="fix"
  elif grep -q "^[a-z0-9]* style:" /tmp/commits.txt; then
    PRIMARY_TYPE="style"
  elif grep -q "^[a-z0-9]* docs:" /tmp/commits.txt; then
    PRIMARY_TYPE="docs"
  elif grep -q "^[a-z0-9]* refactor:" /tmp/commits.txt; then
    PRIMARY_TYPE="refactor"
  else
    # feat/fix/style/docs/refactorがない場合は最多のプレフィックスを使用
    PRIMARY_TYPE=$(cat /tmp/commits.txt | cut -d: -f1 | awk '{print $2}' | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')
  fi

  # ラベルマッピングに基づいてラベルを決定
  case "$PRIMARY_TYPE" in
    "feat")
      LABEL="enhancement"
      echo "ℹ️ コミットプレフィックス 'feat:' から 'enhancement' ラベルを選択"
      ;;
    "fix")
      LABEL="bug"
      echo "ℹ️ コミットプレフィックス 'fix:' から 'bug' ラベルを選択"
      ;;
    "docs")
      LABEL="documentation"
      echo "ℹ️ コミットプレフィックス 'docs:' から 'documentation' ラベルを選択"
      ;;
    "refactor")
      LABEL="refactor"
      echo "ℹ️ コミットプレフィックス 'refactor:' から 'refactor' ラベルを選択"
      ;;
    "style")
      LABEL="ui/ux"
      echo "ℹ️ コミットプレフィックス 'style:' から 'ui/ux' ラベルを選択"
      ;;
    *)
      LABEL=""
      ;;
  esac
fi

# 3. ラベルが存在するか確認
if [ -n "$LABEL" ]; then
  # ラベル一覧を取得
  gh label list --json name -q ".[].name" > /tmp/labels.txt

  # ラベルが存在するか確認
  if grep -q "^${LABEL}$" /tmp/labels.txt; then
    # ラベルをPRに追加（GitHub APIを使用）
    gh api repos/$OWNER/$REPO/issues/$PR_NUMBER/labels -X POST --field "labels[]=$LABEL"
    echo "✅ ラベル '$LABEL' を追加しました"
  else
    # ラベルが存在しない場合、警告を表示
    echo "⚠️ ラベル '$LABEL' が存在しません"
    echo "以下のラベルを事前に作成してください："
    echo "  - enhancement (新機能)"
    echo "  - bug (バグ修正)"
    echo "  - documentation (ドキュメント)"
    echo "  - refactor (リファクタリング)"
    echo "  - ui/ux (UI/UXの改善)"
  fi
else
  echo "ℹ️ プレフィックスからラベルを判定できませんでした"
fi
```

**ラベルマッピング**:
- `feat:` → `enhancement`（新機能）
- `fix:` → `bug`（バグ修正）
- `docs:` → `documentation`（ドキュメント）
- `refactor:` → `refactor`（リファクタリング）
- `style:` → `ui/ux`（UI/UXの改善）

**ラベル判定の優先順位**:
1. **関連Issueのラベルを継承**（最優先）
   - Issue #123に`enhancement`ラベル → PRも`enhancement`
   - Issueラベルがあれば、コミットプレフィックスに関係なく採用

2. **コミットプレフィックスから判定**（Issueラベルがない場合）
   - `feat:` があれば → `enhancement`（新機能）
   - `fix:` があれば → `bug`（バグ修正）
   - `style:` があれば → `ui/ux`（UI/UX改善）
   - `docs:` があれば → `documentation`（ドキュメント）
   - `refactor:` があれば → `refactor`（リファクタリング）
   - 上記の優先順位で最初に見つかったものを採用

**重要な設計判断**:
- Issueとの一貫性を最重視（Issueラベルがあれば継承）
- `chore:`や`test:`が多くても、`feat:`や`fix:`があればそちらを優先
- 作業プロセス（chore）より実装内容（feat/fix）を重視
- ラベルは事前に作成しておく必要がある（自動作成はしない）
- GitHub APIを使用してラベルを付与（`gh pr edit`は権限エラーが発生するため使用しない）

### ステップ7: 自動レビュー実行

PR作成後、即座にレビューを実行：

1. **pr-reviewerサブエージェント**を起動
2. 作成したPRの内容を分析
3. レビューコメントを投稿

## PRタイトルの生成

### パターン1: Issue連携あり
```
fix: [Issue概要] (#123)
feat: [Issue概要] (#456)
refactor: [Issue概要] (#789)
```

### パターン2: Issue連携なし
```
fix: [最初のコミットメッセージから抽出]
feat: [主要な変更内容を要約]
refactor: [リファクタリング対象を明記]
```

## PR本文の構成

### 共通セクション

```markdown
## 概要
[変更内容の要約]

## 関連Issue
Closes #[Issue番号]（あれば）

## 変更内容
[主要な変更点を箇条書き]

## テスト
- [ ] ユニットテスト: [結果]
- [ ] 統合テスト: [結果]
- [ ] 手動テスト: [実施内容]

## スクリーンショット
[UIの変更があれば]

## レビューポイント
[特に確認してほしい箇所]
```

## コミット履歴の整理

PRに含まれるコミットを分析して整理:

```markdown
## コミット履歴
### 機能追加 (feat)
- ログイン機能を追加 (abc123)
- バリデーション処理を実装 (def456)

### バグ修正 (fix)
- セッション保存エラーを修正 (ghi789)

### テスト (test)
- ログインのE2Eテストを追加 (jkl012)
```

## 自動チェック

PR作成前の確認:
1. **未コミットの変更がないか**
   ```bash
   git status --short
   ```

2. **リモートとの同期**
   ```bash
   git fetch origin
   git status -sb
   ```

3. **テストの実行**
   ```bash
   npm test
   npm run lint
   ```

## エラーハンドリング

### ブランチがmainの場合
```
❌ mainブランチから直接PRは作成できません
新しいブランチを作成してください
```

### 変更がない場合
```
⚠️ ベースブランチとの差分がありません
変更をコミットしてから実行してください
```

### コンフリクトがある場合
```
⚠️ マージコンフリクトが検出されました
以下のファイルで競合しています:
- [ファイルリスト]

解決してから再度実行してください
```

## レビュー準備

PR作成後の追加処理:

1. **自動ラベル付与**（ステップ6で実装）
   - コミットプレフィックスから自動判定
   - `feat:` → enhancement（新機能）
   - `fix:` → bug（バグ修正）
   - `docs:` → documentation（ドキュメント）
   - `refactor:` → refactor（リファクタリング）
   - `style:` → ui/ux（UI/UXの改善）
   - ラベルが存在しない場合は警告表示
   - test:とchore:はラベル付与対象外

2. **レビュアーの推奨**
   - 変更ファイルのCODEOWNERSから自動判定
   - 最近のコントリビューターから提案

3. **関連PRの確認**
   - 同じIssueに関連する他のPR
   - 競合する可能性のあるPR