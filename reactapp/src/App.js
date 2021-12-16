import React from 'react';
import { HashRouter } from 'react-router-dom';
import routeConfig from "./router/route"
import { renderRoutes } from 'react-router-config';
import Menu from './components/menu';
import Box from '@material-ui/core/Box';
import './styles/main.scss';

export default function App() {
    return (
        <HashRouter>
            <Box sx={{ display: 'flex' }}>
                <Menu />
                <Box sx={{ flexGrow: 1, padding: '96px 17%' }}>
                    {renderRoutes(routeConfig)}
                </Box>
            </Box>
        </HashRouter>
    );
};
