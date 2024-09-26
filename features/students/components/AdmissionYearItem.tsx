import { Group, Text } from '@mantine/core';
import { IconBook2 } from '@tabler/icons-react';
import { AdmissionYear } from '@/types';

interface AdmissionYearItemProps {
  admissionYear: AdmissionYear;
}

const AdmissionYearItem = ({ admissionYear }: AdmissionYearItemProps) => (
  <Group align="center" mt="md" mb="xs">
    <IconBook2 size={48} />
    <div>
      <Text fw={500} size="xl">
        Khóa {admissionYear.admission_year}
      </Text>
      <Text fw={500} size="md" color="gray.6">
        Năm học: {admissionYear.school_year}
      </Text>
    </div>
  </Group>
);

export default AdmissionYearItem;
