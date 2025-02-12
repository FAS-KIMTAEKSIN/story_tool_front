import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 70%;
  max-width: 400px;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #333;
`;

const ModalButton = styled.button`
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:nth-child(1) {
    background: #007afe;
    color: white;
  }

  &:nth-child(2) {
    background: #f0f0f0;
    color: #333;
  }
`;

const RecommendModal = ({ onConfirm, onCancel }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>이야기를 생성하시겠습니까?</ModalTitle>
        <ModalButton onClick={onConfirm}>확인</ModalButton>
        <ModalButton onClick={onCancel}>취소</ModalButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default RecommendModal;
