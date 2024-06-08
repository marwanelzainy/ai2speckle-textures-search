import React from "react";
import { Col, Row } from "antd";

const PageColumn = (props) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row justify="space-between" gutter={16}>
          {props.header.map((item, index) => (
            <Col key={index}>{item}</Col>
          ))}
        </Row>
      </Col>
      <Col span={24}>{props.children}</Col>
    </Row>
  );
};

export default PageColumn;
