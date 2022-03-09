import hljs from 'highlight.js';
import { useEffect } from 'react';
import '../styles/code.scss';

export default function Cv(props) {
    useEffect(() => {
        // 初始化 hljs
        hljs.highlightAll();

        // 创建 pre code dom 节点
        let div = document.getElementById(props.codeId);
        let pre = document.createElement('pre');
        let code = document.createElement('code');
        code.className = props.codeType;

        // 用 hljs 转换字符串 原理是 关键字匹配替换
        let html = hljs.highlight(props.codeValue, { language: props.codeType }).value;

        // 将转换好的 html 元素渲染
        code.innerHTML = html;
        pre.appendChild(code);
        div.appendChild(pre);
    })

    return (
        <div id={props.codeId} className='cvstyle' ></div>
    );
};