/**
 * アニメーションユーティリティ
 *
 * React Native Reanimated 3を使用したアニメーションヘルパー関数
 */

import {
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

// アニメーション設定の型定義
export interface SpringConfig {
  damping?: number;
  mass?: number;
  stiffness?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
}

export interface TimingConfig {
  duration?: number;
  easing?: typeof Easing.linear;
}

// デフォルトのSpring設定
export const defaultSpringConfig: SpringConfig = {
  damping: 15,
  mass: 1,
  stiffness: 150,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

// デフォルトのTiming設定
export const defaultTimingConfig: TimingConfig = {
  duration: 300,
  easing: Easing.inOut(Easing.ease),
};

// プリセットアニメーション設定
export const AnimationPresets = {
  // バウンス効果のあるSpring
  bouncy: {
    damping: 10,
    mass: 1,
    stiffness: 100,
  } as SpringConfig,

  // スムーズなSpring
  smooth: {
    damping: 20,
    mass: 1,
    stiffness: 180,
  } as SpringConfig,

  // 素早いSpring
  quick: {
    damping: 25,
    mass: 1,
    stiffness: 300,
  } as SpringConfig,

  // ゆっくりとしたTiming
  slow: {
    duration: 500,
    easing: Easing.inOut(Easing.ease),
  } as TimingConfig,

  // 標準的なTiming
  standard: {
    duration: 300,
    easing: Easing.inOut(Easing.quad),
  } as TimingConfig,

  // 素早いTiming
  fast: {
    duration: 150,
    easing: Easing.out(Easing.cubic),
  } as TimingConfig,
};

/**
 * Springアニメーション
 *
 * @param value - アニメーションの目標値
 * @param config - Spring設定（オプション）
 * @returns Reanimatedアニメーション値
 */
export const springAnimation = (
  value: number,
  config: SpringConfig = defaultSpringConfig
) => {
  'worklet';
  return withSpring(value, config);
};

/**
 * Timingアニメーション
 *
 * @param value - アニメーションの目標値
 * @param config - Timing設定（オプション）
 * @returns Reanimatedアニメーション値
 */
export const timingAnimation = (
  value: number,
  config: TimingConfig = defaultTimingConfig
) => {
  'worklet';
  return withTiming(value, config);
};

/**
 * 遅延付きアニメーション
 *
 * @param delay - 遅延時間（ミリ秒）
 * @param animation - アニメーション
 * @returns 遅延付きアニメーション
 */
export const delayedAnimation = (delay: number, animation: number) => {
  'worklet';
  return withDelay(delay, animation);
};

/**
 * シーケンスアニメーション
 *
 * @param animations - アニメーションの配列
 * @returns シーケンスアニメーション
 */
export const sequenceAnimation = (...animations: number[]) => {
  'worklet';
  return withSequence(...animations);
};

/**
 * リピートアニメーション
 *
 * @param animation - リピートするアニメーション
 * @param numberOfReps - リピート回数（-1で無限）
 * @param reverse - 逆再生するか
 * @returns リピートアニメーション
 */
export const repeatAnimation = (
  animation: number,
  numberOfReps = -1,
  reverse = true
) => {
  'worklet';
  return withRepeat(animation, numberOfReps, reverse);
};

/**
 * フェードインアニメーション
 *
 * @param duration - アニメーション時間
 * @returns opacity 0から1へのアニメーション
 */
export const fadeIn = (duration = 300) => {
  'worklet';
  return timingAnimation(1, { duration });
};

/**
 * フェードアウトアニメーション
 *
 * @param duration - アニメーション時間
 * @returns opacity 1から0へのアニメーション
 */
export const fadeOut = (duration = 300) => {
  'worklet';
  return timingAnimation(0, { duration });
};

/**
 * スケールアップアニメーション
 *
 * @param targetScale - 目標スケール値
 * @param config - アニメーション設定
 * @returns スケールアニメーション
 */
export const scaleUp = (targetScale = 1, config?: SpringConfig) => {
  'worklet';
  return springAnimation(targetScale, config || AnimationPresets.bouncy);
};

/**
 * スケールダウンアニメーション
 *
 * @param targetScale - 目標スケール値
 * @param config - アニメーション設定
 * @returns スケールアニメーション
 */
export const scaleDown = (targetScale = 0, config?: SpringConfig) => {
  'worklet';
  return springAnimation(targetScale, config || AnimationPresets.smooth);
};

/**
 * スライドアニメーション
 *
 * @param from - 開始位置
 * @param to - 終了位置
 * @param config - アニメーション設定
 * @returns スライドアニメーション
 */
export const slide = (from: number, to: number, config?: TimingConfig) => {
  'worklet';
  return sequenceAnimation(
    timingAnimation(from, { duration: 0 }),
    timingAnimation(to, config || AnimationPresets.standard)
  );
};

/**
 * パルスアニメーション（拡大縮小を繰り返す）
 *
 * @param _minScale - 最小スケール（将来の実装用）
 * @param maxScale - 最大スケール
 * @param duration - アニメーション時間
 * @returns パルスアニメーション
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const pulse = (_minScale = 1, maxScale = 1.1, duration = 1000) => {
  'worklet';
  return repeatAnimation(
    timingAnimation(maxScale, { duration: duration / 2 }),
    -1,
    true
  );
};

/**
 * 振動アニメーション
 *
 * @param amplitude - 振幅
 * @param duration - アニメーション時間
 * @returns 振動アニメーション
 */
export const shake = (amplitude = 10, duration = 500) => {
  'worklet';
  return sequenceAnimation(
    timingAnimation(-amplitude, { duration: duration / 4 }),
    timingAnimation(amplitude, { duration: duration / 4 }),
    timingAnimation(-amplitude / 2, { duration: duration / 4 }),
    timingAnimation(0, { duration: duration / 4 })
  );
};

/**
 * 補間値を計算する
 *
 * @param value - 入力値
 * @param inputRange - 入力範囲
 * @param outputRange - 出力範囲
 * @param extrapolate - 外挿設定
 * @returns 補間された値
 */
export const interpolateValue = (
  value: number,
  inputRange: number[],
  outputRange: number[],
  extrapolate = Extrapolate.CLAMP
) => {
  'worklet';
  return interpolate(value, inputRange, outputRange, extrapolate);
};

// エクスポート
export default {
  springAnimation,
  timingAnimation,
  delayedAnimation,
  sequenceAnimation,
  repeatAnimation,
  fadeIn,
  fadeOut,
  scaleUp,
  scaleDown,
  slide,
  pulse,
  shake,
  interpolateValue,
  AnimationPresets,
};
