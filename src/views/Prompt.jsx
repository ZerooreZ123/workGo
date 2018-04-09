import React, { Component } from 'react';


class Prompt extends Component {
  constructor() {
    super();
    this.state = {
    }
  } 
  componentDidMount() {
    // document.querySelector('title').innerText = '提示信息';
    this.prompt();
  }
  prompt(){
    alert(this.props.match.params.msg);
  }
  render() {
    return (
      <div></div>
    );
  }
}

export default Prompt;