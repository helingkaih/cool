import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            // 头部 head tab 集合,
            tabList: [{ name: "主页", path: "/home/dashboard" }],
            // 当前正在看的 tab
            currentTab: {},
            // 路由配置 改路径的话需要同步修改 route.js
            tabPages: [
                {
                    label: "home",
                    name: "主页",
                    icon: "HomeFilled",
                    path: "/home",
                    menu: [{ name: "主页", path: "/dashboard", icon: "el-icon-s-home" }],
                },
                {
                    label: "assembly",
                    name: "组件",
                    icon: "set-up",
                    path: '/assembly',
                    menu: [
                        {
                            name: "图标",
                            icon: "el-icon-picture",
                            child: [
                                { name: "el 图标", path: "/elicon", icon: "el-icon-eleme" },
                                {
                                    name: "el+ 图标",
                                    path: "/eliconplus",
                                    icon: "el-icon-platform-eleme",
                                },
                            ],
                        },
                        {
                            name: "表单",
                            path: "/list",
                            icon: "el-icon-tickets",
                            child: [
                                { name: "基础表单", path: "/baseForm" }
                            ],
                        },
                    ],
                },
                {
                    label: "note",
                    name: "笔记",
                    icon: "Notebook",
                    path: "/note",
                    menu: [
                        {
                            name: "vue 3", icon: "el-icon-coffee-cup", child: [
                                { name: "响应式原理", path: "/reactivity" },
                                { name: "计算属性", path: "/computed" }
                            ],
                        },
                        { name: "vue 2", path: "/vue2", icon: "el-icon-hot-water" },
                        {
                            name: "javascript", icon: "el-icon-position", child: [
                                { name: "设计原则", path: "/jsprinciple" },
                                { name: "设计模式", path: "/jsmodel" }
                            ],
                        }
                    ],
                },
                {
                    label: "feature", name: "功能", icon: "set-up", path: "/feature", menu: [
                        { name: "Promise", path: "/promise", icon: "el-icon-share" },
                        { name: "虚拟 DOM", path: "/virtual", icon: "el-icon-refresh" },
                        { name: "Event Loop", path: "/eventloop", icon: "el-icon-tickets" },
                    ]
                },
            ],
        }
    },
    // getters: {
    //     tabList: (state) => state.tabList,
    //     currentTab: (state) => state.currentTab,
    // },
    mutations: {

        addTabList(state, tab) {
            if (state.tabList.findIndex((item) => { return item.name === tab.name }) === -1) {
                state.tabList.push(tab);
            }
            state.currentTab = tab;
        },
        deleteTabList(state, tab) {
            const index = state.tabList.findIndex((item) => { return item.name === tab.name });
            if (state.currentTab.name === tab.name) {
                state.currentTab = state.tabList[index - 1]
            };
            state.tabList.splice(index, 1);
        }

    },
    actions: {
        addTabList({ commit }, tab) {
            commit('addTabList', tab)
        },
        deleteTabList({ commit }, tab) {
            commit('deleteTabList', tab)
        },
    }
})

export default store
