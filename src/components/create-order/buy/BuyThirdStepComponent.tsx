import { SecondaryButton } from "@/components/common/SecondaryButton";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
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

const RedText = styled.span`
  color: #ff0000;
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

const DepositAddressText = styled.div`
  color: #0078ff;
  font-weight: bold;
  font-size: 30px;
  padding-top: 54px;
  background-color: #f8f8f8;
  width: 80%;
  display: inline-block;
  border-radius: 8px;
  padding: 32px;
  margin-top: 16px;
  text-align: center;
  max-width: 400px;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #66adff;
  }
`;

interface BuyThirdStepComponentProps {
  data: any;
  setStep: (step: number) => void;
}

export const BuyThirdStepComponent: React.FC<BuyThirdStepComponentProps> = ({
  data,
  setStep,
}) => {
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText("우리은행 | 남정현 1002-051-001702").then(
      () => {
        alert("클립보드에 복사되었습니다.");
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
      <StyledImage src="/svg/img/progressbar-buy-03.png" alt="progress-bar" />
      <Title>
        아래 계좌로 <RedText>총 구매가</RedText>를 입금해주세요 <br />
      </Title>
      <Description>
        희망 가격 : {data.price}원 * {data.amount}개
      </Description>
      <Description>
        총 구매가 :&nbsp;
        <div style={{ color: "red" }}>
          {formatNumber(data.price * data.amount)}
        </div>
        원
      </Description>
      <Divider />
      <DepositContainer>
        <SecondDescription>춘심 심부름 센터 입금 계좌</SecondDescription>
        <DepositAddressText onClick={copyAddressToClipboard}>
          우리은행 | 남정현 <br /> 1002-051-001702
        </DepositAddressText>
        <CopyText onClick={copyAddressToClipboard}>복사하기</CopyText>
      </DepositContainer>
      <ButtonContainer>
        <SecondaryButton text="완료했습니다." onClick={onClickSubmit} />
      </ButtonContainer>
    </Container>
  );
};
