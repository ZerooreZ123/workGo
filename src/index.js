import React from 'react';
import ReactDOM from 'react-dom';

// 载入主入口
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import initReactFastclick from 'react-fastclick';

initReactFastclick();

const newSize = document.documentElement.getBoundingClientRect().width / 10;
document.documentElement.style.fontSize = `${newSize}px`;

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
