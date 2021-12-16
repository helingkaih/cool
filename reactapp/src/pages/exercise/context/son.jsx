import React from 'react';
import { ThemeContext } from '../../../common/context/test';
export default class Son extends React.Component {
    constructor() {
        super();
        this.state = {
            a: 1
        };
    }
    static contextType = ThemeContext
    render() {
        let theme = this.context;
        return (
            <>
                <button>{theme.foreground}</button>
            </>
        )
    }
}

