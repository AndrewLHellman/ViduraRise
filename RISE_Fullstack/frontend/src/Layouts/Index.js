import React, { useState } from 'react';
import PropTypes from "prop-types";
import withRouter from '../Common/withRouter';

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Col, Container, Row } from 'reactstrap';

const Layout = (props) => {
  const [headerClass, setHeaderClass] = useState("");
  const [layoutModeType, setLayoutModeType] = useState("");
  const [onChangeLayoutMode, setOnChangeLayoutMode] = useState("");
  const [layoutType, setLayoutType] = useState("");
  return (
    <React.Fragment>
      <Container fluid>
        <Header
          headerClass={headerClass}
          layoutModeType={layoutModeType}
          onChangeLayoutMode={onChangeLayoutMode} />
        <Row>
          <div className='col-auto border-end'>
            <Sidebar layoutType={layoutType} />
          </div>
          <Col className=''>
            <div className="main-content pt-4 pe-3">{props.children}
              <Footer />
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>

  );
}

Layout.propTypes = {
  children: PropTypes.object,
};

export default withRouter(Layout)