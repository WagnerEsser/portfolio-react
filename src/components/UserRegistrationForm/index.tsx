import {
  useForm,
  Controller,
  type SubmitHandler,
  type FieldErrors,
} from "react-hook-form";
import { Form, Input, Button, Typography, notification, List } from "antd";
import { useCallback } from "react";

const { Title } = Typography;

type User = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const UserRegistrationForm = () => {
  const [api, contextHolder] = notification.useNotification();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<User>();

  const openFormErrorNotification = useCallback(
    (data: FieldErrors<User>) =>
      api.error({
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
    [api]
  );

  const openFormSuccessNotification = useCallback(
    () =>
      api.success({
        message: `Usuário cadastrado com sucesso!`,
        showProgress: true,
      }),
    [api]
  );

  const onSubmit: SubmitHandler<User> = (data) => {
    if (data.password !== data.confirmPassword) {
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

    openFormSuccessNotification();
    reset();
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
      }}
    >
      {contextHolder}
      <Title level={2} style={{ textAlign: "center" }}>
        Novo usuário
      </Title>

      <Form
        onFinish={handleSubmit(onSubmit, openFormErrorNotification)}
        layout='vertical'
      >
        <Form.Item
          label='Nome de Usuário'
          validateStatus={errors.username ? "error" : ""}
          help={errors.username && errors.username.message}
        >
          <Controller
            name='username'
            control={control}
            rules={{ required: "Nome de usuário é obrigatório" }}
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

        <Form.Item
          label='Senha'
          validateStatus={errors.password ? "error" : ""}
          help={
            errors.password ? errors.password.message : "Mínimo de 6 caracteres"
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
            render={({ field }) => <Input.Password size='large' {...field} />}
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
            render={({ field }) => <Input.Password size='large' {...field} />}
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
            Cadastrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserRegistrationForm;
