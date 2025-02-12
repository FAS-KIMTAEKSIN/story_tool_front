import React, { useState } from "react";
import styled from "styled-components";
import Config from "../../util/config";
import ReactMarkdown from "react-markdown";
import { GridLoader } from 'react-spinners';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 0.1rem;
  box-sizing: border-box;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 2px solid #ccc;
`;

const Title = styled.h1`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-top: 0;
`;

const CloseButton = styled.button`
  font-size: 1.4rem;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
`;

const Section = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  color: #ffffff;
  background-color: #777777a6;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  display: inline-block; /* 내용에 따라 크기가 조절됨 */
  padding: 0.2rem 0.5rem; /* 텍스트와 배경 사이 여백 추가 */
`;

const SimilarBox = styled.div`
  flex: 1;
  text-align: center;
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.isSelected ? "#bebebe" : "#ffffff")};
  color: ${(props) => (props.isSelected ? "#333333" : "#333333")};
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#bebebe" : "#f0f0f0")};
  }
`;

const AiSectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  color: #ffffff;
  background-color: #007afe;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  display: inline-block; /* 내용에 따라 크기가 조절됨 */
  padding: 0.2rem 0.5rem; /* 텍스트와 배경 사이 여백 추가 */
`;

const SectionContent = styled.p`
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
`;

const AnalyzeButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: #007afe;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 1rem;
  padding: 0.5rem;
`;

const MarkdownContent = styled.div`
  line-height: 1.6;

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  p {
    margin: 0.8em 0;
  }
  ul, ol {
    padding-left: 1.5em;
    margin: 0.8em 0;
  }
  li {
    margin: 0.3em 0;
  }
  strong {
    font-weight: 600;
  }
  code {
    background-color: #774444;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
`;

const LoadingSection = styled.div`
  text-align: center;
  padding: 1rem;
  color: #666;
`;

const MobileSimilarDetail = ({ onClose, similarTexts }) => {
  const [selectedIndex, setSelectedIndex] = useState(0); // 선택된 index를 저장하는 state
  const [analysis, setAnalysis] = useState({
    overview: "",
    characteristics: "",
    significance: ""
  });
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setShowAnalysis(true);
  
    const pTitle = similarTexts[selectedIndex]?.title || "제목 없음";

    try {
      const response = await fetch(`${Config.baseURL}/api/analyze`, {
        method: "POST",
        headers: Config.headers,
        body: JSON.stringify({
          title: pTitle // 실제로는 props로 전달받은 제목 사용
        })
      });

      if (!response.ok) {
        throw new Error("Analysis request failed");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, limit) => {
    const cleanedText = text.replace(/^["*]+|["*]+$/g, "");
    return cleanedText.length > limit ? cleanedText.substring(0, limit) + "..." : cleanedText;
  };

  return (
    <Wrapper>
      {/* 상단 헤더 */}
      <Header>
        <Title>유사한 단락</Title>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>

      {loading ? (
        <LoadingSection>
          <GridLoader color="#007afe" size={15} />
          <p>AI가 작품을 분석하고 있습니다...</p>
        </LoadingSection>
      ) : (
        <>
          {/* similarTexts 리스트 */}
          <Section>
            <SectionTitle>유사 단락 리스트</SectionTitle>
            {similarTexts.map((text, index) => (
              <SimilarBox
                key={index}
                isSelected={selectedIndex === index} // 선택된 항목 여부 전달
                onClick={() => setSelectedIndex(index)} // 클릭 시 selectedIndex 업데이트
              >
                {truncateText(`${text.paragraph}`, 21)}
              </SimilarBox>
            ))}
          </Section>

          <Section>
            <SectionTitle>제목</SectionTitle>
            <Title>{similarTexts[selectedIndex]?.title}</Title>
          </Section>
          <Section>
            <SectionTitle>단락</SectionTitle>
            <SectionContent>{similarTexts[selectedIndex]?.paragraph}</SectionContent>
          </Section>

          {similarTexts[selectedIndex]?.summary !== "요약 없음" && (
            <Section>
              <SectionTitle>작품 요약</SectionTitle>
              <SectionContent>{similarTexts[selectedIndex]?.summary}</SectionContent>
            </Section>
          )}

          {!showAnalysis && (
            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={loading}
            >
              AI 분석 시작하기
            </AnalyzeButton>
          )}

          {showAnalysis && (
            <DetailSection>
              <Section>
                <AiSectionTitle>개요</AiSectionTitle>
                <MarkdownContent>
                  <ReactMarkdown>{analysis.overview}</ReactMarkdown>
                </MarkdownContent>
              </Section>
              <Section>
                <AiSectionTitle>주요 특징</AiSectionTitle>
                <MarkdownContent>
                  <ReactMarkdown>{analysis.characteristics}</ReactMarkdown>
                </MarkdownContent>
              </Section>
              <Section>
                <AiSectionTitle>문학사적 의의</AiSectionTitle>
                <MarkdownContent>
                  <ReactMarkdown>{analysis.significance}</ReactMarkdown>
                </MarkdownContent>
              </Section>
            </DetailSection>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default MobileSimilarDetail;