import { SecondaryButton } from "@/components/common/SecondaryButton";
import { createOrder } from "@/lib/apis/order";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  color: #242731;
  margin-bottom: 12px;
`;

const Description = styled.div`
  color: #575F6E;
  font-size: 13px;
`;

const SectionTitle = styled.div`
  color: #333;
  font-weight: bold;
  margin-top: 18px;
  margin-bottom: 32px;
  padding-inline: 20px;
  text-align: left;
  font-size: 20px;
`;

const Form = styled.div`
  text-align: left;
  padding-inline: 20px;
`;

const Label = styled.label`
  display: block;
  margin: 10px 0 5px;
  color: #333;
  font-size: 14px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 100%;
  border: none;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-bottom: 2px solid #0066cc;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const RedText = styled.span`
  color: #FF0000;
`;

interface BuyFourthStepComponentProps {
    orderData: any;
}

export const BuyFourthStepComponent: React.FC<BuyFourthStepComponentProps> = ({
    orderData
}) => {
    const router = useRouter();
    const onClickSubmit = async () => {
        router.push('/');
    };

    return (
        <Container>
            <img src="/svg/fourth-progress-bar.svg" alt="progress-bar" />
            <Title style={{marginBottom: '8px'}}>접수되었습니다.</Title>
            <Title style={{marginBottom: '8px', marginBlockStart: '4px'}}>입금을 완료해주세요.</Title>
            <Title style={{color: 'grey', fontSize: '18px'}}>접수번호: {orderData.id}</Title>
            <Title><RedText>현재 상태: 입금확인중</RedText></Title>
            <SectionTitle>신청 내용을 확인하세요.</SectionTitle>
            <Form>
                <Label>닉네임</Label>
                <Input
                    name="nickname"
                    value={orderData.nickname}
                />
                <Label>휴대폰 번호</Label>
                <Input
                    name="phoneNumber"
                    value={orderData.phoneNumber}
                />
                <Label>입금주소</Label>
                <Input
                    name="blockchainAddress"
                    value={orderData.blockchainAddress}
                />
            </Form>
            <ButtonContainer>
                <SecondaryButton text="돌아가기" onClick={onClickSubmit} />
            </ButtonContainer>
        </Container>
    );
};
