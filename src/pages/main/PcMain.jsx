import styled from 'styled-components';

const PcWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #e6e6fa;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
`;

const PcMain = () => {
  return (
    <PcWrapper>
      <Title>PC 메인 화면</Title>
    </PcWrapper>
  );
};

export default PcMain;
