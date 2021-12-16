const targetMap = new WeakMap();
let activeEffect = null;
function effect(eff) {
    activeEffect = eff;
    activeEffect();
    activeEffect = null;
}
function ref(raw) {
    const r = {
        get value() {
            track(r, 'value')
            return raw
        },
        set value(newVal) {
            raw = newVal;
            trigger(r, 'value')
        },
    }
    return r
}
function reactive(target) {
    const handler = {
        // receiver 用来指正 this 为当前的对象
        // Reflect 的用法跟 target.key target[key] 类似
        get(target, key, receiver) {
            let result = Reflect.get(target, key, receiver);
            // 数据被其他地方用到( 访问 ) 了，加入追踪
            track(target, key);
            return result;
        },
        set(target, key, value, receiver) {
            let oldValue = target[key];
            let result = Reflect.set(target, key, value, receiver);
            if (oldValue != value) {
                // 如果新值和旧值不一样，就触发更新
                trigger(target, key);
            }
            return result;
        },
    };
    return new Proxy(target, handler);
}

function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    let dep = depsMap.get(key);
    if (dep) {
        // 执行所以被 key 影响的 effect，没有就不管
        dep.forEach((effect) => {
            effect();
        });
    }
}

function track(target, key) {
    if (activeEffect) { // 如果当前的操作不需要响应式处理，直接跳出
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = new Set()));
        }
        dep.add(activeEffect);
    }
}
export { effect, ref, reactive, trigger, track }