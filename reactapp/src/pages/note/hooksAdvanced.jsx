import React from 'react';
import Cv from '../../components/codeview';

const useMemo1 = `
import React, {useState, useCallback, useEffect, useMemo, memo} from 'react'

// 函数组件，当前组件中useMemo的使用
export default function function App() {
    const [count, setCount] = useState(0)

    const double = useMemo(()=>{
        console.log('double')
        return count * 2
    },[count])

    return (
        <div>
            <button onClick={() => {
                setCount(count + 1)
            }}>点击+1
            </button>
            <div>Count is :{count}</div>
            <div>Double is :{double}</div>
        </div>
    )
}
`;

const useMemo2 = `
const Counter = memo(function Counter(props) {
    console.log('counter')
    return (
        <div>
            double is : {props.counter}
        </div>
    )
})

export default function function App (){
    const [count, setCount] = useState(0)

    const double = useMemo(()=>{
        return count * 2
    }, [count === 2])

    return (
        <div>
            <button onClick={()=>{setCount(count + 1)}}>点击+1</button>
            <div>count is : {count}</div>
            <Counter counter = {double}></Counter>
        </div>
    )
}
`;

const useCallBack = `
//函数组件，父组件，子组件
const Counter = memo(function Counter(props) {
    console.log('counter')
    return (
        <div>
            double is : {props.counter}
        </div>
    )
})

export default function function App (){
    const [count, setCount] = useState(0)

    const double = useMemo(()=>{
        return count * 2
    }, [count === 2])

    const btnClick = useCallback(()=>{
        console.log('click')
    }, [])

    return (
        <div>
            <button onClick={()=>{setCount(count + 1)}}>点击+1</button>
            <div>count is : {count}</div>
            <Counter counter = {double} onClick={btnClick}></Counter>
        </div>
    )
}
`;
const useReducer = `
const initialState = 0; // 初始值
function reducer(state, action) { // dispatch 方法
    switch (action.type) {
        case 'increment':
            return {number: state.number + 1};
        case 'decrement':
            return {number: state.number - 1};
        default:
            throw new Error();
    }
}
function init(initialState){ // 初始化函数
    return {number:initialState};
}
function Counter(){
    const [state, dispatch] = useReducer(reducer, initialState,init);
    return (
        <>
            Count: {state.number}
            <button onClick={() => dispatch({type: 'increment'})}>+</button>
            <button onClick={() => dispatch({type: 'decrement'})}>-</button>
        </>
    )
}
`;
const useLayoutEffect = `
export default function function App (){
    const [color, setColor] = useState('red');
    useLayoutEffect(() => {
        alert(color);
    });
    useEffect(() => {
        console.log('color', color);
    });
    return (
        <>
            <div id="myDiv" style={{ background: color }}>颜色</div>
            <button onClick={() => setColor('red')}>红</button>
            <button onClick={() => setColor('yellow')}>黄</button>
            <button onClick={() => setColor('blue')}>蓝</button>
        </>
    );
}
`;

const useRef = `
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
function Parent() {
    let [number, setNumber] = useState(0);
    return (
        <>
            <Child />
            <button onClick={() => setNumber({ number: number + 1 })}>+</button>
        </>
    )
}
let input;
function Child() {
    const inputRef = useRef();
    console.log('input===inputRef', input === inputRef);
    input = inputRef;
    function getFocus() {
        inputRef.current.focus();
    }
    return (
        <>
            <input type="text" ref={inputRef} />
            <button onClick={getFocus}>获得焦点</button>
        </>
    )
}
ReactDOM.render(<Parent />, document.getElementById('root'));
`;


