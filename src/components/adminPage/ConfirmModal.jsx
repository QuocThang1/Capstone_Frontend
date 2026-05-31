import { Modal, Button } from "antd";

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", variant = "danger" }) {
  return (
    <Modal 
      title={title}
      open={open} 
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          type={variant === "danger" ? "primary" : "default"} 
          danger={variant === "danger"}
          onClick={() => { onConfirm(); onClose(); }}
        >
          {confirmLabel}
        </Button>,
      ]}
    >
      <p>{message}</p>
    </Modal>
  );
}
