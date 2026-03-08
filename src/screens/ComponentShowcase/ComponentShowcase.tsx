import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Icon, IconNames } from '../../components/common/Icon';
import { Header } from '../../components/common/Header';
import { TaskCard } from '../../components/task/TaskCard';
import { CalendarDay } from '../../components/calendar/CalendarDay';
import { Theme } from '../../theme';

/**
 * ComponentShowcase
 *
 * 全コンポーネントのデモを表示するショーケース画面
 */
export const ComponentShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const handleButtonPress = (variant: string) => {
    Alert.alert('ボタンクリック', `${variant}ボタンが押されました`);
  };

  const handleTaskComplete = () => {
    Alert.alert('タスク完了', 'タスクが完了しました');
  };

  const handleTaskDelete = () => {
    Alert.alert('タスク削除', 'タスクが削除されました');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="コンポーネントショーケース"
        subtitle="UIコンポーネントのデモ"
        variant="primary"
        useSafeArea={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* セクション: ボタン */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ボタン</Text>

          <Button
            title="プライマリーボタン"
            variant="primary"
            onPress={() => handleButtonPress('Primary')}
            style={styles.item}
          />

          <Button
            title="セカンダリーボタン"
            variant="secondary"
            onPress={() => handleButtonPress('Secondary')}
            style={styles.item}
          />

          <Button
            title="危険なボタン"
            variant="danger"
            onPress={() => handleButtonPress('Danger')}
            style={styles.item}
          />

          <Button
            title="アウトラインボタン"
            variant="outline"
            onPress={() => handleButtonPress('Outline')}
            style={styles.item}
          />

          <Button
            title="無効なボタン"
            variant="primary"
            disabled
            style={styles.item}
          />

          <Button
            title="ローディング中"
            variant="primary"
            loading
            style={styles.item}
          />

          <Button
            title="アイコン付きボタン"
            variant="primary"
            leftIcon={
              <Icon
                name={IconNames.add}
                size="sm"
                color={Theme.colors.textInverse}
              />
            }
            onPress={() => handleButtonPress('Icon')}
            style={styles.item}
          />
        </View>

        {/* セクション: カード */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>カード</Text>

          <Card variant="elevated" padding="md" style={styles.item}>
            <Text style={styles.cardTitle}>Elevatedカード</Text>
            <Text style={styles.cardDescription}>
              影付きのカード。デフォルトスタイルです。
            </Text>
          </Card>

          <Card variant="outlined" padding="md" style={styles.item}>
            <Text style={styles.cardTitle}>Outlinedカード</Text>
            <Text style={styles.cardDescription}>
              枠線付きのカード。軽量な見た目です。
            </Text>
          </Card>

          <Card
            variant="elevated"
            padding="md"
            pressable
            onPress={() => Alert.alert('カード', 'カードがタップされました')}
            style={styles.item}
          >
            <Text style={styles.cardTitle}>タップ可能なカード</Text>
            <Text style={styles.cardDescription}>
              このカードはタップできます。
            </Text>
          </Card>
        </View>

        {/* セクション: インプット */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>インプット</Text>

          <Input
            label="メールアドレス"
            placeholder="email@example.com"
            value={inputValue}
            onChangeText={setInputValue}
            leftIcon={<Icon name={IconNames.person} size="sm" />}
            containerStyle={styles.item}
          />

          <Input
            label="パスワード"
            placeholder="パスワードを入力"
            secureTextEntry
            required
            helperText="8文字以上で入力してください"
            containerStyle={styles.item}
          />

          <Input
            label="エラー付きインプット"
            placeholder="入力してください"
            error="入力内容に誤りがあります"
            containerStyle={styles.item}
          />

          <Input
            label="無効なインプット"
            placeholder="編集できません"
            disabled
            value="無効な値"
            containerStyle={styles.item}
          />
        </View>

        {/* セクション: アイコン */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アイコン</Text>

          <View style={styles.iconGrid}>
            <View style={styles.iconItem}>
              <Icon
                name={IconNames.home}
                size="lg"
                color={Theme.colors.primary}
              />
              <Text style={styles.iconLabel}>Home</Text>
            </View>

            <View style={styles.iconItem}>
              <Icon
                name={IconNames.calendar}
                size="lg"
                color={Theme.colors.secondary}
              />
              <Text style={styles.iconLabel}>Calendar</Text>
            </View>

            <View style={styles.iconItem}>
              <Icon
                name={IconNames.task}
                size="lg"
                color={Theme.colors.success}
              />
              <Text style={styles.iconLabel}>Task</Text>
            </View>

            <View style={styles.iconItem}>
              <Icon
                name={IconNames.notification}
                size="lg"
                color={Theme.colors.warning}
              />
              <Text style={styles.iconLabel}>Notification</Text>
            </View>

            <View style={styles.iconItem}>
              <Icon
                name={IconNames.settings}
                size="lg"
                color={Theme.colors.textSecondary}
              />
              <Text style={styles.iconLabel}>Settings</Text>
            </View>

            <View style={styles.iconItem}>
              <Icon
                name={IconNames.star}
                size="lg"
                color={Theme.colors.error}
              />
              <Text style={styles.iconLabel}>Star</Text>
            </View>
          </View>
        </View>

        {/* セクション: タスクカード */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>タスクカード</Text>

          <TaskCard
            title="高優先度タスク"
            description="このタスクは重要です。スワイプして完了/削除できます。"
            priority="high"
            dueDate={new Date()}
            category="仕事"
            categoryColor={Theme.colors.categoryWork}
            onComplete={handleTaskComplete}
            onDelete={handleTaskDelete}
          />

          <TaskCard
            title="完了済みタスク"
            description="このタスクは完了しています。"
            status="completed"
            priority="medium"
            category="個人"
            categoryColor={Theme.colors.categoryPersonal}
            onDelete={handleTaskDelete}
          />

          <TaskCard
            title="期限切れタスク"
            description="期限を過ぎているタスクです。"
            priority="low"
            dueDate={yesterday}
            onComplete={handleTaskComplete}
            onDelete={handleTaskDelete}
          />
        </View>

        {/* セクション: カレンダー日付 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>カレンダー日付</Text>

          <View style={styles.calendarGrid}>
            <CalendarDay
              day={1}
              type="weekday"
              onPress={(date) => setSelectedDate(date.day)}
            />

            <CalendarDay
              day={15}
              isToday
              marking={{
                dots: [
                  { color: Theme.colors.primary },
                  { color: Theme.colors.secondary },
                ],
                taskCount: 3,
              }}
              onPress={(date) => setSelectedDate(date.day)}
            />

            <CalendarDay
              day={20}
              isSelected={selectedDate === 20}
              type="weekend"
              onPress={(date) => setSelectedDate(date.day)}
            />

            <CalendarDay
              day={25}
              type="holiday"
              marking={{
                taskCount: 5,
              }}
              onPress={(date) => setSelectedDate(date.day)}
            />

            <CalendarDay day={30} isDisabled />
          </View>
        </View>

        {/* 下部余白 */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingVertical: Theme.spacing.lg,
  },
  section: {
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.lg,
  },
  item: {
    marginBottom: Theme.spacing.md,
  },
  cardTitle: {
    ...Theme.typography.body,
    fontWeight: Theme.fontWeight.semibold,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },
  cardDescription: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Theme.spacing.sm,
  },
  iconItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  iconLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xs,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default ComponentShowcase;
