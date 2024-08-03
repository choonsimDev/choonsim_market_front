import { SecondaryButton } from "@/components/common/SecondaryButton";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
`;
const StyledImage = styled.img`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;
const Title = styled.h2`
  color: #242731;
  margin-bottom: 12px;
  font-size: 22px;
`;

const Divider = styled.div`
  border-bottom: 1px solid #ccc;
  width: 100%;
  height: 1px;
  padding-top: 18px;
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 100px;
`;

const BlueText = styled.span`
  color: #0038ff;
`;

const Description = styled.div`
  color: #646464;
  font-size: 16px;
  font-weight: bold;
  flex-direction: row;
  display: flex;
  text-align: center;
  justify-content: center;
`;
const SecondDescription = styled.div`
  color: #000;
  font-size: 18px;
  font-weight: bold;
  flex-direction: row;
  display: flex;
  text-align: center;
  justify-content: center;
`;

const CopyText = styled.div`
  padding-top: 32px;
  color: #858585;
  font-weight: bold;
  font-size: 18px;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;

const DepositContainer = styled.div`
  flex: 1;
  padding-top: 36px;
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

const BlockchainAddressContainer = styled.div`
  background-color: #f8f8f8;
  width: 80%;
  max-width: 400px;
  padding: 16px;
  margin-top: 16px;
  border-radius: 8px;
  display: inline-block;
`;

const BlockchainAddressText = styled.div`
  color: #0078ff;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  text-decoration: underline;
  margin-top: 16px;
  cursor: pointer;
  &:hover {
    color: #66adff;
  }
`;

interface SellThirdStepComponentProps {
  data: any;
  setStep: (step: number) => void;
}

export const SellThirdStepComponent: React.FC<SellThirdStepComponentProps> = ({
  data,
  setStep,
}) => {
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText("33zDCJtg8ugTnmSDdKTLivxBrcuJwAo8cB").then(
      () => {
        alert("주소가 클립보드에 복사되었습니다.");
      },
      (err) => {
        console.error("클립보드 복사에 실패했습니다.", err);
      }
    );
  };

  const onClickSubmit = async () => {
    setStep(4);
  };

  const formatNumber = (number: number) => {
    return number.toLocaleString();
  };

  return (
    <Container>
      <StyledImage src="/svg/img/progressbar-sell-03.png" alt="progress-bar" />
      <Title>
        아래 주소로 모빅을
        <BlueText> {data.amount}개</BlueText> 전송해주세요
      </Title>
      <Description>
        희망 가격 : {data.price}원 * <BlueText>&nbsp;{data.amount}개</BlueText>
      </Description>
      <Description>
        총 판매가 : {formatNumber(data.price * data.amount)}원
      </Description>
      <Divider />
      <DepositContainer>
        <Description>춘심 심부름 센터 공개주소</Description>

        <BlockchainAddressContainer>
          <img src="/svg/qr.svg" alt="qr 코드" />
          <BlockchainAddressText onClick={copyAddressToClipboard}>
            33zDCJtg8ugTnmSDdKTLivxBrcuJwAo8cB
          </BlockchainAddressText>
        </BlockchainAddressContainer>

        <CopyText onClick={copyAddressToClipboard}>복사하기</CopyText>
      </DepositContainer>
      <ButtonContainer>
        <SecondaryButton text="완료했습니다." onClick={onClickSubmit} />
      </ButtonContainer>
    </Container>
  );
};
