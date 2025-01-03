import { Button, Menu } from '@mantine/core';
import { IconEdit, IconDotsVertical, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { requestRoute } from '@/routes';
import { UpdateRequest } from '@/types';
import { useRequestUpdateService } from '@/services/requestUpdateService';
import StudentInfoUpdateStatus from '@/enums/studentInfoUpdateStatus.enum';

interface RequestActionMenuProps {
  request: UpdateRequest;
  onOpen: () => void;
  setSelected: (request: UpdateRequest) => void;
  isAdmin: boolean;
}

const RequestActionMenu: React.FC<RequestActionMenuProps> = ({
  request,
  onOpen,
  setSelected,
  isAdmin,
}) => {
  const requestService = useRequestUpdateService();

  const handleVerify = async () => {
    await requestService.updateRequestStatus(
      request.id!,
      StudentInfoUpdateStatus.ClassOfficerApproved
    );
  };

  const handleReject = async () => {
    await requestService.updateRequestStatus(request.id!, StudentInfoUpdateStatus.Rejected);
  };

  return (
    <Menu withArrow width={150} shadow="md">
      <Menu.Target>
        <div style={{ cursor: 'pointer', display: 'flex' }}>
          <Button variant="filled" size="xs">
            <IconDotsVertical color="white" size={16} />
          </Button>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        {isAdmin && request.status === StudentInfoUpdateStatus.Pending && (
          <>
            <Menu.Item
              fw={600}
              fz="sm"
              color="green"
              variant="filled"
              leftSection={<IconCheck size={16} />}
              onClick={handleVerify}
            >
              Xác thực
            </Menu.Item>
            <Menu.Item
              fw={600}
              fz="sm"
              color="red"
              variant="filled"
              leftSection={<IconX size={16} />}
              onClick={handleReject}
            >
              Từ chối
            </Menu.Item>
          </>
        )}
        <Menu.Item
          fw={600}
          fz="sm"
          color="blue"
          variant="filled"
          component={Link}
          leftSection={<IconEdit size={16} />}
          href={requestRoute.update(Number(request?.id))}
        >
          Chỉnh sửa
        </Menu.Item>
        <Menu.Item
          fw={600}
          fz="sm"
          color="red"
          variant="filled"
          leftSection={<IconTrash size={16} />}
          onClick={() => {
            setSelected(request);
            onOpen();
          }}
        >
          Xóa
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default RequestActionMenu;
