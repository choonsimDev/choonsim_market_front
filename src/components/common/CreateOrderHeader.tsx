import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background-color: #fff;
`;

const Logo = styled.img``;

const CreateOrderHeader: React.FC = () => {
  const router = useRouter();
  return (
    <HeaderContainer>
      <div>
        <Logo src="/svg/logo.svg" alt="Logo" />
      </div>
      <div
        onClick={() => {
          router.push("/");
        }}
      >
        <img src="/svg/back.svg" alt="뒤로 가기" />
      </div>
    </HeaderContainer>
  );
};

export default CreateOrderHeader;
