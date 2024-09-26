import { Modal, Stack, SimpleGrid, Button, Text } from '@mantine/core';
import { IconAlertCircle, IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import HttpStatus from '@/enums/http-status.enum';

type DeleteModalProps = {
  entityName: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<any>;
};

export default function DeleteModal({ entityName, isOpen, onClose, onDelete }: DeleteModalProps) {
  const [fetching, setFetching] = useState<boolean>(false);

  const onSubmit = async () => {
    try {
      if (!fetching) {
        setFetching(true);
        await onDelete();
        notifications.show({
          title: 'Thành công!',
          message: 'Xóa bản ghi thành công!',
          icon: <IconCheck />,
          color: 'green.8',
          autoClose: 5000,
        });
      }
    } catch (e: any) {
      if (e?.status === HttpStatus.HTTP_FORBIDDEN) {
        notifications.show({
          title: 'Thất bại!',
          message: 'Bạn không có quyền thực hiện chức năng này!',
          icon: <IconAlertTriangle />,
          color: 'red',
          autoClose: 5000,
        });
      } else {
        notifications.show({
          title: 'Thất bại!',
          message: 'Có lỗi xảy ra! vui lòng thử lại sau.',
          icon: <IconAlertTriangle />,
          color: 'red',
          autoClose: 5000,
        });
      }
    }
    setFetching(false);
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title={`Xóa ${entityName}`} centered>
      <Stack>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <IconAlertCircle color="red" size={32} />
          <div>
            <Text fw={600}>Bạn có chăc chắn muốn xóa bản ghi này?</Text>
            <Text fw={300} size="sm">
              Dữ liệu sau khi xóa không thể phục hồi!
            </Text>
          </div>
        </div>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Button loading={fetching} onClick={onSubmit} variant="filled" color="red">
            Xóa
          </Button>
          <Button disabled={fetching} onClick={onClose} variant="outline">
            Đóng
          </Button>
        </SimpleGrid>
      </Stack>
    </Modal>
  );
}
