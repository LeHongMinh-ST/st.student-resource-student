import { Modal, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

type InfoModalProps = {
  entityName: string;
  description: string;
  isOpen: boolean;
};

export default function InfoModal({ entityName, description, isOpen }: InfoModalProps) {
  return (
    <Modal
      opened={isOpen}
      onClose={() => {}}
      title={`${entityName}`}
      withCloseButton={false}
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <IconInfoCircle color="blue" size={32} />
            <Text fw={600}>Đã hết thời gian điền khảo sát</Text>
          </div>
          <div>
            <Text fw={400} size="sm" pl={47}>
              {description}
            </Text>
          </div>
        </div>
      </Stack>
    </Modal>
  );
}
