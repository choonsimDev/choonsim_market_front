import { SecondaryButton } from "@/components/common/SecondaryButton";
import { createOrder } from "@/lib/apis/order";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  color: #000;
  margin-bottom: 8px;
  font-size: 24px;
`;

const StyledImage = styled.img`
  width: 100%;
  margin: 0 auto;
  max-width: 400px;
`;

const Description = styled.div`
  color: #000;
  font-size: 14px;
`;

const Instruction = styled.div`
  color: #000;
  font-size: 18px;
  padding-inline: 20px;
  margin-top: 10px;
  text-align: center;
`;

const SectionTitle = styled.div`
  color: #000;
  font-weight: bold;
  margin-top: 18px;
  margin-bottom: 20px;
  padding-inline: 20px;
  text-align: left;
  font-size: 18px;
`;

const Divider = styled.div`
  border-bottom: 1px solid #ccc;
  width: 100%;
  height: 1px;
  padding-top: 18px;
  margin-bottom: 16px;
`;

const Form = styled.div`
  text-align: left;
  padding-inline: 20px;
`;

const Label = styled.label`
  display: block;
  margin: 10px 0 5px;
  color: #000;
  font-size: 14px;
  font-weight: bold;
  padding-left: 10px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  font-size: 18px;
  width: 100%;
  border: none;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-bottom: 2px solid #0078ff;
  }
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const RedText = styled.span`
  color: #ff0000;
`;

interface BuyFourthStepComponentProps {
  orderData: any;
}

export const BuyFourthStepComponent: React.FC<BuyFourthStepComponentProps> = ({
  orderData,
}) => {
  const router = useRouter();
  const onClickSubmit = async () => {
    router.push("/");
  };

  return (
    <Container>
      <StyledImage src="/svg/img/progressbar-buy-04.png" alt="progress-bar" />
      <Title>
        구매 심부름 접수가 <RedText> 완료 </RedText>되었습니다.
      </Title>
      <Description>접수 현황은 신청 내역에서 확인하실 수 있으며,</Description>
      <Description>
        심부름량이 급증할 시, 반영이 늦어질 수 있습니다.
      </Description>
      <Instruction>
        <b>
          접수번호: <RedText>{orderData.orderNumber}</RedText>
        </b>
      </Instruction>

      <Divider />

      <SectionTitle>신청 내용을 확인하세요. </SectionTitle>
      <Form>
        <Label>닉네임 & 휴대폰 번호</Label>
        <Input
          name="info"
          value={`${orderData.nickname} / ${orderData.phoneNumber} `}
        />
        <Label>계좌정보</Label>
        <Input
          name="info"
          value={`${orderData.bankName} / ${orderData.accountNumber} `}
        />
        <Label>입금주소</Label>
        <Input name="info" value={orderData.blockchainAddress} />
        <Label>신청 가격 & 수량</Label>
        <Input
          name="info"
          value={`${orderData.price}원 / ${orderData.amount}개 `}
        />
      </Form>
      <ButtonContainer>
        <SecondaryButton text="완료" onClick={onClickSubmit} />
      </ButtonContainer>
    </Container>
  );
};
