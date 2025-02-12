import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import MobileHamburgerButton from '../../components/hamburger/MobileHamburgerButton'
import MobileSideMenu from '../../components/sidemenu/MobileSideMenu'
import MobileEdit from '../../components/edit/MobileStoryEdit'
import MobileSimilarDetail from '../../components/similarDetail/MobileSimilarDetail'
import HomeIcon from '../../components/homeIcon/HomeIcon'
import EditIcon from '../../assets/edit_pencil.png'
import { handleCreate } from '../../api/handleCreate'
import { GridLoader } from 'react-spinners'

// 스타일 정의
const MobileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  max-height: 500%; /* 최대 높이를 화면(viewport)의 90%로 제한 */
  background-color: #f3f3f3;
  overflow-y: auto; /* 내용이 넘치면 세로 스크롤 추가 */
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 91%;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1vh;
`

const IconSection = styled.div`
  display: flex;
  align-items: center; /* 수직 정렬 */
  gap: 0.5rem; /* 요소 간 간격 추가 */
`

const Title = styled.h1`
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  margin-left: 2vw;
`

const SettingButton = styled.button`
  display: flex;
  margin-right: 3vw;
  cursor: pointer;
  background: none;
  border: none;
  justify-content: center;

  img {
    width: 1.5rem; /* 아이콘 크기 */
    height: 1.5rem;
  }
`

const ContentBox = styled.div`
  width: 90%;
  padding: 1rem;
  background-color: #fff;
  border: 0.1rem solid #ffffff;
  border-radius: 10px;
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const ContentTitle = styled.div`
  font-weight: bold;
  font-size: 1rem;
  color: #000000;
  margin-bottom: 0.5rem;
`

const ContentText = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0 0 2vh 0;
  line-height: 1.5;
`

const ResultBox = styled.div`
  width: 90%;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 10px;
  margin: 0.5rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const ResultTitle = styled.div`
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333;
`

const ResultText = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0;
  line-height: 1.5;
`

const SimilarHeader = styled.div`
  width: 90%;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.2rem; /* 폰트 크기 증가 */
  color: #007afe; /* 강조를 위한 파란색 */
  text-align: center; /* 중앙 정렬 */
  background-color: #f0f8ff; /* 연한 파란색 배경 추가 */
  padding: 0.5rem; /* 텍스트 주변 여백 추가 */
  border-radius: 10px; /* 부드러운 모서리 */
`

// const SimilarContainer = styled.div`
//   display: flex;
//   justify-content: space-around;
//   width: 90%;
//   margin: 1rem 0;
// `;

// const SimilarBox = styled.div`
//   flex: 1;
//   text-align: center;
//   margin: 0 0.5rem;
//   padding: 0.5rem 1rem;
//   background-color: #ffffff;
//   border-radius: 20px;
//   font-weight: bold;
//   color: #333;
// `;

const RecommendationHeader = styled.div`
  width: 90%;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.2rem; /* 폰트 크기 증가 */
  color: #007afe; /* 강조를 위한 파란색 */
  text-align: center; /* 중앙 정렬 */
  // background-color: #f0f8ff; /* 연한 파란색 배경 추가 */
  padding: 0.5rem; /* 텍스트 주변 여백 추가 */
  border-radius: 10px; /* 부드러운 모서리 */
`

const RecommendationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin: 1rem 0;
`

const RecommendationBox = styled.div`
  width: 100%;
  text-align: left;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  border-radius: 10px;
  font-weight: bold;
  color: #333;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  width: 90%;
  max-height: 90%;
  background-color: white;
  border-radius: 8px;
  overflow-y: auto;
  padding: 1rem;
