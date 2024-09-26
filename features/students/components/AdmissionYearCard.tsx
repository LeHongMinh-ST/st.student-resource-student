import { Card, Group, Text } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { AdmissionYear } from '@/types';
import AdmissionYearItem from './AdmissionYearItem';

interface AdmissionYearCardProps {
  admissionYear: AdmissionYear;
  onSelect: (admissionYear: AdmissionYear) => void;
}

const AdmissionYearCard = ({ admissionYear, onSelect }: AdmissionYearCardProps) => {
  const handleClick = () => {
    onSelect(admissionYear);
  };

  return (
    <Card mt={10} className="admission-year-item" onClick={handleClick}>
      <Group align="center" justify="space-between">
        <AdmissionYearItem admissionYear={admissionYear} />
        <Group align="center" mt="md" mb="xs">
          <IconUser size={24} />
          <Text fw={500} size="lg">
            Sinh viên: {admissionYear.student_count ? admissionYear.student_count : 0}
          </Text>
        </Group>
      </Group>
    </Card>
  );
};

export default AdmissionYearCard;
