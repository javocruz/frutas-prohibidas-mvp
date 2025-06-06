import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../providers/AuthProvider';
import { UserProvider } from '../providers/UserProvider';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
  initialAuthState?: {
    user: any;
    loading: boolean;
    error: string | null;
  };
}

const customRender = (
  ui: React.ReactElement,
  {
    route = '/',
    initialAuthState = {
      user: null,
      loading: false,
      error: null,
    },
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  window.history.pushState({}, 'Test page', route);

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render }; 