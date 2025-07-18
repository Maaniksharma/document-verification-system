import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import DashboardPage from "./pages/OverviewPage.tsx";
import IsAuthorized from "./components/ui/IsAuthorized.tsx";
import UserProvider from "./contexts/UserInfo.tsx";
import Courts from "./pages/Courts.tsx";
import AdminProvider from "./contexts/AdminDataContext.tsx";
import CourtInformation from "./pages/CourtInformation.tsx";
import ReaderPage from "./pages/ReaderPage.tsx";
import ReaderProvider from "./contexts/ReaderDataContext.tsx";
import DocReqInformation from "./pages/DocReqInformation.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <AdminProvider>
        <ReaderProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/overview"
                element={
                  <IsAuthorized>
                    <DashboardPage />
                  </IsAuthorized>
                }
              >
                <Route path="court" element={<Courts />} />
                <Route path="court/:courtId" element={<CourtInformation />} />
              </Route>
              <Route
                path="/reader/:id"
                element={
                  <IsAuthorized>
                    <DashboardPage />
                  </IsAuthorized>
                }
              >
                <Route index element={<ReaderPage />} />
                <Route
                  path="docRequests/:reqId"
                  element={<DocReqInformation />}
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </ReaderProvider>
      </AdminProvider>
    </UserProvider>
  </StrictMode>
);
