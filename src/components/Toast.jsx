import React, { Component } from 'react';
import styles from '../styles/Toast.css'

class Toast extends Component {
    constructor() {
        super();
        this.state = {}
    }
    componentDidMount() {

    }
    render() {
        const html = this.props.isShow ?
            <div className={styles.box}>
                {this.props.text}
            </div>
            : null
        return html;
    }

}
export default Toast;