export default function hooksAdvanced() {
    return (
        <div>
            <p className="title-1">HookS 进阶篇</p>

            {/* useMemo */}
            <p className="title-2">useMemo</p>
            <ul className="normal-ul">
                <li>useMemo 第一个参数是函数，第二个参数是数组</li>
                <li>如果第二个参数不传递，与 useEffect 类似，意味着每次都会执行第一个函数参数，则使用 useMemo 就毫无意义</li>
                <li>如果第二个参数传的是空数组 [] ， 与 useEffect 类似，只执行一次，类似类组件 componentDidmount </li>
                <li>useMemo 与 useEffect 有不一样的一点就是调用时机 —— useEffect 执行的是副作用，所以一定是在渲染之后运行的；而 useMemo 是需要有返回值的，返回值会参与渲染，所以 useMemo 是在渲染期间完成的。</li>
                <li>useMemo ，定义了一段函数逻辑，根据第二个参数判断是否执行第一个函数执行</li>
            </ul>

            <p className="title-3">举一个简单的栗子：</p>
            <p className="normal-text">
                这个例子中 useMemo 的依赖项是 count ，所以，每点击一下， count 值变化 double 也会变化。
                可以试着修改这个依赖项，不填，或者填个条件 count===4 都会有不同的效果。
            </p>
            <Cv {...{ codeId: 'useMemo1', codeType: 'javascript', codeValue: useMemo1 }} />

            <p className="title-3">父子组件中使用示例：</p>
            <p className="normal-text">
                这个例子中只有点击第 2 、3 下的时候，子组件中才会有日志输出，这样做可以起到性能优化的作用，控制子组件的渲染，注意，传给子组件的参数必须都用 useMemo 包裹处理。
            </p>
            <Cv {...{ codeId: 'useMemo2', codeType: 'javascript', codeValue: useMemo2 }} />

            <p className="title-2">useCallback</p>
            <p className="normal-text">
                useCallBack 接收一个内联回调函数参数和一个依赖项数组（子组件依赖父组件的状态，即子组件会使用到父组件的值） ，useCallback 会返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新(个人不太理解为什么要传递函数，直接在子组件中写函数不行嘛)，同样，效果跟 useMemo 类似，也需要设置依赖项，否则不生效，举个栗子：
            </p>
            <Cv {...{ codeId: 'useCallBack', codeType: 'javascript', codeValue: useCallBack }} />

            <p className="title-2">useReducer</p>
            <ul className="normal-ul">
                <li>useReducer 和 redux 中 reducer 很像</li>
                <li>useState 内部就是靠 useReducer 来实现的</li>
                <li>useState 的替代方案，它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法</li>
                <li>在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等</li>
            </ul>
            <Cv {...{ codeId: 'useReducer', codeType: 'javascript', codeValue: useReducer }} />

            <p className="title-2">useLayoutEffect</p>
            <ul className="normal-ul">
                <li>useEffect 在全部渲染完毕后才会执行</li>
                <li>useLayoutEffect 会在 浏览器 layout 之后，painting 之前执行</li>
                <li>其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect</li>
                <li>可以使用它来读取 DOM 布局并同步触发重渲染</li>
                <li>在浏览器执行绘制之前 useLayoutEffect 内部的更新计划将被同步刷新</li>
                <li>尽可能使用标准的 useEffect 以避免阻塞视图更新</li>
            </ul>
            <Cv {...{ codeId: 'useLayoutEffect', codeType: 'javascript', codeValue: useLayoutEffect }} />

            <p className="title-2">useRef</p>
            <ul className="normal-ul">
                <li>类组件、React 元素用 React.createRef，函数组件使用 useRef</li>
                <li>useRef 返回一个可变的 ref 对象，其 current 属性被初始化为传入的参数（initialValue）</li>
                <li>useRef 返回的 ref 对象在组件的整个生命周期内保持不变，也就是说每次重新渲染函数组件时，返回的ref 对象都是同一个（使用 React.createRef ，每次重新渲染组件都会重新创建 ref）</li>
            </ul>
            <Cv {...{ codeId: 'useRef', codeType: 'javascript', codeValue: useRef }} />
        </div>
    )
}