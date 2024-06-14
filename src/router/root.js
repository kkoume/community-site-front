import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home/HomePage";
import MainPage from "../pages/main/MainPage";
import ChatPage from "../pages/chat/ChatPage";
import ListPage from "../pages/board/ListPage";
import ModifyPage from "../pages/board/ModifyPage";
import ViewPage from "../pages/board/ViewPage";
import WritePage from "../pages/board/WritePage";
import CalendarPage from "../pages/calendar/CalendarPage";
import Page from "../pages/page/Page";
import ProjectList from "../pages/project/ProjectList";
import ProjectBoard from "../pages/project/ProjectBoard";
import LoginPage from "../pages/user/LoginPage";
import RegisterPage from "../pages/user/RegisterPage";
import TermsPage from "../pages/user/TermsPage";
import ChatRegisterPage from "../pages/chat/ChatRegisterPage";
import NoticePage from "../pages/community/NoticePage";
import DailyPage from "../pages/community/DailyPage";
import ReportPage from "../pages/community/ReportPage";
import ProjectView from "../pages/project/ProjectView";
import FindIdPage from "../pages/user/FindIdPage";
import FindPwPage from "../pages/user/FindPwPage";
import AdminPage from "../pages/admin/AdminPage";
import ChangePwPage from "../pages/user/ChangePwPage";
import QnAPage from "../pages/qna/QnAPage";
import WritePage2 from "../pages/qna/WritePage";
import ModifyPage2 from "../pages/qna/ModifyPage";
import ViewPage2 from "../pages/qna/ViewPage";
import TierPlanPage from "../pages/user/TierPlanPage";
import AdminView from "../pages/admin/AdminView";
import MypagePage from "../pages/user/MypagePage";
import PaymentPage from "../pages/user/PaymentPage";
import SuccessPage from "../pages/user/SuccessPage";
import FailPage from "../pages/user/FailPage";

//router 생성
const root = createBrowserRouter([
  { path: "/", element: <HomePage /> }, // 홈 화면
  { path: "/main", element: <MainPage /> }, // 대시보드
  { path: "/chat", element: <ChatPage /> }, //채팅

  //community
  { path: "/community/notice", element: <NoticePage /> },
  { path: "/community/daily", element: <DailyPage /> },
  { path: "/community/report", element: <ReportPage /> },
  //board
  { path: "/board/list", element: <ListPage /> }, //게시판 리스트
  { path: "/board/modify/:cate/:no", element: <ModifyPage /> }, //게시판 수정 (카테, 글번호에 따라 동적으로 지정)
  { path: "/board/view/:cate/:no", element: <ViewPage /> }, //게시판 뷰 (카테, 글번호에 따라 동적으로 지정)
  { path: "/board/write", element: <WritePage /> }, //게시판 작성

  //calendar
  { path: "/calendar", element: <CalendarPage /> }, //캘린더

  //page
  { path: "/page", element: <Page />},

  //project
  { path: "/project", element: <ProjectList /> }, //프로젝트 마일스톤
  { path: "/project/projectview", element: <ProjectView /> }, //프로젝트 마일스톤
  { path: "/project/ProjectBoard", element: <ProjectBoard /> }, //프로젝트 칸반보드
  //user
  { path: "/user/login", element: <LoginPage /> }, //로그인 페이지
  { path: "/user/register", element: <RegisterPage /> }, //회원가입
  { path: "/chatRegister", element: <ChatRegisterPage /> }, //
  { path: "/user/terms", element: <TermsPage /> }, // 약관
  { path: "/user/findId", element: <FindIdPage /> }, // 아이디찾기
  { path: "/user/findPw", element: <FindPwPage /> }, // 비밀번호찾기
  { path: "/user/changePw", element: <ChangePwPage /> }, // 비밀번호변경
  { path: "/user/tierPlan", element: <TierPlanPage /> }, // 등급별 플랜
  { path: "/user/payment/:tier", element: <PaymentPage /> }, // 결제화면
  { path: "/user/success", element: <SuccessPage /> }, // 결제성공
  { path: "/user/fail", element: <FailPage /> }, // 결제실패
  { path: "/user/mypage", element: <MypagePage /> }, // 회원정보수정

  //admin
  { path: "/admin", element: <AdminPage /> },
  { path: "/admin/view", element: <AdminView /> },

  //qna
  { path: "/qna", element: <QnAPage /> },
  { path: "/qna/view", element: <ViewPage2 /> },
  { path: "/qna/modify", element: <ModifyPage2 /> },
  { path: "/qna/write", element: <WritePage2 /> },
]);

// router 내보내기
export default root;
