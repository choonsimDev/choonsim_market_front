import styled from "styled-components"

const SecondaryButtonBlock = styled.div`
    display: flex;
    justify-content: center;
`;

const SecondaryButtonContainer = styled.button`
    border: 1px solid #BBBFC1;
    border-radius: 5px;
    padding: 12px 32px;
    background-color: #fff;
    font-size: 16px;
`;

interface SecondaryButtonProps {
    onClick: () => void;
    text: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ onClick, text }) => {
    return (
        <SecondaryButtonBlock>
            <SecondaryButtonContainer onClick={onClick}>
                { text } <img src="/svg/next-icon.svg" />
            </SecondaryButtonContainer>
        </SecondaryButtonBlock>
    )
}