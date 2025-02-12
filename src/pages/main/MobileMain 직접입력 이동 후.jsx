import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import contentData from '../../assets/content_clf.json'
import MobileHamburgerButton from '../../components/hamburger/MobileHamburgerButton'
import MobileSideMenu from '../../components/sidemenu/MobileSideMenu'
import { handleCreate } from '../../api/handleCreate'
import { GridLoader } from 'react-spinners'
import ArrowIcon from '../../assets/arrow.png'

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${(props) =>
    props.isDetailVisible ? 'flex-start' : 'center'};
  width: 100%;
  height: ${(props) =>
    props.isDetailVisible ? 'auto' : '50vh'}; /* 상세 설정에 따라 높이 조정 */
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1); /* 부드러운 전환 효과 */
  margin-top: ${(props) => (props.isDetailVisible ? '0' : '10vh')};
`

const SummaryContainer = styled.div`
  padding: 1rem;
  width: 90%;
`

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const SummaryTag = styled.div`
  background-color: #007afe;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`

const MobileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100vh;
  background-color: #f3f3f3;
`

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
`

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 91%;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1vh;
`

const Title = styled.h1`
  width: 100%;
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 0 18vw;
`

const Subtitle = styled.h2`
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin: 0;
`

const ContentInputField = styled.textarea`
  width: 90%;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 1px solid #ccc;
  resize: none; /* 사용자가 크기 조정 불가능 */
  border-radius: 5px;
  min-height: 10vh; /* 기본 높이 */
  max-height: 50vh; /* 최대 높이 지정 */
  overflow-x: hidden; /* 좌우 스크롤 막기 */
  overflow-y: auto; /* 위아래 스크롤 허용 */
  font-size: 1rem;
  line-height: 1.5;
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
`

const CreateButton = styled.button`
  width: 90%;
  padding: 0.8rem;
  margin-bottom: 0vh;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#007afe')};
  color: ${(props) => (props.disabled ? '#666' : 'white')};
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: ${(props) => (props.disabled ? '#ccc' : '#555')};
  }
`

// 화살표 버튼 스타일 정의
const ArrowButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0vh;

  img {
    width: 4rem; /* 아이콘 크기 */
    height: ${(props) =>
      props.isOpen ? '0.6rem' : '2rem'}; /* 상태에 따라 높이 조정 */
    transform: ${(props) =>
      props.isOpen ? 'scaleY(-1)' : 'scaleY(1)'}; /* Y축 반전 */
    transition: transform 0.5s ease; /* 부드럽게 뒤집기 */
  }

  p {
    font-size: 1rem; /* 글씨 크기 */
    margin: ${(props) =>
      props.isOpen ? '0.6rem 0 0.3rem 0' : '6rem 0 0.2rem 0'}; /* 여백 조정 */
    text-align: center; /* 텍스트 가운데 정렬 */
    transition: transform 0.5s ease; /* 부드럽게 뒤집기 */
  }
`

const SectionWrapper = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  display: ${(props) =>
    props.isVisible ? 'block' : 'none'}; /* 상세 설정 보기/숨기기 */
`

const Section = styled.div`
  background-color: white;
  margin-bottom: 0.3rem;
  padding: 0.3rem;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const TagContainer = styled.div`
  max-height: ${(props) =>
    props.isOpen ? '50rem' : '0'}; /* 열린 상태와 닫힌 상태 */
  overflow: hidden; /* 넘치는 내용 숨김 */
  transition: max-height 0.3s ease-in-out; /* 부드러운 애니메이션 */
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const Tag = styled.div`
  background-color: ${(props) => (props.isSelected ? '#007afe' : '#e0e0e0')};
  color: ${(props) => (props.isSelected ? '#fff' : '#333')};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.isSelected ? '#007afe' : '#d0d0d0')};
  }
