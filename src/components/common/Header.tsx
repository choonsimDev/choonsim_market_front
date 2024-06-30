import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background-color: #fff;
`;

const Logo = styled.img`
  cursor: pointer;
`;

const Header: React.FC = () => {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <HeaderContainer>
      <Logo src="/svg/logo.svg" alt="Logo" onClick={handleLogoClick} />
    </HeaderContainer>
  );
};

export default Header;
