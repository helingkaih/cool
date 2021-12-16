import { useEffect } from 'react';
import ExRadio from './radio';
import ExleSelect from './select'

export default function ExAll() {
    let value = 'female';
    useEffect(
        () => {
        }
    )
    return (
        <>
            <ExRadio {...{ value }} />
            <ExleSelect />
        </>
    )
}