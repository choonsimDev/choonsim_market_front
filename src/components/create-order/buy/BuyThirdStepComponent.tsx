import { SecondaryButton } from "@/components/common/SecondaryButton";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  color: #242731;
  margin-bottom: 12px;
  font-size: 20px;
  margin-block-start: 32px;
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
  color: #FF0000;
`;

const Description = styled.div`
  font-weight: bold;
`;

const CopyText = styled.div`
  padding-top: 32px;
  color: #858585;
  font-weight: bold;
`;

const DepositContainer = styled.div`
  flex: 1;
  padding-top: 36px;
`;

const DepositAddressText = styled.div`
  color: #007AFF;
  font-weight: bold;
  font-size: 30px;
  padding-top: 54px;
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
        navigator.clipboard.writeText('우리은행 | 남정현 1002-051-001702').then(() => {
          alert('주소가 클립보드에 복사되었습니다.');
        }, (err) => {
          console.error('클립보드 복사에 실패했습니다.', err);
        });
    };

    const onClickSubmit = async () => {
        setStep(4);
    };

    return (
        <Container>
            <img src="/svg/third-progress-bar.svg" alt="progress-bar" />
            <Title>아래 계좌로 금액을 입금해주세요. <br/><br/> <RedText>{data.price}원</RedText></Title>
            <Divider />
            <DepositContainer>
                <Description>춘심 심부름 센터 입금 계좌</Description>
                <DepositAddressText>우리은행 | 남정현 <br/> 1002-051-001702</DepositAddressText>
                <CopyText onClick={copyAddressToClipboard}>복사하기</CopyText>
            </DepositContainer>
            <ButtonContainer>
                <SecondaryButton text="완료했습니다." onClick={onClickSubmit} />
            </ButtonContainer>
        </Container>
    );
};
