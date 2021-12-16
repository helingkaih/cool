import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import reportWebVitals from './reportWebVitals';
import thunk from 'redux-thunk';
import todoApp from './reducer';

let store = createStore(todoApp, compose(applyMiddleware(thunk)))
function render(props) {
    const { container } = props;
    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
        ,
        container ? container.querySelector('#reactRoot') : document.querySelector('#reactRoot')
    );
}

if (!window.__POWERED_BY_QIANKUN__) {
    render({});
}


export async function bootstrap() {
}

export async function mount(props) {
    render(props);
}

export async function unmount(props) {
    const { container } = props;
    ReactDOM.unmountComponentAtNode(container ? container.querySelector('#reactRoot') : document.querySelector('#reactRoot'));
}
reportWebVitals();
