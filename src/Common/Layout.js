import React from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';

import Main from '../Component/Main';
import Foot from '../Component/Foot';

import { Layout, Menu } from 'antd';

const { Header, Content, Footer } = Layout;

// const { Header, Footer, Content } = Layout;

class CommomLayout extends React.Component {

    state = {
        MenuState: "0",
    }

    render(){
        return(
            <>
            {/* <Layout>
                <Header>Header</Header>
                <Content><Main /></Content>            
                <Footer><Foot /></Footer>             
            </Layout> */}
                <Layout>
                    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal">
                        <Menu.Item key="0">
                            <Link to="/" className="LinkClass">메인으로</Link>
                        </Menu.Item>
                        <Menu.Item key="1">
                            <Link to="/main">기초</Link>
                        </Menu.Item>
                        <Menu.Item key="2">1:1 화상채팅</Menu.Item>
                        <Menu.Item key="3">다수 화상채팅</Menu.Item>                        
                    </Menu>
                    </Header>
                    <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>                    
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                        <Main />
                    </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}><Foot /></Footer>
                </Layout> 
            </>
        )
    }
}

export default CommomLayout;