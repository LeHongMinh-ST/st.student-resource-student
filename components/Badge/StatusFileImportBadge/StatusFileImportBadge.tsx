import React from 'react';
import { Badge } from '@mantine/core';
import { statusFileImportLabels } from '@/constants/labels';
import { StatusFileImport } from '@/enums';

interface StatusFileImportBadgeProp {
  status: StatusFileImport;
}

const StatusFileImportBadge: React.FC<StatusFileImportBadgeProp> = ({ status }) => {
  const getBadgeProps = (status: StatusFileImport) => {
    switch (status) {
      case StatusFileImport.Completed:
        return { color: 'green.8', label: statusFileImportLabels.completed };
      case StatusFileImport.Processing:
        return { color: 'blue', label: statusFileImportLabels.processing };
      case StatusFileImport.Pending:
        return { color: 'gray', label: statusFileImportLabels.pending };
      default:
        return { color: 'green.8', label: statusFileImportLabels.completed };
    }
  };

  const badgeProps = getBadgeProps(status);

  return (
    <Badge color={badgeProps.color} variant="filled" size="sm" radius="sm">
      {badgeProps.label}
    </Badge>
  );
};

export default StatusFileImportBadge;
