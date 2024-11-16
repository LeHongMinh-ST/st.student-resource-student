import { Modal, Stack, SimpleGrid, Button, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';

type ConfirmModalProps = {
  entityName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  entityName,
  isOpen,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  const [fetching, setFetching] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!fetching) {
      setFetching(true);
      onConfirm();
    }
    setFetching(false);
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={`${entityName}`}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <IconInfoCircle color="blue" size={32} />
          <div>
            <Text fw={600}>Bạn đã thực hiện khảo sát rồi, bạn có muốn nhập lại thông tin?</Text>
          </div>
        </div>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Button loading={fetching} onClick={onSubmit} variant="filled" color="blue">
            Có
          </Button>
          <Button disabled={fetching} onClick={onClose} variant="outline">
            Không
          </Button>
        </SimpleGrid>
      </Stack>
    </Modal>
  );
}
