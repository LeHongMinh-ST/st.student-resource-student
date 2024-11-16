import styled from '@emotion/styled';
import { Text } from '@mantine/core';

const Completed = () => (
  <CompletedStyled>
    <div className="image-wrapper">
      <img src="/images/completed.svg" alt="" />
    </div>
    <Text size="xl">Gửi khảo sát thành công! </Text>
  </CompletedStyled>
);

const CompletedStyled = styled.div`
  background-color: #ffffff;
  text-align: center;
  height: 100vh;

  .image-wrapper {
    display: flex;
    justify-content: center;
    padding: 20px;
    img {
      max-width: 500px;
    }
  }
`;

export default Completed;
