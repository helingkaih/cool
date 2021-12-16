import React from 'react';
import { Redirect } from 'react-router-dom';
import Home from '../pages/home/home';
import First from '../pages/exercise/redux/first';
import hooksBase from '../pages/note/hooksBase';
import hooksAdvanced from '../pages/note/hooksAdvanced';
import ExAll from '../pages/exercise/all';

const routeConfig = [
    {
        path: "/",
        exact: true,
        render: () => (
            <Redirect to={"/home"} />
        )
    },
    {
        path: "/home",
        component: Home,
    },
    {
        path: "/note/first",
        component: First
    },
    {
        path: "/note/hooksBase",
        component: hooksBase
    },
    {
        path: "/note/hooksAdvanced",
        component: hooksAdvanced
    },
    {
        path: "/exercise",
        component: ExAll
    }
]

export default routeConfig;