import React from 'react';
import '../App.css';
import '../StyleSheet/main.css';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';

import VideoFirst from '../Component/VideoFirst';
import Filter from '../Component/Filter';

class Main extends React.Component {
    
    state = {
        value : '',
    }

    StateChange = (value) => {
        this.setState({
            value: value
        })
    }   

    render(){

        return(
            <>                   
                <div id="container">
                    <h1>WebRTC Test</h1>                 
                    <VideoFirst value={this.state.value}/>                    
                    <hr />
                    <Filter value={this.state.value} StateChange={this.StateChange} />
                    <hr />

                    <canvas />

                    <div id="errorMsg" />    

                    <h2><Link to="/" className="LinkClass">메인으로</Link></h2>  
                </div>
            </>
        )
    }    
}

export default Main;