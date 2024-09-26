import { Stack, Text, Image } from '@mantine/core';

const EmptyTable = () => (
  <Stack align="center" gap="xs">
    <Image
      width={100}
      radius="md"
      src="/images/empty.png"
      alt="No data found"
      style={{ filter: 'grayscale(1)', width: '300px' }}
    />
    <Text c="dimmed" size="sm">
      Không có dữ liệu
    </Text>
  </Stack>
);

export default EmptyTable;
