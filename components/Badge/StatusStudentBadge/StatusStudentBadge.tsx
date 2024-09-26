import React from 'react';
import { Badge } from '@mantine/core';
import { studentStatusLabels } from '@/constants/labels';
import { StudentStatus } from '@/enums';

interface StatusStudentBadgeProps {
  status: StudentStatus;
}

const StatusStudentBadge: React.FC<StatusStudentBadgeProps> = ({ status }) => {
  const getBadgeProps = (status: StudentStatus) => {
    switch (status) {
      case StudentStatus.CurrentlyStudying:
        return { color: 'green', label: studentStatusLabels[StudentStatus.CurrentlyStudying] };
      case StudentStatus.Graduated:
        return { color: 'blue', label: studentStatusLabels[StudentStatus.Graduated] };
      case StudentStatus.TemporarilySuspended:
        return { color: 'yellow', label: studentStatusLabels[StudentStatus.TemporarilySuspended] };
      case StudentStatus.Expelled:
        return { color: 'red', label: studentStatusLabels[StudentStatus.Expelled] };
      case StudentStatus.Deferred:
        return { color: 'orange', label: studentStatusLabels[StudentStatus.Deferred] };
      case StudentStatus.TransferStudy:
        return { color: 'purple', label: studentStatusLabels[StudentStatus.TransferStudy] };
      default:
        return { color: 'gray', label: 'Unknown' };
    }
  };

  const badgeProps = getBadgeProps(status);

  return (
    <Badge color={badgeProps.color} variant="filled" size="sm" radius="sm">
      {badgeProps.label}
    </Badge>
  );
};

export default StatusStudentBadge;
