import { Badge } from '@mantine/core';
import { IconUser, IconUserStar, IconUserCog } from '@tabler/icons-react';
import { roleLabels } from '@/constants/labels';
import Role from '@/enums/role.enum';

interface RoleBadgeProps {
  role?: Role;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getBadgeProps = (role: Role | undefined) => {
    if (!role) return { color: 'blue', label: 'Unknown' };
    switch (role) {
      case Role.Admin:
        return { color: 'green.8', label: roleLabels.admin };
      case Role.Office:
        return { color: 'gray', label: roleLabels.office };
      case Role.Teacher:
        return { color: 'blue', label: roleLabels.teacher };
      default:
        return { color: 'blue', label: 'Unknown' };
    }
  };

  const getIcon = (role: Role | undefined) => {
    if (!role) return <IconUser size={14} />;
    switch (role) {
      case Role.Admin:
        return <IconUserStar size={14} />;
      case Role.Office:
        return <IconUserCog size={14} />;
      case Role.Teacher:
        return <IconUser size={14} />;
      default:
        return <IconUser size={14} />;
    }
  };

  const badgeProps = getBadgeProps(role);

  return (
    <Badge
      leftSection={getIcon(role)}
      color={badgeProps.color}
      variant="filled"
      size="md"
      radius="sm"
    >
      {badgeProps.label}
    </Badge>
  );
};

export default RoleBadge;
