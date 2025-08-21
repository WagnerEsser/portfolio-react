import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import type { MenuProps } from 'antd';
import { Menu, message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

import {
  GithubFilled,
  HomeOutlined,
  InstagramOutlined,
  LinkedinFilled,
  LinkOutlined,
  MailOutlined,
  ProfileOutlined,
  UserOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';

import HeaderPortfolio from './components/HeaderPortfolio';
import Home from './pages/Home';
import Users from './pages/Users';

import './App.css';

type MenuItem = Required<MenuProps>['items'][number];

const items = (messageApi: MessageInstance): MenuItem[] => [
  {
    label: 'Início',
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: 'Usuários',
    key: 'users',
    icon: <UserOutlined />,
  },
  {
    label: 'Links',
    key: 'links',
    icon: <LinkOutlined />,
    children: [
      {
        type: 'group',
        label: 'Profissional',
        children: [
          {
            label: 'Linkedin',
            key: 'linkedin',

            icon: <LinkedinFilled />,
            onClick: () => window.open('https://www.linkedin.com/in/wagneresser/', '_blank'),
          },
          {
            label: 'GitHub',
            key: 'github',
            icon: <GithubFilled />,
            onClick: () => window.open('https://github.com/WagnerEsser', '_blank'),
          },
        ],
      },
      {
        type: 'group',
        label: 'Pessoal',
        children: [
          {
            label: 'Instagram',
            key: 'instagram',
            icon: <InstagramOutlined />,
            onClick: () => window.open('https://www.instagram.com/wagner_esser/', '_blank'),
          },
          {
            label: 'WhatsApp',
            key: 'whatsapp',
            icon: <WhatsAppOutlined />,
            onClick: () => window.open('https://wa.me/5547992826721', '_blank'),
          },
          {
            label: 'waesser@gmail.com',
            key: 'email',
            icon: <MailOutlined />,
            onClick: () => {
              navigator.clipboard.writeText('waesser@gmail.com');
              messageApi.success('Email copiado para a área de transferência!');
            },
          },
        ],
      },
    ],
  },
  {
    label: 'Currículo',
    key: 'curriculum',
    disabled: true,
    icon: <ProfileOutlined />,
  },
];

const initialRoute = location.pathname.replace('/', '') || 'home';

const App = () => {
  const [antMessage, antMessageComponent] = message.useMessage();
  const [current, setCurrent] = useState(initialRoute);

  const onClick: MenuProps['onClick'] = e => {
    switch (e.key) {
      case 'home':
      case 'users': {
        setCurrent(e.key);
        window.history.pushState({}, '', e.key);
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }
      default:
        return;
    }
  };

  return (
    <div style={{ width: 1280 }}>
      {antMessageComponent}

      <HeaderPortfolio />

      <Menu
        selectedKeys={[current]}
        mode="horizontal"
        items={items(antMessage)}
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
        onClick={onClick}
      />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
