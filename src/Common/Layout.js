import React from "react";
import "antd/dist/antd.css";

import Foot from "../Component/Foot";

import { Layout, Menu } from "antd";
import Blank from "../Component/Blank";

const { Header, Content, Footer } = Layout;

// const { Header, Footer, Content } = Layout;

class CommomLayout extends React.Component {
  state = {
    MenuState: "0",
  };

  keyChange = (e) => {
    this.setState({
      MenuState: e.key,
    });

    console.log(e.key);
  };

  render() {
    return (
      <>
        {/* <Layout>
                <Header>Header</Header>
                <Content><Main /></Content>            
                <Footer><Foot /></Footer>             
            </Layout> */}
        <Layout>
          <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" onClick={this.keyChange}>
              <Menu.Item key="0">기능별</Menu.Item>
              {/* <Menu.Item key="1">기초</Menu.Item> */}
              <Menu.Item key="2">화상연결</Menu.Item>
              {/* <Menu.Item key="3">다수 화상채팅</Menu.Item> */}
              <Menu.Item key="3">채팅하기</Menu.Item>
            </Menu>
          </Header>
          <Content
            className="site-layout"
            style={{ padding: "0 50px", marginTop: 64, minHeight:600 }}
          >
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 380 }}
            >
              <Blank keyName={this.state.MenuState} />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            <Foot />
          </Footer>
        </Layout>
      </>
    );
  }
}

export default CommomLayout;
