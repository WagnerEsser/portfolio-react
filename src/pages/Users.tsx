import { Button, Typography, List } from "antd";

const { Title } = Typography;

import { useState } from "react";
import type { User } from "../types";
import UserRegistrationModal from "../components/UserRegistrationModal";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddUser = (user: User) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button type='primary' onClick={() => setIsModalOpen(true)}>
        Novo Usuário
      </Button>

      <List
        header={<Title level={3}>Lista de Usuários</Title>}
        bordered
        dataSource={users}
        renderItem={(user) => (
          <List.Item>
            <strong>{user.username}</strong> - {user.email}
          </List.Item>
        )}
        style={{ marginTop: 20 }}
      />

      <UserRegistrationModal
        isOpen={isModalOpen}
        onSubmit={(user) => {
          handleAddUser(user);
          setIsModalOpen(false);
        }}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Users;
