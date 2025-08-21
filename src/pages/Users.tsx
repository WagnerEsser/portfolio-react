import { Button, Typography, Table, Modal, notification } from "antd";
import { useCallback, useEffect, useState } from "react";
import type { User } from "../types";
import UserRegistrationModal from "../components/UserRegistrationModal";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteFilled,
  EditFilled,
  ReloadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { UserService } from "../services/users";

const { Title } = Typography;

const Users = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User>();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDeleteUser = () => {
    if (userToDelete) {
      UserService.deleteUser(userToDelete.id)
        .then(() => {
          notificationApi.success({
            message: "Usuário excluído com sucesso!",
            showProgress: true,
          });
          loadUsers();
        })
        .catch((error) => {
          notificationApi.error({
            message: "Erro ao excluir o usuário",
            description: error,
            showProgress: true,
          });
        });
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

  const loadUsers = useCallback(() => {
    setIsLoading(true);
    UserService.getUsers()
      .then((response) => {
        const users = (response.data || []) as User[];
        setUsers(users);
      })
      .catch((error) => {
        notificationApi.error({
          message: "Erro ao atualizar a lista de usuários!",
          description: error,
          showProgress: true,
        });
        return;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [notificationApi]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}

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

      <Title
        level={3}
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Lista de Usuários
        <ReloadOutlined
          onClick={loadUsers}
          spin={isLoading}
          style={{ cursor: "pointer" }}
        />
      </Title>

      <Table
        dataSource={users}
        loading={isLoading}
        columns={columns}
        rowKey={(user) => user.email}
        style={{ marginTop: 20 }}
      />

      <UserRegistrationModal
        initialValues={userToEdit}
        isOpen={isModalOpen}
        onSubmit={() => {
          loadUsers();
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
