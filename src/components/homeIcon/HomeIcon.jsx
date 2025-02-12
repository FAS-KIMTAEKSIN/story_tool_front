import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import HomeImage from "../../assets/Home.png"; // 이미지 경로 확인 필요

const StyledHomeIcon = styled.img`
  width: 7vw;
  margin-left: 10vw;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const HomeIcon = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  const handleClick = () => {
    navigate("/"); // 루트 경로로 이동
  };

  return <StyledHomeIcon src={HomeImage} alt="Home Icon" onClick={handleClick} />;
};

export default HomeIcon;
