import { Button, Typography } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";

const ProjectsButton = ({}) => {
  const { token, login, logOut } = useAuth();
  return token ? (
    <Link to="/streams">
      <Button type="text">
        <Typography.Title level={5} style={{ margin: 0, color: "white" }}>
          Projects
        </Typography.Title>
      </Button>
    </Link>
  ) : null;
};

export default ProjectsButton;
