import { Modal } from "antd";
import type { User } from "../../types";
import UserRegistrationForm from "../UserRegistrationForm";

type Props = {
  isOpen: boolean;
  onSubmit: (user: User) => void;
  onClose?: () => void;
};

const UserRegistrationModal = ({ isOpen, onSubmit, onClose }: Props) => {
  return (
    <Modal
      title='Cadastrar Novo Usuário'
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <UserRegistrationForm onSubmit={onSubmit} />
    </Modal>
  );
};

export default UserRegistrationModal;
