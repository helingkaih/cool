import React from 'react';
import { useSelector } from 'react-redux';
export default function Second(props) {
    console.log('second')
    let current = useSelector((state) => {
        return state.todo[0]
    })

    return (
        <>
            <p>second中显示{current}</p>
        </>
    )
}

