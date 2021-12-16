import React from 'react';
import Cv from '../../components/codeview'

const useStateCode = `
import React, { useState } from 'react';

function Example() {
    // 声明一个叫 "count" 的 state 变量
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
`;

const classStateCode = `
class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    render() {
        return (
            <div>
                <p>You clicked {this.state.count} times</p>
                <button onClick={() => this.setState({ count: this.state.count + 1 })}>
                Click me
                </button>
            </div>
        );
    }
}
`;

const useEffectCode = `
import React, { useState, useEffect } from 'react';

function Example() {
    const [count, setCount] = useState(0);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        document.title = 'You clicked ${'count'} times';
    });

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
`;

export default function hooksBase() {
    return (
        <div>
            <p className="title-1">HookS 基础篇</p>

            {/* 什么是 Hooks */}
            <p className="title-2">什么是 Hooks</p>
            <ul className="normal-ul">
                <li>React 一直都提倡使用函数组件，但是有时候需要使用 state 或者其他一些功能时，只能使用类组件，因为函数组件没有实例，没有生命周期函数，只有类组件才有</li>
                <li>Hooks 是 React 16.8 新增的特性，它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性</li>
                <li>如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须将其它转化为 class。现在你可以直接在现有的函数组件中使用 Hooks</li>
                <li>凡是 use 开头的 React API 都是 Hooks</li>
            </ul>

            {/* 注意事项 */}
            <p className="title-2">注意事项</p>
            <ul className="normal-ul">
                <li>只能在函数内部的最外层调用 Hook，不要在循环、条件判断或者子函数中调用</li>
                <li>只能在 React 的函数组件中调用 Hook，不要在其他 JavaScript 函数中调用</li>
            </ul>

            {/* useState Hook */}
            <p className="title-2">useState Hook</p>
            <ul className="normal-ul">
                <li>React 假设当你多次调用 useState 的时候，你能保证每次渲染时它们的调用顺序是不变的。</li>
                <li>通过在函数组件里调用它来给组件添加一些内部 state，React会 在重复渲染时保留这个 state</li>
                <li>useState 唯一的参数就是初始 state</li>
                <li>useState 会返回一个数组：一个 state，一个更新 state 的函数</li>
                <li>在初始化渲染期间，返回的状态 (state) 与传入的第一个参数 (initialState) 值相同</li>
                <li>你可以在事件处理函数中或其他一些地方调用这个函数。它类似 class 组件的 this.setState，但是它不会把新的 state 和旧的 state 进行合并，而是直接替换</li>
            </ul>

            <p class="normal-text">举个简单的栗子：</p>
            <Cv {...{ codeId: 'useState', codeType: 'javascript', codeValue: useStateCode }} />
            <p class="normal-text">再举一个等价的 class 示例：</p>
            <Cv {...{ codeId: 'classState', codeType: 'javascript', codeValue: classStateCode }} />
            <p class="normal-text">以上两种示例的效果是相同的，可以很明显的看出 函数式组件和类组件 的区别。</p>

            {/* useEffect  Hook */}
            <p className="title-2">useEffect  Hook</p>
            <ul className="normal-ul">
                <li>effect（副作用）：指那些没有发生在数据向视图转换过程中的逻辑，如 ajax 请求、访问原生dom 元素、本地持久化缓存、绑定/解绑事件、添加订阅、设置定时器、记录日志等。</li>
                <li>副作用操作可以分两类：需要清除的和不需要清除的。</li>
                <li>原先在函数组件内（这里指在 React 渲染阶段）改变 dom 、发送 ajax 请求以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性</li>
                <li>useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 <code className="stress-normal"> componentDidMount </code>、<code className="stress-normal"> componentDidUpdate </code> 和 <code className="stress-normal"> componentWillUnmount </code> 具有相同的用途，只不过被合并成了一个 API</li>
                <li>useEffect 接收一个函数，该函数会在组件渲染到屏幕之后才执行，该函数有要求：要么返回一个能清除副作用的函数，要么就不返回任何内容</li>
                <li>与 <code className="stress-normal"> componentDidMount </code> 或 <code className="stress-normal"> componentDidUpdate </code> 不同，使用 useEffect 调度的 effect 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。大多数情况下，effect 不需要同步地执行。在个别情况下（例如测量布局），有单独的 useLayoutEffect Hook 供你使用，其 API 与 useEffect 相同。</li>
            </ul>

            <p class="normal-text">举个简单的栗子：</p>
            <Cv {...{ codeId: 'useEffect', codeType: 'javascript', codeValue: useEffectCode }} />
        </div>
    )
}