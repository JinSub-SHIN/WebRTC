import React from 'react';
import '../StyleSheet/Filter.css';

class Filter extends React.Component {
    
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){

        this.props.StateChange(e.target.value);

        const video = window.video = document.querySelector('video');

        video.className = e.target.value;
    }    

    render(){

        const value = this.props.value;

        return(
            <div>
                <label>Filter: </label>
                    <select id="filter" onChange={this.handleChange} value={value} >
                        <option value="none">None</option>
                        <option value="blur">Blur</option>
                        <option value="grayscale">Grayscale</option>
                        <option value="invert">Invert</option>
                        <option value="sepia">Sepia</option>
                    </select>
            </div>
        )
    }
}

export default Filter;

