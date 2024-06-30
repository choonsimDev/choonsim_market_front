import { SecondaryButton } from "@/components/common/SecondaryButton";
import { createOrder } from "@/lib/apis/order";
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
  color: #0038FF;
  font-size: 25px;
`;

const Divider = styled.div`
  border-bottom: 1px solid #ccc;
  width: 100%;
  height: 1px;
  padding-top: 18px;
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

const BlueText = styled.span`
  color: #0038FF;
`;

interface SellSecondStepComponentProps {
    data: any;
    setData: (data: any) => void;
    setStep: (step: number) => void;
    setOrderData: (order: any) => void;
}

export const SellSecondStepComponent: React.FC<SellSecondStepComponentProps> = ({
    data,
    setData,
    setStep,
    setOrderData
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
            tempErrors = { ...tempErrors, blockchainAddress: "지갑 주소를 작성해주세요." };
            isValid = false;
        }
        if (bankName === "") {
          tempErrors = { ...tempErrors, bankName: "은행명을 작성해주세요." };
          isValid = false;
      }
        if (accountNumber === "") {
            tempErrors = { ...tempErrors, accountNumber: "계좌 번호를 작성해주세요." };
            isValid = false;
        }
        if (username === "") {
            tempErrors = { ...tempErrors, username: "입금자명을 입력해주세요." };
            isValid = false;
        }
        setErrors(tempErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                username
            });
            const orderResponse = await createOrder({
                ...data,
                blockchainAddress,
                bankName,
                accountNumber,
                username
            });
            setOrderData(orderResponse.data);
            setStep(3);
        }
    };

    return (
        <Container>
            <img src="/svg/second-progress-bar.svg" alt="progress-bar" />
            <Title>입금하실 모빅 수는 <BlueText>{data.amount}개</BlueText> 입니다.</Title>
            <Description>{data.price}원, {data.amount} 신청</Description>
            <Divider />
            <SectionTitle>입금 정보를 입력해주세요.</SectionTitle>
            <Form>
                <Label><BlueText>{data.nickname}</BlueText> 님의 주소</Label>
                <Input
                    name="blockchainAddress"
                    value={blockchainAddress}
                    onChange={handleChange}
                    placeholder="주소를 복사해 넣어주세요."
                />
                {errors.blockchainAddress && <ErrorMessage>{errors.blockchainAddress}</ErrorMessage>}
            </Form>
            <SectionTitle>심부름 완료시 입금받을 계좌를 적어주세요.</SectionTitle>
            <Form>
                <Label>은행명</Label>
                <Input
                    name="bankName"
                    value={bankName}
                    onChange={handleChange}
                    placeholder="은행명을 입력해주세요."
                />
                {errors.bankName && <ErrorMessage>{errors.bankName}</ErrorMessage>}
                <Label>계좌번호를 입력해주세요</Label>
                <Input
                    name="accountNumber"
                    value={accountNumber}
                    onChange={handleChange}
                    placeholder="계좌번호를 입력해주세요"
                />
                {errors.accountNumber && <ErrorMessage>{errors.accountNumber}</ErrorMessage>}
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
