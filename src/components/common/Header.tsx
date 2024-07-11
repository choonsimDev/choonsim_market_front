import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

const HeaderBlock = styled.div`
  border-bottom: solid 1px #f5f5f5;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
  padding-inline: 1.5rem;
`;

const HeaderContainer = styled.header`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #fff;

  cursor: pointer;
  gap: 10px;
`;

const Logo = styled.img`
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const Header: React.FC = () => {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <HeaderBlock>
      <HeaderContainer onClick={handleLogoClick}>
        <Logo src="/svg/icon/header_logo.png" alt="Logo" height={30} />
        <Title>춘심 심부름센터</Title>
      </HeaderContainer>
    </HeaderBlock>
  );
};

export default Header;
