import { SecondaryButton } from "@/components/common/SecondaryButton";
import { createOrder } from "@/lib/apis/order";
import React, { useEffect, useState } from "react";
import { colors } from "react-select/dist/declarations/src/theme";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

const StyledImage = styled.img`
  width: 100%;
  margin: 0 auto;
  max-width: 400px;
`;

const Title = styled.h2`
  color: #242731;
  margin-bottom: 12px;
  font-size: 22px;
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

const Divider = styled.div`
  border-bottom: 1px solid #ccc;
  width: 100%;
  height: 1px;
  padding-top: 18px;
`;

const SectionTitle = styled.div`
  color: #000;
  font-weight: bold;
  margin-top: 18px;
  margin-bottom: 4px;
  padding-inline: 20px;
  text-align: left;
  font-size: 18px;
`;

const Instruction = styled.div`
  color: #646464;
  font-size: 14px;
  padding-inline: 20px;
  text-align: left;
`;

const Form = styled.div`
  text-align: left;
  margin-top: 20px;
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
  color: #ff0000;
`;

interface BuySecondStepComponentProps {
  data: any;
  setData: (data: any) => void;
  setStep: (step: number) => void;
  setOrderData: (order: any) => void;
}

export const BuySecondStepComponent: React.FC<BuySecondStepComponentProps> = ({
  data,
  setData,
  setStep,
  setOrderData,
}) => {
  const [blockchainAddress, setBlockchainAddress] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [errors, setErrors] = useState<any>({});

  const validateInput = () => {
    let tempErrors = {};
    let isValid = true;

    if (blockchainAddress === "") {
      tempErrors = {
        ...tempErrors,
        blockchainAddress: "지갑 주소를 작성해주세요.",
      };
      isValid = false;
    }
    if (bankName === "") {
      tempErrors = { ...tempErrors, bankName: "은행명을 작성해주세요." };
      isValid = false;
    }
    if (accountNumber === "") {
      tempErrors = {
        ...tempErrors,
        accountNumber: "계좌 번호를 작성해주세요.",
      };
      isValid = false;
    }
    if (username === "") {
      tempErrors = { ...tempErrors, username: "입금자명을 입력해주세요." };
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "blockchainAddress":
        setBlockchainAddress(value);
        break;
      case "bankName":
        setBankName(value);
        break;
      case "accountNumber":
        setAccountNumber(value);
        break;
      case "username":
        setUsername(value);
        break;
    }
  };

  const onClickSubmit = async () => {
    if (validateInput()) {
      setData({
        ...data,
        blockchainAddress,
        bankName,
        accountNumber,
        username,
      });
      const orderResponse = await createOrder({
        ...data,
        blockchainAddress,
        bankName,
        accountNumber,
        username,
      });
      setOrderData(orderResponse.data);
      setStep(3);
    }
  };

  const formatNumber = (number: number) => {
    return number.toLocaleString();
  };

  return (
    <Container>
      <StyledImage src="/svg/img/progressbar-buy-02.png" alt="progress-bar" />
      <Title>
        입금 금액은
        <RedText> {formatNumber(data.price * data.amount)}원</RedText> 입니다.
      </Title>
      <Description>
        희망 가격 : {data.price}원 * {data.amount}개
      </Description>
      <Description>
        총 구매가 : <RedText>{formatNumber(data.price * data.amount)}</RedText>
        원
      </Description>
      <Divider />
      <SectionTitle>모빅 주소 입력</SectionTitle>
      <Instruction>
        주소를 복사하거나 공개주소 QR코드를 스캔해주세요.
      </Instruction>
      <Instruction>매칭이 완료되면 아래 주소로 모빅이 전송됩니다.</Instruction>
      <Form>
        <Label>
          <RedText>{data.nickname}</RedText> 님의 주소
        </Label>
        <Input
          name="blockchainAddress"
          value={blockchainAddress}
          onChange={handleChange}
          placeholder="주소를 복사해 넣어주세요."
        />
        {errors.blockchainAddress && (
          <ErrorMessage>{errors.blockchainAddress}</ErrorMessage>
        )}
      </Form>
      <SectionTitle>은행 정보 입력</SectionTitle>
      <Instruction>입금해주시는 계좌를 입력해주세요.</Instruction>
      <Instruction>
        (장이 종료되거나, 오입금 시 반환은 이 계좌를 통해 진행됩니다.)
      </Instruction>
      <Form>
        <Label>은행명</Label>
        <Input
          name="bankName"
          value={bankName}
          onChange={handleChange}
          placeholder="은행명을 입력해주세요."
        />
        {errors.bankName && <ErrorMessage>{errors.bankName}</ErrorMessage>}
        <Label>계좌번호</Label>
        <Input
          name="accountNumber"
          value={accountNumber}
          onChange={handleChange}
          placeholder="계좌번호를 입력해주세요"
        />
        {errors.accountNumber && (
          <ErrorMessage>{errors.accountNumber}</ErrorMessage>
        )}
        <Label>입금자명</Label>
        <Input
          name="username"
          value={username}
          onChange={handleChange}
          placeholder="입금자명을 입력해주세요."
        />
        {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
      </Form>
      <ButtonContainer>
        <SecondaryButton text="접수하기" onClick={onClickSubmit} />
      </ButtonContainer>
    </Container>
  );
};
