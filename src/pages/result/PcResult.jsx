import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PcHamburgerButton from "../../components/hamburger/PcHamburgerButton";
import PcSideMenu from "../../components/sidemenu/PcSideMenu";

// 스타일 정의
const PcWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  background-color: #f3f3f3;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.5rem 2rem;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin: 0;
`;

const ContentBox = styled.div`
  width: 70%;
  padding: 1.5rem;
  background-color: #fff;
  border: 2px solid #007bff;
  border-radius: 10px;
  margin: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ContentTitle = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  color: #007bff;
  margin-bottom: 1rem;
`;

const ContentText = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
  line-height: 1.6;
`;

const ResultBox = styled.div`
  width: 70%;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin: 1rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ResultTitle = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
`;

const ResultText = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
  line-height: 1.6;
`;

const PcResult = () => {
  const [userContent, setUserContent] = useState(""); // 사용자 입력 내용
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // 로컬스토리지에서 사용자 입력값 불러오기
  useEffect(() => {
    const content = localStorage.getItem("content");
    if (content) setUserContent(content);
  }, []);

  // AI 생성 결과 (예시 데이터)
  const aiResult = `한 선비가 뿌연 아침 안개를 뚫고 말을 몰아 가던 중이었다. 빗방울이 어느새 촉촉히 떨어지기 시작하더니 이내 폭우로 변하였다. 그는 급히 근처의 주막으로 피신하였다. 주막 안은 따스한 온기로 가득했으며, 모락모락 피어오르는 고깃국 냄새가 허기를 자극했다.
그곳엔 한 여인이 있었다. 그녀는 검은 비단 옷자락을 정리하며 창문 밖 빗줄기를 바라보고 있었다. 길게 늘어진 머리칼에서 한두 방울 빗물이 떨어졌고, 그 모습은 선비의 시선을 사로잡았다.
"손님, 젖은 옷을 말리세요." 그녀의 맑은 음성이 선비를 현실로 불러들였다. 그가 머뭇거리며 고개를 숙이자, 여인은 살며시 미소를 지었다. 두 사람은 자연스레 이야기를 나누기 시작했고, 선비는 그녀의 지혜와 따뜻함에 감탄을 금치 못했다.
그러나 곧 현실이 그를 붙들었다. 과거시험 날짜가 코앞으로 다가온 터였다. 떠나야 함을 알면서도 그는 주막을 떠나기 힘들었다. "여기서의 만남이 하늘의 뜻이라면, 과연 내 갈 길은 어디로 향해야 옳은가?" 선비의 마음속 갈등은 빗소리처럼 찾아들지 않았다.`;

  return (
    <PcWrapper>
      {/* 상단 햄버거 버튼 및 제목 */}
      <Header>
        <PcHamburgerButton onClick={toggleMenu} />
        <Title>생성된 이야기 제목</Title>
        <button>⚙️ 필터</button>
      </Header>

      {/* 사이드 메뉴 */}
      <PcSideMenu isOpen={isMenuOpen} onClose={closeMenu} />

      {/* 사용자 입력 내용 */}
      <ContentBox>
        <ContentTitle>사용자 입력 내용</ContentTitle>
        <ContentText>{userContent || "사용자 입력 내용이 없습니다."}</ContentText>
      </ContentBox>

      {/* AI 생성 결과 */}
      <ResultBox>
        <ResultTitle>Fine-tuning AI 생성 결과</ResultTitle>
        <ResultText>{aiResult}</ResultText>
      </ResultBox>
    </PcWrapper>
  );
};

export default PcResult;
