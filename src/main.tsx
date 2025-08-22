import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css';
import { ConfigProvider, theme } from 'antd';
import ptBR from 'antd/locale/pt_BR';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App';

import './base.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={ptBR}
        theme={{
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <App />
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
