import { useRouter } from "next/router";
import styled from "styled-components";

const Sidebar = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <Container>
      <ActiveContent
        active={pathname === "/admin"}
        onClick={() => router.push("/admin")}
      >
        Dashboard
      </ActiveContent>
      {/* <ActiveContent
        active={pathname === "/admin/data"}
        onClick={() => router.push("/admin/data")}
      >
        신청 현황
      </ActiveContent>
      <ActiveContent
        active={pathname === "/admin/setting"}
        onClick={() => router.push("/admin/setting")}
      >
        설정 관리
      </ActiveContent> */}
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  width: 12.5rem;
  height: 50rem;
  flex-shrink: 0;
  background: rgba(195, 216, 255, 0.26);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5.25rem;
  padding-bottom: 33.13rem;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
`;

interface ContentProps {
  active?: boolean;
}

const Content = styled.div`
  color: #000;
  text-align: center;
  font-family: Raleway;
  font-size: 1.28681rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.44769rem;
  letter-spacing: 0.08044rem;
  text-transform: uppercase;
  margin-bottom: 1.94rem;
  cursor: pointer;
`;

const ActiveContent = styled(Content)<ContentProps>`
  color: ${(props) => (props.active ? "#0038FF" : "#000")};
`;
