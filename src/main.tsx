import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@ant-design/v5-patch-for-react-19'; // for react 19 compability
import 'antd/dist/reset.css';
import { ConfigProvider, theme } from 'antd';
import ptBR from 'antd/locale/pt_BR';

import App from './App';

import './base.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      locale={ptBR}
      theme={{
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);
