import { useCallback, useEffect, useState } from 'react';

import { Button, Modal, notification, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AxiosError } from 'axios';

import { DeleteFilled, EditFilled, ReloadOutlined, UserAddOutlined } from '@ant-design/icons';
import UserEditModal from '@components/UserEditModal';
import UserRegistrationModal from '@components/UserRegistrationModal';
import { UserService } from '@services/users';
import type { User } from '@types';

const { Title } = Typography;

const Users = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User>();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const loadUsers = useCallback(() => {
    setIsLoading(true);
    UserService.getUsers()
      .then(({ data, status }) => {
        if (status !== 200) {
          notificationApi.error({
            message: 'Erro ao listar usuários!',
            description: `${status}: ${(data as AxiosError).message}`,
            showProgress: true,
          });
          return;
        }
        const users = (data || []) as User[];
        setUsers(users);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [notificationApi]);

  const handleDeleteUser = () => {
    if (userToDelete) {
      setIsDeleting(true);
      UserService.deleteUser(userToDelete.id)
        .then(({ data, status }) => {
          if (status !== 200) {
            notificationApi.error({
              message: 'Erro ao excluir o usuário',
              description: `${status}: ${(data as AxiosError).message}`,
              showProgress: true,
            });
            return;
          }
          notificationApi.success({
            message: 'Usuário excluído com sucesso!',
            showProgress: true,
          });
          loadUsers();
        })
        .finally(() => {
          setIsDeleting(false);
          setUserToDelete(null);
          setIsModalDeleteOpen(false);
        });
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'end',
      render: (_: unknown, user: User) => (
        <>
          <Button
            type="link"
            icon={<EditFilled />}
            onClick={() => {
              setUserToEdit(user);
              setIsModalEditOpen(true);
            }}
          />
          <Button
            danger
            type="link"
            icon={<DeleteFilled />}
            onClick={() => {
              setUserToDelete(user);
              setIsModalDeleteOpen(true);
            }}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div style={{ padding: '20px' }}>
      {contextHolder}

      <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsModalCreateOpen(true)}>
        Novo Usuário
      </Button>

      <Title
        level={3}
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Lista de Usuários
        <ReloadOutlined spin={isLoading} style={{ cursor: 'pointer' }} onClick={loadUsers} />
      </Title>

      <Table
        dataSource={users}
        loading={isLoading}
        columns={columns}
        rowKey={user => user.email}
        style={{ marginTop: 20 }}
      />

      <UserRegistrationModal
        isOpen={isModalCreateOpen}
        onClose={() => setIsModalCreateOpen(false)}
        onSubmit={() => {
          loadUsers();
          setIsModalCreateOpen(false);
        }}
      />

      <UserEditModal
        initialValues={userToEdit}
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        onSubmit={() => {
          loadUsers();
          setIsModalEditOpen(false);
        }}
      />

      <Modal
        title="Confirmar Exclusão"
        open={isModalDeleteOpen}
        okText="Excluir"
        cancelText="Cancelar"
        confirmLoading={isDeleting}
        onOk={handleDeleteUser}
        onCancel={() => setIsModalDeleteOpen(false)}
      >
        <p>Tem certeza que deseja excluir o usuário?</p>
      </Modal>
    </div>
  );
};

export default Users;
