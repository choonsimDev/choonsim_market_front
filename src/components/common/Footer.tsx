import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
  background-color: #fff;
  border-top: solid 1px #f5f5f5;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05);
`;

const FooterCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Icon = styled.img<{ active: boolean }>`
  height: 20px;
  cursor: pointer;
  filter: ${(props) => (props.active ? "none" : "grayscale(100%)")};
`;

const FooterText = styled.div<{ active: boolean }>`
  font-size: 12px;
  font-weight: bold;
  margin-top: 5px;
  color: ${(props) => (props.active ? "#0078ff" : "#000")};
`;

const Footer: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;

  const handleHomeClick = () => {
    router.push("/");
  };

  const handleChartClick = () => {
    router.push("/chart");
  };

  const handleHelpClick = () => {
    router.push("/help");
  };

  return (
    <FooterContainer>
      <FooterCell>
        <Icon
          src="/svg/icon/button_home.png"
          alt="Home"
          onClick={handleHomeClick}
          active={pathname === "/"}
        />
        <FooterText active={pathname === "/"}>홈</FooterText>
      </FooterCell>
      <FooterCell>
        <Icon
          src="/svg/icon/button_graph.png"
          alt="Community"
          onClick={handleChartClick}
          active={pathname === "/chart"}
        />
        <FooterText active={pathname === "/chart"}>그래프</FooterText>
      </FooterCell>
      <FooterCell>
        <Icon
          src="/svg/icon/button_history.png"
          alt="Help"
          onClick={handleHelpClick}
          active={pathname === "/help"}
        />
        <FooterText active={pathname === "/help"}>신청 내역</FooterText>
      </FooterCell>
    </FooterContainer>
  );
};

export default Footer;
