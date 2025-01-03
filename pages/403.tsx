import styled from '@emotion/styled';
import { Button, Image, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconHome } from '@tabler/icons-react';

const ForbiddenPage = () => {
  const { push } = useRouter();

  return (
    <ForbiddenPageStyled>
      <div className="not-found-image-wrapper">
        <Image src="/images/403.png" alt="403" className="not-found-image" />
      </div>
      <Text mb="10px">Bạn không có quyền truy cập chức năng này!</Text>
      <Button leftSection={<IconHome />} onClick={() => push('/')}>
        Quay lại trang chủ
      </Button>
    </ForbiddenPageStyled>
  );
};

const ForbiddenPageStyled = styled.div`
  background-color: #ffffff;
  text-align: center;
  height: 100vh;

  .not-found-image-wrapper {
    display: flex;
    justify-content: center;
    img {
      max-width: 400px;
    }
  }
`;

export default ForbiddenPage;
