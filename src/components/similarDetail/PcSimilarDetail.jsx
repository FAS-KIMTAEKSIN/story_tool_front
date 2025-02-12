import React from "react";
import styled from "styled-components";
import ChatGPTIcon from "../../assets/chatgpt.png";
import PerplexityIcon from "../../assets/perplexity.png";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 1200px;
  margin: 2rem auto;
  background-color: #f3f3f3;
  padding: 2rem;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 2px solid #ccc;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
`;

const CloseButton = styled.button`
  font-size: 1.5rem;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
`;

const Section = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
`;

const SectionContent = styled.p`
  font-size: 1.1rem;
  color: #333;
  line-height: 1.8;
`;

const AIDescriptionWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 2rem 0;
`;

const AICard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AIIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
`;

const AICardDescription = styled.div`
  font-size: 1rem;
  text-align: center;
  color: #666;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 0.75rem;
  font-size: 1rem;
  line-height: 1.6;
`;

const DetailSection = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PcSimilarDetail = ({ onClose }) => {
  return (
    <Wrapper>
      {/* 상단 헤더 */}
      <Header>
        <Title>유사한 고전 단락1</Title>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>

      {/* 원문 제목 */}
      <Section>
        <SectionTitle>원문 제목</SectionTitle>
        <SectionContent>운영전</SectionContent>
      </Section>

      {/* 원문 요약문 */}
      <Section>
        <SectionTitle>원문 요약문</SectionTitle>
        <SectionContent>
          이 이야기는 조선 시대를 배경으로 한 비극적인 사랑 이야기이다.
          안평대군의 궁녀인 운영은 김진사(금생)와 사랑에 빠진다.
        </SectionContent>
      </Section>

      {/* AI 설명 */}
      <Section>
        <SectionTitle>AI 설명</SectionTitle>
        <AIDescriptionWrapper>
          <AICard>
            <AIIcon src={ChatGPTIcon} alt="ChatGPT" />
            <AICardDescription>
              유사한 문제 이해와 생성 능력 연공하는 모델
            </AICardDescription>
          </AICard>
          <AICard>
            <AIIcon src={PerplexityIcon} alt="Perplexity" />
            <AICardDescription>
              검색 엔진과 결합한 AI 기반 검색 플랫폼
            </AICardDescription>
          </AICard>
        </AIDescriptionWrapper>
      </Section>

      {/* 상세 설명 */}
      <DetailSection>
        {/* 개요 */}
        <Section>
          <SectionTitle>개요</SectionTitle>
          <SectionContent>
            운영전은 17세기 조선 시대에 창작된 한문 소설로, 작자는 미상이다.
            일명 ‘수성궁몽유록(壽聖宮夢遊錄)’이라고도 불린다.
          </SectionContent>
        </Section>

        {/* 주요 특징 */}
        <Section>
          <SectionTitle>주요 특징</SectionTitle>
          <List>
            <ListItem>
              1. 액자식 구조: 외화(유영의 이야기)와 내화(운영과 김진사의 이야기)
            </ListItem>
            <ListItem>
              2. 비극적 결말: 고전 소설에서 보기 드문 비극적 결말을 보여준다
            </ListItem>
            <ListItem>
              3. 자유연애 사상: 봉건적 애정관에서 탈피한 자유연애 사상을 드러낸다
            </ListItem>
          </List>
        </Section>

        {/* 문학사적 의의 */}
        <Section>
          <SectionTitle>문학사적 의의</SectionTitle>
          <List>
            <ListItem>1. 비극 소설: 고전소설 중 유일한 비극소설로 평가받는다</ListItem>
            <ListItem>
              2. 인간성 해방 추구: 봉건적 제도와 규범에 대한 문제제기를 통해 인간성 해방을
              추구한다
            </ListItem>
          </List>
        </Section>
      </DetailSection>
    </Wrapper>
  );
};

export default PcSimilarDetail;
