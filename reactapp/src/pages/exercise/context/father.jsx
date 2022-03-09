// https://www.jianshu.com/p/5e7ba0aa7f98
import React, { useState } from 'react';
import Child from './child';
import { ThemeContext, themes } from '../../../common/context/test';
export default function First(props) {
    const [obj, setObj] = useState(themes.dark)
    const Hlk = (event) => {
        setObj(
            {
                foreground: '#wwwww',
                background: '#222'
            }
        )
    }
    const callBackfun = (event) => {
        console.log('event', event)
    }

    return (
        <ThemeContext.Provider value={obj}>
            <button onClick={Hlk}>更改default</button>
            <Child callBack={callBackfun} />
        </ThemeContext.Provider>
    )
}

