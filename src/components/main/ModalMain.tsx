import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  padding-bottom: 1rem;
  border-radius: 12px;
  text-align: center;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-in-out;

  @keyframes slideIn {
    from {
      transform: translateY(-20%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.2rem;
  color: #000;
  margin-bottom: 1rem;
`;

const ModalSubTitle = styled.h4`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
`;

const ModalText = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0.5rem 0;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 1.5rem;
  margin-bottom: 0%.5;
`;

const ModalButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  background: #0078ff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #005bb5;
  }
`;

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>오늘 심부름은 마감되었습니다.</ModalTitle>
        <ModalSubTitle>내일 다시 이용해주세요. :)</ModalSubTitle>
        <ModalSubTitle>[운영시간]</ModalSubTitle>
        <ModalText>- 평일 : 09:00 ~ 15:00</ModalText>
        <ModalText>- 주말 : 09:00 ~ 12:00</ModalText>
        <ModalText>- 공휴일 : 09:00 ~ 13:00</ModalText>
        <ModalButtonGroup>
          <ModalButton onClick={onClose}>닫기</ModalButton>
        </ModalButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
