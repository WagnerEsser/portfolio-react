import { useEffect, useState } from 'react';

import { Button, Modal, notification, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { AxiosError } from 'axios';

import { DeleteFilled, EditFilled, ReloadOutlined, UserAddOutlined } from '@ant-design/icons';
import UserEditModal from '@components/UserEditModal';
import UserRegistrationModal from '@components/UserRegistrationModal';
import { UserService, useUsers } from '@services/users';
import type { User } from '@types';

const { Title } = Typography;

const Users = () => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [users, setUsers] = useState<User[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User>();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { data, refetch, isFetching } = useUsers();

  useEffect(() => {
    if (data?.status === 200) {
      setUsers(data.data as User[]);
      return;
    }
    if (data?.status) {
      notificationApi.error({
        message: 'Erro ao carregar usuários',
        description: `${data.status}: ${(data.data as AxiosError).message}`,
        showProgress: true,
      });
    }
  }, [data, notificationApi]);

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
          refetch();
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
        <ReloadOutlined spin={isFetching} style={{ cursor: 'pointer' }} onClick={() => refetch()} />
      </Title>

      <Table
        dataSource={users}
        loading={isFetching}
        columns={columns}
        rowKey={user => user.email}
        style={{ marginTop: 20 }}
      />

      <UserRegistrationModal
        isOpen={isModalCreateOpen}
        onClose={() => setIsModalCreateOpen(false)}
        onSubmit={() => {
          refetch();
          setIsModalCreateOpen(false);
        }}
      />

      <UserEditModal
        initialValues={userToEdit}
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        onSubmit={() => {
          refetch();
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
