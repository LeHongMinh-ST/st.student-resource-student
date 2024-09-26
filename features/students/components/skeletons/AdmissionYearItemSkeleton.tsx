import { Group, Skeleton } from '@mantine/core';

const AdmissionYearItemSkeleton = () => (
  <Group align="center" mt="md" mb="xs">
    <Skeleton height={50} circle mb="xl" />
    <div>
      <Skeleton height={20} radius="xl" width="10%" />
      <Skeleton height={20} radius="xl" width="10%" />
    </div>
  </Group>
);

export default AdmissionYearItemSkeleton;
