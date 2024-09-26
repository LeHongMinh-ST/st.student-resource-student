import { Card, Group, Skeleton } from '@mantine/core';
import AdmissionYearItemSkeleton from './AdmissionYearItemSkeleton';

const AdmissionYearCardSkeleton = () => (
  <>
    {[1, 2, 3, 4].map((_, index) => (
      <Card mt={10} key={index}>
        <Group align="center" justify="space-between">
          <AdmissionYearItemSkeleton />
          <Group align="center" mt="md" mb="xs">
            <Skeleton height={8} mt={6} width="10%" radius="xl" />
          </Group>
        </Group>
      </Card>
    ))}
  </>
);

export default AdmissionYearCardSkeleton;