`

const CustomTagInput = styled.input`
  padding: 0.5rem 1rem;
  margin-left: 1vw;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 0.9rem;
  width: ${(props) =>
    props.value.length > 0
      ? `${props.value.length * 3}vw`
      : '25vw'}; /* 텍스트 길이에 따른 너비 조정 */
  min-width: 15vw; /* 최소 너비 설정 */
  max-width: 50vw; /* 최대 너비 설정 */
  transition: width 0.3s ease-in-out; /* 부드러운 너비 전환 효과 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
`

const CustomTagDiv = styled.div`
  position: relative;
  display: inline-block; /* 텍스트 길이에 따라 자동 조정 */
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 0.9rem;
  background-color: ${(props) => (props.isSelected ? '#2890ff' : '#e0e0e0')};
  color: ${(props) => (props.isSelected ? '#fff' : '#333')};
  margin-top: 0.5rem;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  text-overflow: ellipsis; /* 선택 사항: 넘칠 때 ... 처리 */
  max-width: 100%; /* 선택 사항: 너무 긴 텍스트 방지 */
  overflow: visible; /* 선택 사항: 넘치는 텍스트 숨김 */
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
  line-height: 1.2rem;
  text-align: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* 버튼에 그림자 추가 */

  &:hover {
    background: #ff0000;
  }
`

const SectionHeaderWrapper = styled.div`
  display: flex; /* Flex 레이아웃 사용 */
  justify-content: flex-start;
  align-items: center; /* 수직 정렬 */
  width: 100%; /* 부모 요소의 전체 너비 사용 */
  padding: 0.5rem 0; /* 상하 패딩 추가 */
  margin-bottom: 0.5rem; /* 하단 여백 */
`

const SectionHeader = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0 2vw 0.5rem 2vw;
`

