import React from 'react';
import { Badge } from '@mantine/core';
import Status from '@/enums/status.enum';
import { statusLabels } from '@/constants/labels';

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeProps = (status: Status) => {
    switch (status) {
      case Status.Enable:
        return { color: 'green.8', label: statusLabels.enable };
      case Status.Disable:
        return { color: 'red', label: statusLabels.disable };
      case Status.Draft:
        return { color: 'gray', label: statusLabels.draft };
      default:
        return { color: 'blue', label: 'Unknown' };
    }
  };

  const badgeProps = getBadgeProps(status);

  return (
    <Badge color={badgeProps.color} variant="filled" size="sm" radius="sm">
      {badgeProps.label}
    </Badge>
  );
};

export default StatusBadge;
