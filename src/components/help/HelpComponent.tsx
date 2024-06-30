import styled from "styled-components"
import TodayOrderTable from "./TodayOrderTable"

const HelpComponentBlock = styled.div`
    padding-inline: 16px;
    flex: 1;
`;

export const HelpComponent = () => {
    return(
        <HelpComponentBlock>
            <TodayOrderTable />
        </HelpComponentBlock>
    )
}