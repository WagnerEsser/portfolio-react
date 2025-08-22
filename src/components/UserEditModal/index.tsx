import { useCallback, useState } from 'react';
import { Controller, type FieldErrors, type SubmitHandler, useForm } from 'react-hook-form';

import { Button, Form, Input, List, Modal, notification } from 'antd';
import type { AxiosError } from 'axios';

import { UserService } from '@services/users';
import type { User } from '@types';

type Props = {
  isOpen: boolean;
  initialValues?: User;
  onSubmit: () => void;
  onClose?: () => void;
};

const UserEditModal = ({ isOpen, initialValues, onSubmit, onClose }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<User>({ values: initialValues });

  const openErrorNotification = useCallback(
    (data: FieldErrors<User>) =>
      notificationApi.error({
        message: `Foram encontrados erros no formulário!`,
        showProgress: true,
        description: (
          <List size="small">
            {Object.entries(data).map(([fieldName, value]) => (
              <List.Item key={'err-' + fieldName}>{value.message}</List.Item>
            ))}
          </List>
        ),
      }),
    [notificationApi]
  );

  const _onSubmit: SubmitHandler<User> = async formData => {
    if (!initialValues) return;

    setIsLoading(true);
    const userToEdit = { ...formData, id: initialValues.id };

    UserService.updateUser(userToEdit)
      .then(({ data, status }) => {
        if (status !== 200) {
          notificationApi.error({
            message: 'Erro ao salvar o usuário',
            description: `${status}: ${(data as AxiosError).message}`,
            showProgress: true,
          });
          return;
        }
        notificationApi.success({
          message: 'Usuário atualizado com sucesso!',
          showProgress: true,
        });
        onSubmit();
        reset();
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal title="Editar usuário" open={isOpen} footer={null} onCancel={onClose}>
      <div style={{ maxWidth: 600, margin: '32px auto' }}>
        {contextHolder}

        <Form layout="vertical" onFinish={handleSubmit(_onSubmit, openErrorNotification)}>
          <Form.Item label="Nome" validateStatus={errors.name ? 'error' : ''} help={errors.name && errors.name.message}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field }) => <Input size="large" {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="E-mail"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email && errors.email.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input size="large" {...field} />}
              rules={{
                required: 'E-mail é obrigatório',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Formato de e-mail inválido',
                },
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" size="large" style={{ marginTop: 16 }} loading={isLoading}>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UserEditModal;
