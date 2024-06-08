import { Col, Layout, Row, Typography } from "antd";
import AuthButton from "components/atoms/AuthButton";
import ProjectsButton from "components/atoms/ProjectsButton";
import { Link, Outlet } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const Root = ({ children, appName }) => {
  return (
    <Layout className="layout">
      <Header>
        <Row justify="space-between" align="middle">
          <Col>
            <Link to="/">
              <div className="demo-logo">
                <Typography.Title
                  level={3}
                  style={{ margin: 0, color: "white" }}
                >
                  {appName}
                </Typography.Title>
              </div>
            </Link>
          </Col>
          <Col>
            <ProjectsButton />
          </Col>
          <Col>
            <AuthButton />
          </Col>
        </Row>
      </Header>
      <Layout>
        <Content style={{ padding: "20px 20px", height: "90vh" }}>
          {children ? children : <Outlet />}
        </Content>
      </Layout>

      {/* <Footer style={{ textAlign: 'center' }}>Made with ❤️ by <Link to='https://github.com/antoinedao'>Antoine Dao</Link></Footer> */}
    </Layout>
  );
};

export default Root;
