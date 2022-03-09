import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemButton from '@material-ui/core/ListItemButton'
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/Inbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { withRouter } from 'react-router-dom';
const drawerWidth = 280;
const menuList = [
    {
        title: '主页',
        route: ''
    },
    {
        title: 'react 知识点',
        child: [
            { title: 'HookS 基础篇', route: '/note/hooksBase' },
            { title: 'HookS 进阶篇', route: '/note/hooksAdvanced' },
            { title: '函数式组件和类组件', route: '' }
        ]
    },
    {
        title: '练习',
        route: '/exercise'
    },
    {
        title: '测试',
        route: '/note/first'
    }
];

class Menu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: 0
        };
    }

    /**
     * 激活列表中的某一父项
     * @param {*} open 
     */
    handleFatherClick(open) {
        // 如果当前点击的父项已经打开了
        if (this.state.open === open) {
            open = '';
        };
        this.setState(
            { open }
        )
    }

    render() {
        return (
            <Box sx={{ display: 'flex' }}>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <List component="nav">
                        {menuList.map((item, index) => (
                            <ListItem sx={{ display: 'block' }} key={item.title}>
                                <ListItemButton onClick={() => item.child ? this.handleFatherClick(item.title) : this.props.history.push(item.route)}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} />
                                    {item.child ? (this.state.open === item.title ? <ExpandLess /> : <ExpandMore />) : null}
                                </ListItemButton>
                                {item?.child ? <Collapse in={this.state.open === item.title} timeout="auto" unmountOnExit>
                                    {item?.child.map((citem, index) => (
                                        <ListItemButton key={citem.title} onClick={() => this.props.history.push(citem.route)}>
                                            <ListItemText inset primary={citem.title} />
                                        </ListItemButton>
                                    ))}
                                </Collapse> : null}
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Box>
        )
    };
}

export default withRouter(Menu);