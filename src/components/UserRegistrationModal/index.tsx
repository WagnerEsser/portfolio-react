import {
  useForm,
  Controller,
  type SubmitHandler,
  type FieldErrors,
} from "react-hook-form";
import { Form, Input, Button, notification, List, Modal } from "antd";
import { useCallback } from "react";
import type { User } from "../../types";
import { UserService } from "../../services/users";

type Props = {
  isOpen: boolean;
  initialValues?: User;
  onSubmit: () => void;
  onClose?: () => void;
};

const UserRegistrationModal = ({
  isOpen,
  initialValues,
  onSubmit,
  onClose,
}: Props) => {
  const isEdit = initialValues?.id;
  const [notificationApi, contextHolder] = notification.useNotification();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<User>({ values: initialValues });

  const openFormErrorNotification = useCallback(
    (data: FieldErrors<User>) =>
      notificationApi.error({
        message: `Foram encontrados erros no formulário!`,
        showProgress: true,
        description: (
          <List size='small'>
            {Object.entries(data).map(([fieldName, value]) => (
              <List.Item key={"err-" + fieldName}>{value.message}</List.Item>
            ))}
          </List>
        ),
      }),
    [notificationApi]
  );

  const openFormSuccessNotification = useCallback(
    () =>
      notificationApi.success({
        message: isEdit
          ? "Usuário atualizado com sucesso!"
          : `Usuário cadastrado com sucesso!`,
        showProgress: true,
      }),
    [notificationApi, isEdit]
  );

  const _onSubmit: SubmitHandler<User> = async (formData) => {
    if (!isEdit && formData.password !== formData.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "As senhas não são iguais",
      });
      openFormErrorNotification({
        ...errors,
        confirmPassword: { type: "value", message: "As senhas não são iguais" },
      });
      return;
    }

    if (isEdit) {
      const userToEdit = { ...formData, id: initialValues.id };

      UserService.updateUser(userToEdit)
        .then(() => {
          openFormSuccessNotification();
          onSubmit();
          reset();
        })
        .catch((error) => {
          notificationApi.error({
            message: "Erro ao salvar o usuário",
            description: error as unknown as string,
            showProgress: true,
          });
        });
    } else {
      const newUser = { ...formData, id: crypto.randomUUID() };

      UserService.createUser(newUser)
        .then(() => {
          openFormSuccessNotification();
          onSubmit();
          reset();
        })
        .catch((error) => {
          notificationApi.error({
            message: "Erro ao cadastrar usuário",
            description: error as unknown as string,
            showProgress: true,
          });
        });
    }
  };

  return (
    <Modal
      title={initialValues ? "Editar usuário" : "Cadastrar Novo Usuário"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <div style={{ maxWidth: 600, margin: "32px auto" }}>
        {contextHolder}

        <Form
          onFinish={handleSubmit(_onSubmit, openFormErrorNotification)}
          layout='vertical'
        >
          <Form.Item
            label='Nome'
            validateStatus={errors.name ? "error" : ""}
            help={errors.name && errors.name.message}
          >
            <Controller
              name='name'
              control={control}
              rules={{ required: "Nome é obrigatório" }}
              render={({ field }) => <Input size='large' {...field} />}
            />
          </Form.Item>

          <Form.Item
            label='E-mail'
            validateStatus={errors.email ? "error" : ""}
            help={errors.email && errors.email.message}
          >
            <Controller
              name='email'
              control={control}
              rules={{
                required: "E-mail é obrigatório",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Formato de e-mail inválido",
                },
              }}
              render={({ field }) => <Input size='large' {...field} />}
            />
          </Form.Item>

          {!isEdit && (
            <>
              <Form.Item
                label='Senha'
                validateStatus={errors.password ? "error" : ""}
                help={
                  errors.password
                    ? errors.password.message
                    : "Mínimo de 6 caracteres"
                }
              >
                <Controller
                  name='password'
                  control={control}
                  rules={{
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 6,
                      message: "A senha deve ter no mínimo 6 caracteres",
                    },
                  }}
                  render={({ field }) => (
                    <Input.Password size='large' {...field} />
                  )}
                />
              </Form.Item>

              <Form.Item
                label='Confirmar Senha'
                validateStatus={errors.confirmPassword ? "error" : ""}
                help={errors.confirmPassword && errors.confirmPassword.message}
              >
                <Controller
                  name='confirmPassword'
                  control={control}
                  rules={{
                    required: "Confirmação de senha é obrigatória",
                  }}
                  render={({ field }) => (
                    <Input.Password size='large' {...field} />
                  )}
                />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              block
              style={{ marginTop: 16 }}
            >
              {isEdit ? "Salvar" : "Cadastrar"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UserRegistrationModal;
