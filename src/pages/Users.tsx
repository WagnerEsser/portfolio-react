import { Button, Typography, Table, Modal } from "antd";
import { useState } from "react";
import type { User } from "../types";
import UserRegistrationModal from "../components/UserRegistrationModal";
import type { ColumnsType } from "antd/es/table";
import { DeleteFilled, EditFilled, UserAddOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User>();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleAddUser = (user: User) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers((prevUsers) => prevUsers.filter((u) => u !== userToDelete));
      setUserToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ações",
      key: "actions",
      align: "end",
      render: (_: unknown, user: User) => (
        <>
          <Button
            type='link'
            icon={<EditFilled />}
            onClick={() => {
              setUserToEdit(user);
              setIsModalOpen(true);
            }}
          />
          <Button
            type='link'
            danger
            icon={<DeleteFilled />}
            onClick={() => {
              setUserToDelete(user);
              setIsDeleteModalOpen(true);
            }}
          />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Button
        type='primary'
        onClick={() => {
          setUserToEdit(undefined);
          setIsModalOpen(true);
        }}
        icon={<UserAddOutlined />}
      >
        Novo Usuário
      </Button>

      <Title level={3} style={{ marginTop: 20 }}>
        Lista de Usuários
      </Title>

      <Table
        dataSource={users}
        columns={columns}
        rowKey={(user) => user.email}
        style={{ marginTop: 20 }}
      />

      <UserRegistrationModal
        initialValues={userToEdit}
        isOpen={isModalOpen}
        onSubmit={(user) => {
          if (userToEdit) {
            setUsers((prevUsers) =>
              prevUsers.map((u) => (u.email === userToEdit.email ? user : u))
            );
          } else {
            handleAddUser(user);
          }
          setIsModalOpen(false);
        }}
        onClose={() => setIsModalOpen(false)}
      />

      <Modal
        title='Confirmar Exclusão'
        open={isDeleteModalOpen}
        onOk={handleDeleteUser}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText='Excluir'
        cancelText='Cancelar'
      >
        <p>Tem certeza que deseja excluir o usuário?</p>
      </Modal>
    </div>
  );
};

export default Users;