const MobileMain = () => {
  const [customTags, setCustomTags] = useState({})
  const [inputText, setInputText] = useState({})
  const [selectedItems, setSelectedItems] = useState({})
  const [inputValue, setInputValue] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  useEffect(() => {
    localStorage.removeItem('content')
    localStorage.removeItem('ragResult')
    localStorage.removeItem('content_clf')
    localStorage.removeItem('fineTuningResult')
  }, [])

  useEffect(() => {
    localStorage.setItem('content_clf', JSON.stringify(selectedItems))
  }, [selectedItems])

  const toggleDetailView = () => {
    setIsDetailVisible((prev) => !prev)
  }

  const handleTextareaResize = (e) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 30 * 16)}px`
  }

  const handleTagClick = (section, item) => {
    setSelectedItems((prev) => {
      const sectionItems = prev[section] || []
      const updatedItems = sectionItems.includes(item)
        ? sectionItems.filter((tag) => tag !== item)
        : [...sectionItems, item]
      return { ...prev, [section]: updatedItems }
    })
  }

  const handleInputChange = (key, value) => {
    setInputText((prev) => ({ ...prev, [key]: value }))
  }

  const handleInputSubmit = (key, value) => {
    if (value.trim()) {
      setCustomTags((prev) => {
        const inputs = prev[key] || []
        return { ...prev, [key]: [...inputs, { value, fixed: true }] }
      })

      setSelectedItems((prev) => {
        const sectionItems = prev[key] || []
        const updatedItems = [...sectionItems, value]
        const updatedState = { ...prev, [key]: updatedItems }

        // 로컬 스토리지에 저장
        localStorage.setItem('content_clf', JSON.stringify(updatedState))

        return updatedState
      })

      setInputText((prev) => ({ ...prev, [key]: '' }))
    }
  }

  const handleKeyDown = (e, key) => {
    if (e.key === 'Enter') handleInputSubmit(key, inputText[key])
  }

  const handleDeleteTag = (key, value) => {
    console.log(
      '-Before selectedItems:\n' + JSON.stringify(selectedItems, null, 2),
    )
    console.log('-handleDeleteTagkey' + key + 'value' + value)
    // customTags 상태 업데이트
    setCustomTags((prev) => {
      const updated = prev[key]?.filter((item) => item.value !== value)
      const newCustomTags = { ...prev, [key]: updated }

      // 로컬스토리지 업데이트 (customTags)
      const localStorageData =
        JSON.parse(localStorage.getItem('content_clf')) || {}
      if (updated.length === 0) {
        delete localStorageData[key]
      } else {
        localStorageData[key] = updated.map((item) => item.value)
      }
      localStorage.setItem('content_clf', JSON.stringify(localStorageData))

      return newCustomTags
    })

    // selectedItems 상태 업데이트
    setSelectedItems((prev) => {
      const updated = prev[key]?.filter((item) => item !== value) // key의 index에 해당하는 item만 삭제
      const newSelectedItems = { ...prev, [key]: updated }

      // 로컬스토리지 업데이트 (selectedItems)
      const localStorageData =
        JSON.parse(localStorage.getItem('content_clf')) || {}
      if (updated.length === 0) {
        delete localStorageData[key]
      } else {
        localStorageData[key] = updated
      }
      localStorage.setItem('content_clf', JSON.stringify(localStorageData))

      return newSelectedItems
    })

    console.log(
      '-After selectedItems:\n' + JSON.stringify(selectedItems, null, 2),
    )
  }

  const handleCreateClick = async () => {
    setIsLoading(true)
    try {
      await handleCreate({ inputValue, selectedItems })
      navigate('/result')
    } catch (error) {
      console.error('Error during story creation:', error)
      alert('스토리 생성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
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
          <MobileSideMenu isOpen={isMenuOpen} onClose={closeMenu} />
          <Header>
            <MobileHamburgerButton onClick={toggleMenu} />
            <Title>고전스토리 생성</Title>
          </Header>

          <ContentContainer isDetailVisible={isDetailVisible}>
            <Subtitle>간단한 설정으로</Subtitle>
            <Subtitle>고전 이야기를 만들어 보세요</Subtitle>
            <ContentInputField
              placeholder="예) 조선시대 한 선비가 과거시험..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                handleTextareaResize(e)
              }}
            />
            <CreateButton
              onClick={handleCreateClick}
              disabled={!inputValue.trim()}
            >
              생성하기
            </CreateButton>

            {!isDetailVisible && (
              <SummaryContainer>
                <TagList>
                  {Object.keys(selectedItems).flatMap((key) =>
                    selectedItems[key]?.map((item, index) => (
                      <SummaryTag
                        key={`${key}-${index}`}
                        onClick={() => handleDeleteTag(key, item)} // SummaryTag 클릭 시 삭제 처리
                      >
                        {item}
                      </SummaryTag>
                    )),
                  )}
                </TagList>
              </SummaryContainer>
            )}

            <ArrowButton onClick={toggleDetailView} isOpen={isDetailVisible}>
              <p>{isDetailVisible ? '' : '상세 설정 보기'}</p>
              <img src={ArrowIcon} alt="화살표 아이콘" />
              <p>{isDetailVisible ? '상세 설정 접기' : ''}</p>
            </ArrowButton>
          </ContentContainer>

          {Object.keys(contentData).map((key) => (
            <SectionWrapper key={key} isVisible={isDetailVisible}>
              <Section>
                <SectionHeaderWrapper>
                  <SectionHeader>{key}</SectionHeader>
                  <CustomTagInput
                    value={inputText[key] || ''} // inputText[key]가 undefined일 경우 빈 문자열로 처리
                    placeholder="직접 입력"
                    maxLength={10}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    onBlur={() => handleInputSubmit(key, inputText[key] || '')} // undefined 방지
                    onKeyDown={(e) => handleKeyDown(e, key)}
                    valueLength={(inputText[key] || '').length} // 글자 수 전달
                  />
                </SectionHeaderWrapper>
                <TagContainer isOpen={true}>
                  {contentData[key].map((item, index) => (
                    <Tag
                      key={`${key}-${index}`}
                      isSelected={selectedItems[key]?.includes(item) || false}
                      onClick={() => handleTagClick(key, item)}
                    >
                      {item}
                    </Tag>
                  ))}
                  {(customTags[key] || []).map((input, index) => (
                    <CustomTagDiv
                      key={`${key}-${index}`}
                      isSelected={
                        selectedItems[key]?.includes(input.value) || false
                      }
                      onClick={(e) => {
                        e.stopPropagation() // 이벤트 버블링 방지
                        handleDeleteTag(key, input.value) // CustomTagDiv 클릭 시 삭제 처리
                      }}
                    >
                      {input.value}
                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation() // DeleteButton 클릭 이벤트 버블링 방지
                          handleDeleteTag(key, input.value) // DeleteButton 클릭 시 삭제 처리
                        }}
                      >
                        x
                      </DeleteButton>
                    </CustomTagDiv>
                  ))}
                </TagContainer>
              </Section>
            </SectionWrapper>
          ))}
        </>
      )}
    </MobileWrapper>
  )
}

export default MobileMain
