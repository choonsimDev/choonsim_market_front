import styled from "styled-components";

const SecondaryButtonBlock = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const SecondaryButtonContainer = styled.button`
  border: 1px solid #bbbfc1;
  width: 296px;
  height: 40px;
  border-radius: 8px;
  padding: 8px 12px 8px 12px;
  background-color: #0078ff;
  font-size: 16px;
  color: white;
`;

interface SecondaryButtonProps {
  onClick: () => void;
  text: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  onClick,
  text,
}) => {
  return (
    <SecondaryButtonBlock>
      <SecondaryButtonContainer onClick={onClick}>
        {text}
      </SecondaryButtonContainer>
    </SecondaryButtonBlock>
  );
};
