import { Breadcrumb, Layout, Menu } from "antd";
import Header from "../components/Overview/Header";
import { Outlet, useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  PieChartOutlined,
  FileTextOutlined,
  SignatureOutlined,
} from "@ant-design/icons";
import useUser from "../hooks/useUser";

const { Sider, Content } = Layout;

const OverviewPage = () => {
  const { state } = useUser();
  const role = state.role;
  const id = state.id;
  const [collapsed, setCollapsed] = useState(true);
  const siderRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const locations = currentPath.split("/").filter(Boolean);
  const nonLinkItems = new Set(["overview", "reader"]);

  const titles = locations.map((item, index) => {
    const path = "/" + locations.slice(0, index + 1).join("/");
    if (!nonLinkItems.has(item)) {
      return {
        title: <Link to={path}>{item}</Link>,
      };
    }
    return { title: item };
  });

  useEffect(() => {
    const siderEl = siderRef.current;
    if (!siderEl) return;
    const handleMouseEnter = () => setCollapsed(false);
    const handleMouseLeave = () => setCollapsed(true);

    siderEl.addEventListener("mouseenter", handleMouseEnter);
    siderEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      siderEl.removeEventListener("mouseenter", handleMouseEnter);
      siderEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  const menuItems =
    role === "admin"
      ? [
          {
            key: "/overview/court",
            icon: <PieChartOutlined />,
            label: <Link to="/overview/court">Overview</Link>,
          },
        ]
      : role === "officer"
      ? [
          {
            key: `/officer/${id}`,
            icon: <FileTextOutlined />,
            label: <Link to={`/officer/${id}`}>Documents</Link>,
          },
          {
            key: `/officer/${id}/signatures`,
            icon: <SignatureOutlined />,
            label: <Link to={`/officer/${id}/signatures`}>Signatures</Link>,
          },
        ]
      : [
          {
            key: `/reader/${id}`,
            icon: <FileTextOutlined />,
            label: <Link to={`/reader/${id}`}>Documents</Link>,
          },
        ];

  return (
    <div className="">
      <Header />
      <Layout style={{ minHeight: "calc(100vh)" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          ref={siderRef}
          collapsedWidth={60}
          width={160}
          className="py-[20px]!"
        >
          <Menu
            items={menuItems}
            theme="dark"
            selectedKeys={[currentPath]}
            mode="inline"
            inlineCollapsed={collapsed}
          />
        </Sider>
        <Layout>
          <Content className="p-6 bg-gray-100 min-h-[100vh]">
            <Breadcrumb items={titles} />
            <div className="mt-6">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default OverviewPage;
