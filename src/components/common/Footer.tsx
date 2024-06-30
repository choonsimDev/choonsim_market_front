import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  background-color: #fff;
`;

const FooterCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Icon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const FooterText = styled.div`
  font-size: 12px;
`;

const Footer: React.FC = () => {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleCommunityClick = () => {
    alert('준비중입니다 :)');
  };

  const handleHelpClick = () => {
    router.push('/help');
  };

  return (
    <FooterContainer>
      <FooterCell><Icon src="/svg/home.svg" alt="Home" onClick={handleHomeClick} /> <FooterText>Home</FooterText></FooterCell>
      <FooterCell><Icon src="/svg/community.svg" alt="Community" onClick={handleCommunityClick} /><FooterText>Community</FooterText></FooterCell>
      <FooterCell><Icon src="/svg/help.svg" alt="Help" onClick={handleHelpClick} /><FooterText>Help</FooterText></FooterCell>
    </FooterContainer>
  );
};

export default Footer;
