import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Second from './second';
export default function First(props) {
    const dispatch = useDispatch()
    let current = useSelector((state) => {
        return state.todo[0]
    })
    const Hlk = (event) => {
        dispatch({ type: 'ADD_TODO', num: 2 });
    }

    return (
        <>
            <button onClick={Hlk}>{current}</button>
            <Second />
        </>
    )
}

