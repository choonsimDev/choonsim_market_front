import { SecondaryButton } from "@/components/common/SecondaryButton";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  color: #ff0000;
  margin-bottom: 20px;
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
  margin-bottom: 24px;
  padding-inline: 20px;
  text-align: left;
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

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

interface BuyFirstStepComponentProps {
  data: any;
  setData: (data: any) => void;
  setStep: (step: number) => void;
}

export const BuyFirstStepComponent: React.FC<BuyFirstStepComponentProps> = ({
  data,
  setData,
  setStep,
}) => {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [price, setPrice] = useState<number | null>(
    router.query.price ? parseInt(router.query.price as string, 10) : null
  );
  const [amount, setAmount] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (price && amount) {
      const newTotal = price * parseFloat(amount);
      setTotal(newTotal);
    }
  }, [price, amount]);

  const validateInput = () => {
    let tempErrors = {};
    let isValid = true;

    if (nickname === "") {
      tempErrors = { ...tempErrors, nickname: "닉네임을 작성해주세요." };
      isValid = false;
    }
    if (phoneNumber === "") {
      tempErrors = {
        ...tempErrors,
        phoneNumber: "휴대폰 번호를 작성해주세요.",
      };
      isValid = false;
    }
    if (price === null || price <= 0) {
      tempErrors = { ...tempErrors, price: "희망 가격을 입력해주세요." };
      isValid = false;
    } else if (price < 1000000 && price % 2500 !== 0) {
      tempErrors = {
        ...tempErrors,
        price: "가격은 100만원 이하일 시에 2,500원 단위로 입력해주세요.",
      };
      isValid = false;
    } else if (price >= 1000000 && price % 5000 !== 0) {
      tempErrors = {
        ...tempErrors,
        price: "가격은 100만원 이상일 시에 5,000원 단위로 입력해주세요.",
      };
      isValid = false;
    }
    if (amount === null || parseFloat(amount) <= 0) {
      tempErrors = { ...tempErrors, amount: "희망 수량을 입력해주세요." };
      isValid = false;
    }
    if (total > 10000000) {
      tempErrors = {
        ...tempErrors,
        total: "총액은 10,000,000원을 넘을 수 없습니다.",
      };
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
      case "nickname":
        setNickname(value);
        break;
      case "phoneNumber":
        const formattedPhone = formatPhoneNumber(value);
        setPhoneNumber(formattedPhone);
        break;
      case "price":
        const numberValue = parseInt(value.replace(/,/g, ""), 10);
        if (!Number.isNaN(numberValue)) {
          setPrice(numberValue);
        } else {
          setPrice(null);
        }
        break;
      case "amount":
        setAmount(value);
        break;
    }
  };

  const formatPhoneNumber = (value: any) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 7)
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const onClickNext = () => {
    if (validateInput()) {
      setData({
        ...data,
        nickname,
        phoneNumber,
        price,
        amount: parseFloat(amount),
      });
      setStep(2);
    }
  };

  return (
    <Container>
      <StyledImage src="/svg/img/progressbar-buy-01.png" alt="progress-bar" />
      <Title style={{ color: "FF0000" }}>구매 심부름 요청</Title>
      <Description>
        어서오세요. BTCMobick 구매대행 서비스, <b>춘심 심부름센터</b>입니다.
      </Description>
      <Description>
        호가창이 있고 대중에게 익명이 보장되는 방식으로 진행됩니다.
      </Description>
      <Divider />
      <SectionTitle>기본 정보 입력</SectionTitle>
      <Instruction>
        문제 발생시에만 연락하며, 심부름 종료시 파기합니다. 오입력으로 인한
        책임은 본인에게 있습니다.
      </Instruction>
      <Form>
        <Label>신청자 닉네임</Label>
        <Input
          name="nickname"
          value={nickname}
          onChange={handleChange}
          placeholder="닉네임을 입력해주세요."
        />
        {errors.nickname && <ErrorMessage>{errors.nickname}</ErrorMessage>}
        <Label>휴대폰 번호</Label>
        <Input
          name="phoneNumber"
          value={phoneNumber}
          onChange={handleChange}
          placeholder="010-0000-0000"
        />
        {errors.phoneNumber && (
          <ErrorMessage>{errors.phoneNumber}</ErrorMessage>
        )}
        <Label>희망 가격</Label>
        <Input
          name="price"
          value={price?.toLocaleString()}
          onChange={handleChange}
          placeholder="희망 가격을 입력해주세요."
        />
        {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
        <Label>수량</Label>
        <Input
          name="amount"
          value={amount ?? ""}
          onChange={handleChange}
          placeholder="희망 수량을 입력해주세요."
          type="number"
          min="0.01"
          step="0.01"
        />
        {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
        {errors.total && <ErrorMessage>{errors.total}</ErrorMessage>}
      </Form>
      <ButtonContainer>
        <SecondaryButton text="다음으로" onClick={onClickNext} />
      </ButtonContainer>
    </Container>
  );
};
