import React from 'react';
import { ThemeContext } from '../../../common/context/test';
import Son from './Son';
export default function Child(props) {

    return (
        <ThemeContext.Consumer>
            {theme => (
                <>
                    <p>{theme.foreground}121</p>
                    <button>child</button>
                    <Son />
                </>
            )}

        </ThemeContext.Consumer >
    )
}

