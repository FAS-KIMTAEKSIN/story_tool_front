import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import contentData from '../../assets/content_clf.json'; // JSON 파일 불러오기
import MobileHamburgerButton from '../../components/hamburger/MobileHamburgerButton';
import MobileSideMenu from '../../components/sidemenu/MobileSideMenu';

// 스타일 정의
const MobileWrapper = styled.div`
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
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1vh;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const Subtitle = styled.h2`
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin: 0;
`;

const ContentInputField = styled.input`
  width: 90%;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 90%;
  padding: 0.8rem;
  margin-bottom: 2vh;
  background-color: #007afe;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #555;
  }
`;

const SectionWrapper = styled.div`
  width: 100%;
  margin-top: 0.5rem;
`;

const Section = styled.div`
  background-color: white;
  margin-bottom: 0.3rem;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

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
`;

const CustomTagInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 0.9rem;
  width: 15vw;
`;

const CustomTagDiv = styled.div`
  position: relative;
  display: inline-block; /* 텍스트 길이에 따라 자동 조정 */
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 0.9rem;
  background-color: ${(props) => (props.isSelected ? '#007afe' : '#e0e0e0')};
  color: ${(props) => (props.isSelected ? '#fff' : '#333')};
  margin-top: 0.5rem;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  text-overflow: ellipsis; /* 선택 사항: 넘칠 때 ... 처리 */
  max-width: 100%; /* 선택 사항: 너무 긴 텍스트 방지 */
  overflow: visible; /* 선택 사항: 넘치는 텍스트 숨김 */
`;

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
`;

const MobileMain = () => {
  const [customTags, setCustomTags] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 열림 상태 관리
  const navigate = useNavigate(); // 페이지 이동 함수

  // 메뉴 열림/닫힘 함수
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // 로컬스토리지에서 데이터 불러오기
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('content_clf')) || {};
    setSelectedItems(savedData);
  }, []);

  // 상태 변경 시 로컬스토리지에 저장
  useEffect(() => {
    localStorage.setItem('content_clf', JSON.stringify(selectedItems));
  }, [selectedItems]);

  // 선택된 태그 클릭 핸들러
  const handleTagClick = (section, item) => {
    setSelectedItems((prev) => {
      const sectionItems = prev[section] || [];
      const updatedItems = sectionItems.includes(item)
        ? sectionItems.filter((tag) => tag !== item) // 선택 해제
        : [...sectionItems, item]; // 선택 추가

      return { ...prev, [section]: updatedItems }; // 섹션별로 업데이트
    });
  };

  // 입력 필드 값 변경
  const handleInputChange = (key, index, value) => {
    setCustomTags((prevCustomTags) => {
      const inputs = prevCustomTags[key] || [{ value: '', fixed: false }];
      inputs[index] = { ...inputs[index], value };
      return { ...prevCustomTags, [key]: [...inputs] };
    });
  };

  // 입력 필드 포커스 아웃 시 수정 불가능 상태로 변경 및 새 필드 추가
  const handleInputBlur = (key, index, value) => {
    if (value.trim()) {
      setCustomTags((prevCustomTags) => {
        const inputs = prevCustomTags[key] || [{ value: '', fixed: false }];
        inputs[index] = { ...inputs[index], fixed: true };
  
        if (index === inputs.length - 1) {
          inputs.push({ value: '', fixed: false }); // 새 빈 필드 추가
        }
        return { ...prevCustomTags, [key]: [...inputs] };
      });
  
      setSelectedItems((prevSelected) => {
        const currentItems = prevSelected[key] || [];
        const updatedItems = currentItems.includes(value)
          ? currentItems
          : [...currentItems, value];
  
        return { ...prevSelected, [key]: updatedItems }; // 섹션별로 업데이트
      });
    }
  };
  

  // 태그 삭제
  const handleDeleteTag = (key, index, value) => {
    setCustomTags((prevCustomTags) => {
      const inputs = prevCustomTags[key]?.filter((_, i) => i !== index);
      return { ...prevCustomTags, [key]: inputs };
    });

    // 선택된 항목에서 제거
    setSelectedItems((prevSelected) =>
      prevSelected.filter((selected) => selected !== value)
    );
  };

  // 생성하기 버튼 클릭 핸들러
  const handleCreate = () => {
    if (inputValue.trim()) {
      localStorage.setItem('content', inputValue); // 입력값을 로컬스토리지에 저장
      navigate('/result'); // /result 페이지로 이동
    } else {
      alert('내용을 입력해주세요.');
    }
  };

  return (
    <MobileWrapper>
      <MobileSideMenu isOpen={isMenuOpen} onClose={closeMenu} />
      
      {/* 햄버거 버튼과 Title */}
      {/* 위치 때문에 빈 Title추가 */}
      <Header>
        <MobileHamburgerButton onClick={toggleMenu} />
        <Title>어플리케이션 이름</Title>
        <Title></Title>
      </Header>
      
      <Subtitle>간단한 설정으로</Subtitle>
      <Subtitle>고전 이야기를 만들어 보세요</Subtitle>

      <ContentInputField
        placeholder="간단한 줄거리를 입력해주세요"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      
      {/* 생성하기 버튼 */}
      <Button onClick={handleCreate}>생성하기</Button>

      {Object.keys(contentData).map((key) => (
        <SectionWrapper key={key}>
          <Section>
            <SectionTitle>{key}</SectionTitle>
            <TagContainer>
              {contentData[key].map((item, index) => (
                <Tag
                  key={index}
                  isSelected={selectedItems[key]?.includes(item) || false}
                  onClick={() => handleTagClick(key, item)} // key는 카테고리 이름
                >
                  {item}
                </Tag>
              ))}

              {(customTags[key] || [{ value: '', fixed: false }]).map((input, index) =>
                input.fixed ? (
                  <CustomTagDiv
                    key={`fixed-${index}`}
                    isSelected={selectedItems[key]?.includes(input.value) || false}
                    onClick={() => {
                      setSelectedItems((prevSelected) => {
                        const currentItems = prevSelected[key] || [];
                        const isAlreadySelected = currentItems.includes(input.value);

                        const updatedItems = isAlreadySelected
                          ? currentItems.filter((item) => item !== input.value) // 선택 해제
                          : [...currentItems, input.value]; // 선택 추가

                        return { ...prevSelected, [key]: updatedItems };
                      });
                    }}
                  >
                    {input.value}
                    <DeleteButton onClick={() => handleDeleteTag(key, index, input.value)}>
                      x
                    </DeleteButton>
                  </CustomTagDiv>

                ) : (
                  <CustomTagInput
                    key={`input-${index}`}
                    value={input.value}
                    placeholder="직접 입력"
                    maxLength={10} // 최대 10글자까지 입력
                    onChange={(e) =>
                      handleInputChange(key, index, e.target.value)
                    }
                    onBlur={() => handleInputBlur(key, index, input.value)}
                  />
                )
              )}
            </TagContainer>
          </Section>
        </SectionWrapper>
      ))}
    </MobileWrapper>
  );
};

export default MobileMain;
