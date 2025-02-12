import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import contentData from '../../assets/content_clf.json'
import { handleCreate } from '../../api/handleCreate'
import { useNavigate } from 'react-router-dom'
import { GridLoader } from 'react-spinners'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  // backdrop-filter: blur(5px); /* 블러 효과 */
  z-index: 999; /* SettingWrapper 아래에 오도록 설정 */
`

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
`

const SettingWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  height: 100%;
  background-color: #f3f3f3;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 0 3vw 10vh 3vw;
  box-sizing: border-box;
  overflow-y: auto;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HorizontalLine = styled.hr`
  border: none;
  border-top: 0.4vw solid #ccc;
  margin: 0 3vw 0 0;
`

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
`

const CloseButton = styled.button`
  font-size: 1.5rem;
  font-weight: bold;
  background: none;
  border: none;
  margin-right: 2vw;
  cursor: pointer;
`

const ContentSection = styled.div`
  margin: 1rem 0;
`

const SectionOpen = styled.div`
  display: flex;
  padding: 0.5rem 1rem 0.5rem 0;
  justify-content: space-between; /* 공간을 양쪽으로 분리 */
  align-items: center;
  white-space: nowrap;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
`

const Section = styled.div`
  margin: 0.1rem 0;
`

const SectionHeader = styled.div`
  display: flex;
  padding: 0.5rem 0;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;

  /* &::after {
    content: '▼';
    font-size: 1rem;
    margin-right: 10vw;
    transform: ${(props) => (props.isOpen ? 'scaleY(-1)' : 'scaleY(1)')};
    transition: transform 0.3s ease;
  } */
`

const SelectedTagsText = styled.span`
  color: #007bff;
  font-size: 0.9rem;
  margin-left: 1rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const UserContentBox = styled.textarea`
  width: 90%;
  background-color: #f9f9f9;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
  overflow-y: auto; /* 위아래 스크롤 허용 */
  line-height: 1.5;
  box-sizing: border-box;
  min-height: 1vh; /* 기본 높이 */
  max-height: 50vh; /* 최대 높이 */
  resize: none; /* 사용자 크기 조정 불가 */
  transition: height 0.2s ease; /* 부드러운 전환 */
`

const TagContainer = styled.div`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.3rem 0;
`

const Tag = styled.div`
  background-color: ${(props) => (props.isSelected ? '#007bff' : '#e0e0e0')};
  color: ${(props) => (props.isSelected ? '#fff' : '#333')};
  padding: 0.5rem 1rem;
  margin: 1vh 0 0 0;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  height: 2.5vh;

  &:hover {
    background-color: ${(props) => (props.isSelected ? '#0056b3' : '#d0d0d0')};
  }
`

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`

const InputField = styled.input`
  width: 88%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 0.5rem;
`

const ApplyButton = styled.button`
  padding: 0.3rem 0.5rem;
  width: 25%;
  background-color: ${(props) => (props.isDisabled ? '#ccc' : '#007bff')};
  color: ${(props) => (props.isDisabled ? '#000000' : '#ffffff')};
  border: none;
  border-radius: 5px;
  white-space: nowrap;
  cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: ${(props) => (props.isDisabled ? '#ccc' : '#0056b3')};
  }
`

const CustomTagDiv = styled.div`
  position: relative;
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 1.5rem;
  font-size: 0.9rem;
  background-color: #007bff;
  color: #fff;
  margin-top: 0.5rem;
`

const DeleteButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff5b5b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  font-size: 0.8rem;
`

const ConfirmButtonDiv = styled.div`
  position: fixed;
  bottom: 0rem; /* 화면 하단에서의 거리 */
  right: 0rem; /* 화면 우측에서의 거리 */
  width: 70%;
  background-color: #f3f3f3;
  cursor: pointer;
  z-index: 1050; /* 다른 요소 위로 표시 */
`

const ConfirmButton = styled.button`
  width: 100%; /* 크기 자동 조정 */
  padding: 1rem 2rem;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 1.2rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* 약간의 그림자 */
  cursor: pointer;
  z-index: 1051; /* 다른 요소 위로 표시 */

  &:hover {
    background-color: #0056b3;
  }
`

// const ConfirmButton = styled.button`
//   position: fixed;
//   bottom: 2rem; /* 화면 하단에서의 거리 */
//   right: 2rem; /* 화면 우측에서의 거리 */
//   width: auto; /* 크기 자동 조정 */
//   padding: 1rem 2rem;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   border-radius: 50px; /* 둥근 모서리 */
//   font-size: 1.2rem;
//   box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* 약간의 그림자 */
//   cursor: pointer;
//   z-index: 1051; /* 다른 요소 위로 표시 */

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

