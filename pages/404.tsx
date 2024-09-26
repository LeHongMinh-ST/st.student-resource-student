import styled from '@emotion/styled';
import { Button, Image } from '@mantine/core';
import { useRouter } from 'next/router';
import { IconHome } from '@tabler/icons-react';

export const getStaticProps = async () => ({
  props: {
    layout: 'unLoggedIn',
  },
});
const NotFoundPage = () => {
  const { push } = useRouter();

  return (
    <NotFoundPageStyled>
      <div className="not-found-image-wrapper">
        <Image src="/images/404.png" alt="404" className="not-found-image" />
      </div>
      <Button leftSection={<IconHome />} onClick={() => push('/')}>
        Quay lại
      </Button>
    </NotFoundPageStyled>
  );
};

const NotFoundPageStyled = styled.div`
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

export default NotFoundPage;
