import { useCallback } from 'react';
import { Controller, type FieldErrors, type SubmitHandler, useForm } from 'react-hook-form';

import { Button, Form, Input, List, Modal, notification } from 'antd';
import type { AxiosError } from 'axios';

import { UserService } from '@services/users';
import type { User } from '@types';

type Props = {
  isOpen: boolean;
  onSubmit: () => void;
  onClose?: () => void;
};

const UserRegistrationModal = ({ isOpen, onSubmit, onClose }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<User>();

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
    if (formData.password !== formData.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'As senhas não são iguais',
      });
      openErrorNotification({
        ...errors,
        confirmPassword: { type: 'value', message: 'As senhas não são iguais' },
      });
      return;
    }

    const newUser = { ...formData, id: crypto.randomUUID() };

    UserService.createUser(newUser).then(({ data, status }) => {
      if (status !== 200) {
        notificationApi.error({
          message: 'Erro ao cadastrar usuário',
          description: `${status}: ${(data as AxiosError).message}`,
          showProgress: true,
        });
        return;
      }
      notificationApi.success({
        message: `Usuário cadastrado com sucesso!`,
        showProgress: true,
      });
      onSubmit();
      reset();
    });
  };

  return (
    <Modal title="Cadastrar Novo Usuário" open={isOpen} footer={null} onCancel={onClose}>
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

          <Form.Item
            label="Senha"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password ? errors.password.message : 'Mínimo de 6 caracteres'}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => <Input.Password size="large" {...field} />}
              rules={{
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter no mínimo 6 caracteres',
                },
              }}
            />
          </Form.Item>

          <Form.Item
            label="Confirmar Senha"
            validateStatus={errors.confirmPassword ? 'error' : ''}
            help={errors.confirmPassword && errors.confirmPassword.message}
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => <Input.Password size="large" {...field} />}
              rules={{
                required: 'Confirmação de senha é obrigatória',
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" size="large" style={{ marginTop: 16 }}>
              Cadastrar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UserRegistrationModal;
