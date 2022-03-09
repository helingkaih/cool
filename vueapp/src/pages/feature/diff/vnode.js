export default function vnode(type, key, props, children, text) {
    return {
        type,
        props,
        key,
        children,
        text
    };
};