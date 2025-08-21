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

const UserEditModal = ({ isOpen, initialValues, onSubmit, onClose }: Props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
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
          <List size='small'>
            {Object.entries(data).map(([fieldName, value]) => (
              <List.Item key={"err-" + fieldName}>{value.message}</List.Item>
            ))}
          </List>
        ),
      }),
    [notificationApi]
  );

  const openSuccessNotification = useCallback(
    () =>
      notificationApi.success({
        message: "Usuário atualizado com sucesso!",
        showProgress: true,
      }),
    [notificationApi]
  );

  const _onSubmit: SubmitHandler<User> = async (formData) => {
    if (!initialValues) return;

    const userToEdit = { ...formData, id: initialValues.id };

    UserService.updateUser(userToEdit)
      .then(() => {
        openSuccessNotification();
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
  };

  return (
    <Modal
      title={"Editar usuário"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <div style={{ maxWidth: 600, margin: "32px auto" }}>
        {contextHolder}

        <Form
          onFinish={handleSubmit(_onSubmit, openErrorNotification)}
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

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              block
              style={{ marginTop: 16 }}
            >
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UserEditModal;