`

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const MobileResult = () => {
  const [userContent, setUserContent] = useState('') // 사용자 입력 내용
  const [isMenuOpen, setIsMenuOpen] = useState(false) // 사이드 메뉴 상태
  const [isSettingOpen, setIsSettingOpen] = useState(false) // 설정 메뉴 상태
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [similarTexts, setSimilarTexts] = useState([]) // 유사 단락 텍스트 저장
  const [selectedText, setSelectedText] = useState(null) // 선택된 데이터 저장
  const [contentClf, setContentClf] = useState(null) // content_clf 데이터 저장
  const [aiResult, setAiResult] = useState('') // AI 생성 결과
  const [title, setTitle] = useState('생성된 이야기') // AI 생성 단락 제목
  const [recommendations, setRecommandations] = useState([]) // 추천 이야기
  const [selectedItems, setSelectedItems] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  const closeSetting = () => setIsSettingOpen(false)
  const toggleSetting = () => {
    // 로컬스토리지에서 content_clf 가져오기
    const storedContentClf =
      JSON.parse(localStorage.getItem('content_clf')) || {}
    setContentClf(storedContentClf)
    setIsSettingOpen((prev) => !prev)
  }

  const openDetail = (index) => {
    setSelectedText(similarTexts[index]) // 클릭된 데이터를 상태에 저장
    setIsDetailOpen(true) // 모달 열기
  }

  const closeDetail = () => {
    setSelectedText(null) // 선택된 데이터 초기화
    setIsDetailOpen(false) // 모달 닫기
  }

  // 로컬스토리지에서 사용자 입력값 불러오기
  useEffect(() => {
    const ragResult = JSON.parse(localStorage.getItem('ragResult')) || []
    if (Array.isArray(ragResult)) {
      const texts = ragResult.map((item) => ({
        content: item.content || '내용 없음',
        title: item.metadata?.작품명 || '제목 없음',
        country: item.metadata?.국가 || '내용 없음',
        paragraphNum: item.metadata?.단락일련번호 || '내용 없음',
        paragraph: item.metadata?.단락데이터 || '내용 없음',
        summary: item.metadata?.요약문 || '요약 없음',
      }))
      setSimilarTexts(texts)
    }
  }, [])

  useEffect(() => {
    // 사용자 입력 내용 불러오기
    const content = localStorage.getItem('content')
    if (content) setUserContent(content)

    // 로컬스토리지에서 content_clf 데이터 불러오기
    const contentClf = JSON.parse(localStorage.getItem('content_clf')) || {}
    setSelectedItems(contentClf)

    // Fine-tuning API 결과 불러오기
    const fineTuningResult = localStorage.getItem('fineTuningResult')
    if (fineTuningResult) {
      try {
        const parsedResult = JSON.parse(fineTuningResult)
        setAiResult(
          parsedResult.content || 'AI 생성 결과를 불러올 수 없습니다.',
        )
        setTitle(parsedResult.title || '생성된 이야기')
        setRecommandations(parsedResult.recommendations || [])
        // recommendations 처리 로직 수정
        if (Array.isArray(parsedResult.recommendations)) {
          // console.log("Loaded recommendations:", parsedResult.recommendations); // 디버깅용
          setRecommandations(parsedResult.recommendations)
        } else {
          console.warn(
            'Recommendations is not an array:',
            parsedResult.recommendations,
          )
          setRecommandations([])
        }
      } catch (error) {
        console.error('Error parsing fine-tuning result:', error)
        setAiResult('AI 생성 결과를 불러올 수 없습니다.')
      }
    }
  }, [])

  const truncateText = (text, limit) => {
    // 앞뒤에 있는 특정 문자 제거 (", **)
    const cleanedText = text.replace(/^["*]+|["*]+$/g, '')

    if (cleanedText.length > limit) {
      return cleanedText.substring(0, limit) + '...'
    }
    return cleanedText
  }

  const handleRecommendationClick = async (recommendation) => {
    setIsLoading(true)
    try {
      // 로컬스토리지의 모든 내용 제거
      localStorage.removeItem('ragResult')
      localStorage.removeItem('fineTuningResult')
      localStorage.setItem('content_clf', JSON.stringify({}))
      localStorage.setItem('content', recommendation)
      await handleCreate({ inputValue: recommendation, selectedItems: {} }) // recommendation을 inputValue로 전달
      console.log(`handleCreate executed with inputValue: ${recommendation}`)
    } catch (error) {
      console.error('Error executing handleCreate:', error)
    } finally {
      setIsLoading(false)
      window.location.reload()
    }
  }

  return (
    <MobileWrapper>
      {isLoading ? (
        <SpinnerWrapper>
          <GridLoader color="#007afe" />
          <h> 이야기를 생성하고 있어요. </h>
        </SpinnerWrapper>
      ) : (
        <>
          {/* 상단 히스토리메뉴 버튼 및 제목 */}
          <Header>
            <IconSection>
              <MobileHamburgerButton onClick={toggleMenu} />
              <HomeIcon onClick={() => console.log('Home clicked!')} />
              <Title>고전스토리 생성</Title>
            </IconSection>
          </Header>

          {/* 히스토리 메뉴 */}
          <MobileSideMenu isOpen={isMenuOpen} onClose={closeMenu} />

          {/* 설정 메뉴 */}
          {isSettingOpen && (
            <MobileEdit
              onClose={closeSetting}
              userContent={userContent}
              contentClf={contentClf} // content_clf 데이터 전달
            />
          )}
          {/* 사용자 입력 내용 */}
          <ContentBox>
            <ResultHeader>
              <ContentTitle>사용자 입력 내용</ContentTitle>
              <SettingButton onClick={toggleSetting}>
                <img src={EditIcon} alt="Settings" />
              </SettingButton>
            </ResultHeader>
            <ContentText>
              {userContent || '사용자 입력 내용이 없습니다.'}
            </ContentText>
            {/* 선택한 옵션 보기 */}
            <hr />
            {selectedItems && Object.keys(selectedItems).length > 0 ? (
              <div style={{ color: '#007afe' }}>
                {' '}
                {/* 글자색을 파란색으로 변경 */}
                {Object.keys(selectedItems)
                  .flatMap((key) => selectedItems[key] || [])
                  .join(', ')}
              </div>
            ) : (
              <div style={{ color: '#333' }}></div> // 입력된 옵션이 없을 때 표시
            )}
          </ContentBox>

          {/* AI 생성 결과 */}
          <ResultBox>
            <ResultHeader>
              <ResultTitle>AI 생성 결과</ResultTitle>
            </ResultHeader>
            <Title>{truncateText(title, 15)}</Title>
            <ResultText>{aiResult}</ResultText>
          </ResultBox>

          {/* 유사한 고전 단락 섹션 ⓘ */}
          {similarTexts.length > 0 && (
            <SimilarHeader onClick={() => openDetail(0)}>
              유사한 고전 단락보기
            </SimilarHeader>
          )}

          {/* <SimilarContainer>
            {similarTexts.map((text, index) => (
              <SimilarBox key={index} onClick={() => openDetail(index)}>
                {truncateText(`${text.paragraph}`, 21)}
              </SimilarBox>
            ))}
          </SimilarContainer> */}

          {/* 모달 - MobileSimilarDetail */}
          {isDetailOpen && selectedText && (
            <ModalOverlay onClick={closeDetail}>
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <MobileSimilarDetail
                  onClose={closeDetail}
                  similarTexts={similarTexts}
                  data={selectedText}
                />
              </ModalContent>
            </ModalOverlay>
          )}

          {/* 추천 이야기 섹션 */}
          {/* <RecommendationHeader>ⓘ 추천 이야기</RecommendationHeader> */}
          <RecommendationHeader>
            이런 이야기로 생성해보세요!
          </RecommendationHeader>
          <RecommendationContainer>
            {recommendations.map((recommendation, index) => (
              <RecommendationBox
                key={index}
                onClick={() => handleRecommendationClick(recommendation)}
              >
                {recommendation}
              </RecommendationBox>
            ))}
          </RecommendationContainer>
        </>
      )}
    </MobileWrapper>
  )
}

export default MobileResult
