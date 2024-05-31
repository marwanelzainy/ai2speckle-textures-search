import React, { useEffect } from "react";
import { Card, List, Space, Typography } from "antd";
import { BranchesOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { useStreams } from "hooks/useStreams";
import PageColumn from "components/templates/PageColumn";
import { SERVER_URL } from "context/auth";

const StreamList = () => {
  const { streams, loading, error } = useStreams({});

  useEffect(() => {
    // console.log(streams);
  }, [streams]);
  return (
    <PageColumn header={[]}>
      <List
        dataSource={streams}
        loading={loading}
        renderItem={(stream) => (
          <Card
            style={{ marginBottom: 16 }}
            title={stream.name}
            extra={
              <Space>
                <Typography.Text>
                  {stream.branches.totalCount} x
                </Typography.Text>
                <BranchesOutlined />
              </Space>
            }
          >
            <List
              grid={{ gutter: 16, column: 5 }}
              dataSource={stream.branches.items}
              renderItem={(branch) => {
                return (
                  <List.Item>
                    {branch.commits.items[0] && (
                      <Link
                        to={"/model"}
                        state={{
                          modelLink: `${SERVER_URL}/streams/${stream.id}/objects/${branch.commits.items[0]?.referencedObject}`,
                        }}
                      >
                        <Card
                          loading={loading}
                          cover={
                            <img
                              alt="example"
                              src="https://speckle.systems/content/images/2021/02/automation.png"
                            />
                          }
                          bordered
                          hoverable
                        >
                          <Card.Meta title={branch.name} />
                        </Card>
                      </Link>
                    )}
                  </List.Item>
                );
              }}
            />
          </Card>
        )}
      />
    </PageColumn>
  );
};

export default StreamList;