const MobileStorySetting = ({
  onClose,
  userContent: initialContent,
  contentClf,
}) => {
  const [userContent, setUserContent] = useState(initialContent)
  const [selectedTags, setSelectedTags] = useState({})
  const [customTags, setCustomTags] = useState({})
  const [isAllOpen, setIsAllOpen] = useState(true) // 모든 섹션의 열림 상태
  const navigate = useNavigate() // 페이지 이동 함수
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태 추가
  const userContentRef = useRef(null)

  useEffect(() => {
    // console.log("Received contentClf:", contentClf);
    setSelectedTags(contentClf)
  }, [contentClf])

  // userContent 변경 시 높이 조정
  useEffect(() => {
    handleTextareaResize(userContentRef.current)
  }, [userContent])

  const handleUserContentChange = (e) => {
    setUserContent(e.target.value) // userContent 업데이트
  }

  const handleTextareaResize = (element) => {
    if (!element) return
    element.style.height = 'auto' // 높이 초기화
    element.style.height = `${Math.min(element.scrollHeight, 50 * 16)}px` // 최대 높이 제한 (50vh)
  }

  const handleTagClick = (section, tag) => {
    setSelectedTags((prev) => {
      const sectionTags = prev[section] || []
      const updatedTags = sectionTags.includes(tag)
        ? sectionTags.filter((t) => t !== tag)
        : [...sectionTags, tag]
      return { ...prev, [section]: updatedTags }
    })
  }

  const handleInputChange = (section, value) => {
    setCustomTags((prev) => ({ ...prev, [section]: value }))
  }

  const handleApplyClick = (section) => {
    const value = customTags[section]
    if (value?.trim()) {
      setSelectedTags((prev) => {
        const sectionTags = prev[section] || []
        return {
          ...prev,
          [section]: sectionTags.includes(value)
            ? sectionTags
            : [...sectionTags, value],
        }
      })
      setCustomTags((prev) => ({ ...prev, [section]: '' }))
    }
  }

  const handleKeyDown = (e, section) => {
    if (e.key === 'Enter') {
      handleApplyClick(section)
    }
  }

  const handleConfirmClick = async () => {
    setIsLoading(true) // 로딩 상태 시작
    try {
      localStorage.setItem('content_clf', JSON.stringify(selectedTags))

      // handleCreate 호출
      await handleCreate({
        inputValue: userContent, // userContent를 전달
        selectedItems: selectedTags, // selectedTags를 전달
      })

      // alert("스토리 생성이 완료되었습니다!");
      // 결과 페이지로 이동
      navigate('/result')
      window.location.reload()

      // 설정 창 닫기
      onClose()
    } catch (error) {
      console.error('Error during story creation:', error)
      alert('스토리 생성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false) // 로딩 상태 종료
    }
  }

  const handleOverlayClick = (e) => {
    // 설정 외부를 클릭하면 닫기
    if (e.target.id === 'overlay') {
      onClose()
    }
  }

  const handleSectionClick = () => {
    setIsAllOpen((prev) => !prev) // 모든 섹션의 상태를 토글
  }

  const handleDeleteCustomTag = (section, tag) => {
    setSelectedTags((prev) => {
      const updatedTags = prev[section]?.filter((t) => t !== tag)
      return { ...prev, [section]: updatedTags }
    })
  }

  return (
    <>
      <Overlay id="overlay" onClick={handleOverlayClick} />
      <SettingWrapper>
        {isLoading ? (
          <SpinnerWrapper>
            <GridLoader color="#007afe" />
            <h> 이야기를 다시 생성하고 있어요. </h>
          </SpinnerWrapper>
        ) : (
          <>
            <Header>
              <Title>스토리 설정</Title>
              <CloseButton onClick={onClose}>✕</CloseButton>
            </Header>
            <HorizontalLine />
            {/* <SectionHeader isOpen={isAllOpen} onClick={handleSectionClick}>
          {isAllOpen ? "모두 닫기" : "모두 열기"}
        </SectionHeader> */}

            {/* 사용자 입력 내용 표시 */}
            <ContentSection>
              <SectionOpen isOpen={isAllOpen} onClick={handleSectionClick}>
                <span>줄거리</span>
                <span>{isAllOpen ? '▲' : '▼'}</span>
              </SectionOpen>
              {isAllOpen && (
                <UserContentBox
                  ref={userContentRef}
                  value={userContent}
                  onChange={handleUserContentChange} // onChange 핸들러 추가
                />
              )}
              <HorizontalLine />
            </ContentSection>

            {Object.keys(contentData).map((section) => (
              <Section key={section}>
                <SectionHeader
                  isOpen={isAllOpen}
                  onClick={handleSectionClick} // SectionHeader 클릭 시 모든 섹션 열기/닫기
                >
                  {section}
                  <SelectedTagsText>
                    {(selectedTags[section] || []).join(', ')}
                  </SelectedTagsText>
                </SectionHeader>

                <TagContainer isOpen={isAllOpen}>
                  {/* 기존 태그 */}
                  {contentData[section].map((tag) => (
                    <Tag
                      key={tag}
                      isSelected={selectedTags[section]?.includes(tag)}
                      onClick={() => handleTagClick(section, tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                  {/* Custom Tags */}
                  {(selectedTags[section] || []).map(
                    (tag) =>
                      !contentData[section].includes(tag) && (
                        <CustomTagDiv key={tag}>
                          {tag}
                          <DeleteButton
                            onClick={() => handleDeleteCustomTag(section, tag)}
                          >
                            x
                          </DeleteButton>
                        </CustomTagDiv>
                      ),
                  )}
                  {/* <InputContainer>
                <InputField
                  type="text"
                  placeholder="직접 입력"
                  value={customTags[section] || ''}
                  maxLength={10}
                  onChange={(e) => handleInputChange(section, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, section)}
                />
                <ApplyButton
                  onClick={() => handleApplyClick(section)}
                  isDisabled={!customTags[section]?.trim()}
                >
                  적용
                </ApplyButton>
              </InputContainer> */}
                </TagContainer>
                <HorizontalLine />
              </Section>
            ))}
            <ConfirmButtonDiv>
              {isLoading ? (
                <GridLoader color="#007bff" size={15} />
              ) : (
                <ConfirmButton onClick={handleConfirmClick}>
                  다시 생성
                </ConfirmButton>
              )}
            </ConfirmButtonDiv>
          </>
        )}
      </SettingWrapper>
    </>
  )
}

export default MobileStorySetting
