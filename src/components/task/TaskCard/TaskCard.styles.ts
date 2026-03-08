import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme';

export const styles = StyleSheet.create({
  // コンテナスタイル
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    marginVertical: Theme.spacing.sm,
    marginHorizontal: Theme.spacing.lg,
    ...Theme.shadow.sm,
  },

  // 完了状態のコンテナ
  completedContainer: {
    opacity: 0.7,
    backgroundColor: Theme.colors.background,
  },

  // コンテンツ
  content: {
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 優先度インジケーター
  priorityIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: Theme.borderRadius.lg,
    borderBottomLeftRadius: Theme.borderRadius.lg,
  },

  // メインコンテンツ
  mainContent: {
    flex: 1,
    paddingLeft: Theme.spacing.sm,
  },

  // カテゴリーコンテナ
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.xs,
  },

  // カテゴリーバッジ
  categoryBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xxs,
    borderRadius: Theme.borderRadius.sm,
  },

  // カテゴリーテキスト
  categoryText: {
    ...Theme.typography.overline,
    color: Theme.colors.textInverse,
  },

  // タイトル
  title: {
    ...Theme.typography.body,
    color: Theme.colors.textPrimary,
    fontWeight: Theme.fontWeight.medium,
    marginBottom: Theme.spacing.xs,
  },

  // 完了状態のタイトル
  completedTitle: {
    textDecorationLine: 'line-through',
    color: Theme.colors.textSecondary,
  },

  // 説明
  description: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },

  // 完了状態の説明
  completedDescription: {
    textDecorationLine: 'line-through',
  },

  // 期限コンテナ
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.xs,
  },

  // 期限テキスト
  dueDate: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.xs,
  },

  // 期限超過
  overdue: {
    color: Theme.colors.error,
    fontWeight: Theme.fontWeight.medium,
  },

  // チェックアイコン
  checkIcon: {
    marginLeft: Theme.spacing.md,
  },

  // スワイプアクション共通
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: Theme.spacing.sm,
  },

  // 左スワイプアクション（完了）
  swipeActionLeft: {
    backgroundColor: Theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
  },

  // 右スワイプアクション（削除）
  swipeActionRight: {
    backgroundColor: Theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: Theme.spacing.sm,
    marginLeft: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
  },

  // スワイプアクションテキスト
  swipeActionText: {
    ...Theme.typography.caption,
    color: Theme.colors.textInverse,
    marginTop: Theme.spacing.xs,
  },
});
