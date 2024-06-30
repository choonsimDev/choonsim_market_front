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
  margin-top: 20px;
`;

const BlueText = styled.span`
  color: #0038FF;
`;

const Description = styled.div`
  font-weight: bold;
`;

const BlockchainAddressText = styled.div`
  color: #007AFF;
  font-weight: bold;
`;

const CopyText = styled.div`
  padding-top: 8px;
  color: #858585;
  font-weight: bold;
`;

const DepositContainer = styled.div`
  flex: 1;
  padding-top: 36px;
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
        navigator.clipboard.writeText('33zDCJtg8ugTnmSDdKTLivxBrcuJwAo8cB').then(() => {
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
            <Title>아래 주소로 모빅을 <br/><br/> <BlueText>{data.amount}개</BlueText> 전송해주세요</Title>
            <Divider />
            <DepositContainer>
                <Description>춘심 심부름 센터 공개주소</Description>
                <img src="/svg/qr.svg" alt="qr 코드" />
                <BlockchainAddressText onClick={copyAddressToClipboard}>33zDCJtg8ugTnmSDdKTLivxBrcuJwAo8cB</BlockchainAddressText>
                <CopyText onClick={copyAddressToClipboard}>복사하기</CopyText>
            </DepositContainer>
            <ButtonContainer>
                <SecondaryButton text="완료했습니다." onClick={onClickSubmit} />
            </ButtonContainer>
        </Container>
    );
};
