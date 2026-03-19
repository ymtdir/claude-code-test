/**
 * テストユーティリティ
 * Reduxストアとルーターを含むカスタムrenderヘルパー
 */

import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import rootReducer from '../store/rootReducer';
import type { RootState } from '../store';

// Reduxストアの型
type AppStore = ReturnType<typeof setupStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  withRouter?: boolean;
}

/**
 * テスト用のストアを作成
 */
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // テストでは無効化
      }),
  });
}

/**
 * ReduxストアとReact Routerを含むカスタムrenderヘルパー
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    withRouter = true,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    const component = <Provider store={store}>{children}</Provider>;
    return withRouter ? <BrowserRouter>{component}</BrowserRouter> : component;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// 再エクスポート（react-refreshのwarningを回避）
export { screen, waitFor, within, fireEvent } from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
