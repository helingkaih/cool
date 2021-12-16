/**
 * 
 * @param {*} vnode 虚拟节点
 * @param {*} container 要渲染到的模板容器
 */
export function render(vnode, container) {
    let ele = createDomElementFrom(vnode); // 将虚拟 dom 装换成真实 dom
    container.appendChild(ele);
}


/**
 * 将虚拟对象装换为真实 dom
 * @param {*} vnode 
 * @returns 
 */
function createDomElementFrom(vnode) {
    let { type, key, props, children, text } = vnode;
    if (type) { // 有类型，说明是标签
        vnode.domElement = document.createElement(type); // 建立虚拟节点和真实元素一个关系，后面可以用来更新真实 dom
        updateProperties(vnode); // 更加虚拟节点的属性更新真实 dom 的元素
        children.forEach(childVnode => {
            render(childVnode, vnode.domElement);
        });
    } else { // 是文本类型的
        vnode.domElement = document.createTextNode(text);
    };
    return vnode.domElement;
}

/**
 * 更新节点的属性
 * @param {*} newVnode 
 * @param {*} oldProps 
 */
function updateProperties(newVnode, oldProps = {}) {
    let domElement = newVnode.domElement; // 真实的dom元素
    let newProps = newVnode.props; // 当前虚拟节点中的属性

    // 如果老的里面有 新的里面没有 这个属性要移除
    for (let oldPro in oldProps) {
        if (!newProps[oldPro]) {
            delete domElement[oldPro];
        };
    };

    // 新老都有 style ,且 style 个别属性 不一样
    let newStyleObj = newProps.style || {};
    let oldStyleObj = oldProps.style || {};

    // for (let propName in oldStyleObj) {
    //     if (!newStyleObj[propName]) {
    //         domElement.style[propName] = ''; // 删除样式，置空即可
    //     }
    // };

    // 如果老的没有 新的有 覆盖即可
    for (let newPro in newProps) {
        // @clicl addEventListener
        if (newPro === 'style') {
            let styleObj = newProps.style;
            for (let s in styleObj) {
                // 给真实 dom 节点赋值属性得这样加
                domElement.style[s] = styleObj[s];
            };
        } else {
            domElement[newPro] = newProps[newPro];
        };
    };
}


export function patch(oldVnode, newVnode) {
    // 类型不同 就不需要再比较了，直接全部替换
    if (oldVnode.type !== newVnode.type) {
        return oldVnode.domElement.parentNode.replaceChild(createDomElementFrom(newVnode), oldVnode.domElement);
    };

    // 文本类型
    if (oldVnode.text) {
        if (oldVnode.text === newVnode.text) return
        return oldVnode.domElement.textContent = newVnode.text;
    }

    //类型相同 根据新节点属性更新老节点属性
    let domElement = newVnode.domElement = oldVnode.domElement;

    updateProperties(newVnode, oldVnode.domElement);

    let oldChildren = oldVnode.children; // 老子节点
    let newChildren = newVnode.children; // 新子节点

    if (oldChildren.length > 0 && newChildren.length > 0) {
        // 都有儿子，比对两个儿子
        updateChildren(domElement, oldChildren, newChildren);
    } else if (oldChildren.length > 0) {
        // 老的有儿子,新的没儿子，直接清空即可
        domElement.innerHTML = '';
    } else if (newChildren.length > 0) {
        // 老的没有儿子，新的有儿子，全部渲染
        for (let i = 0; i < newChildren.length; i++) {
            domElement.appendChild(createDomElementFrom(newChildren[i]));
        };
    };
}

function isSameVnode(oldVnode, newVnode) {
    return oldVnode.type === newVnode.type && oldVnode.key === newVnode.key;
}

function createMapByKeyToIndex(oldChildren) {
    let map = {};
    for (let i = 0; i < oldChildren.length; i++) {
        let current = oldChildren[i];
        if (current.key) {
            map[current.key] = i;
        };
    };
    return map;
}

// diff
function updateChildren(parent, oldChildren, newChildren) {
    let oldStartIndex = 0;
    let oldStartVnode = oldChildren[0];
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex];
    let map = createMapByKeyToIndex(oldChildren);

    let newStartIndex = 0;
    let newStartVnode = newChildren[0];
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex];
    // 判断新老子节点，谁先结束就停止循环
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!newStartVnode) {
            newStartVnode = newChildren[++newStartIndex];
        } else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex];
        };

        // 判断是否是同一节点 type key
        if (isSameVnode(oldStartVnode, newStartVnode)) { // 先比较头
            // 更新属性
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else if (isSameVnode(oldEndVnode, newEndVnode)) { // 头不相等再比较尾巴
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldStartVnode, newEndVnode)) { // 旧头和新尾相等
            patch(oldStartVnode, newEndVnode);
            // 将旧第一节点放到自身末尾
            parent.insertBefore(oldStartVnode.domElement, oldEndVnode.domElement.nextSibling);
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldEndVnode, newStartVnode)) { // 旧尾和新头相等
            patch(oldEndVnode, newStartVnode);
            parent.insertBefore(oldEndVnode.domElement, oldStartVnode.domElement);
            oldEndVnode = oldChildren[--oldEndIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else { // 暴力比对
            let index = map[newStartVnode.key]; // 从旧子节点中找是否有该新节点的 key
            if (index == null) {
                // 旧的子节点中没有该新节点 直接在真实 dom 的 oldStartVnode 之前添加该新节点
                parent.insertBefore(createDomElementFrom(newStartVnode), oldStartVnode.domElement);
            } else {
                // 旧的子节点中有该新节点，挪位置即可
                let toMoveNode = oldChildren[index]; // 从旧节点中取出数据
                patch(toMoveNode, newStartVnode); // 先更新
                parent.insertBefore(toMoveNode.domElement, oldStartVnode.domElement); // 再挪位置
                oldChildren[index] = undefined; // 将旧的位置置空
            };
            newStartVnode = newChildren[++newStartIndex];
        };
    };
    // 新节点还有剩余，添加
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            // 将所有剩余新节点添加到真实 dom 中
            // beforeElement? 从头添加 : 从尾添加
            let beforeElement = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].domElement;
            parent.insertBefore(createDomElementFrom(newChildren[i]), beforeElement);
        }
    };

    // 旧节点还有剩余，删除
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            if (oldChildren[i]) {
                parent.removeChild(oldChildren[i].domElement);
            };
        };
    };
}