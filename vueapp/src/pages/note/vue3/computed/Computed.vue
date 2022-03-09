<template>
  <div class="main-normal-box flex-start">
    <div class="doc-main">
      <p class="title-1">计算属性 Computed</p>
      <p class="title-2" id="WhatComputed">什么是 Computed</p>
      <p class="text-info">
        本文是源码解析，使用的 vue 版本是 ^3.2.20 ，源码文件位于
        node_modules\@vue\reactivity\dist\reactivity.esm-bundler.js
      </p>
      <p class="text-normal">
        Computed 是 vue3 提供的一个
        API，用来实现响应式功能的，其实现过程跟上一篇文章讲的响应式原理 (
        建议看完再看这一篇 ) 基本一样
      </p>
      <p class="title-2" id="UseComputed">怎么使用 Computed</p>
      <p class="text-normal">首先需要引入 computed，再根据需求传入参数即可。</p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Computeda }} </code>
    </pre>
      <p class="title-2" id="FunComputed">Computed 方法</p>
      <p class="text-normal">直接贴源码：</p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Computedb }} </code>
    </pre>
      <p class="text-normal">
        如果你看过了上一篇 响应式原理 的介绍会发现，ComputedRefImpl 类 和
        reactive 方法非常的相像，有一点不同的是 effect 用 ReactiveEffect
        类处理了一下，我们接着看看 ReactiveEffect 类又是做什么的。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Computedc }} </code>
    </pre>
      <p class="text-normal">
        上面这段代码比较复杂，有点看不太懂，目前可以知道的是 ReactiveEffect 将
        effect 方法封装成了一个拥有 getter 和 scheduler
        的类。当属性值发生变化的时候，会触发 triggerEffects
        函数进行派发更新，将所有依赖这个属性的 effect 函数循环遍历，如果有
        scheduler 的话就执行 scheduler ，从之前的代码可以看到，scheduler 会先将
        _dirty 改为 true 并执行 triggerRefValue ( 该函数会再次执行
        triggerEffects 但只会传 dep
        )完成值的更新，然后通知依赖计算属性的副作用函数进行更新,
        当依赖计算属性的副作用函数收到通知的时候就会访问计算属性的 get
        函数，此时会根据 _dirty 值来确定是否需要重新计算。
      </p>
      <p class="text-normal">
        Computed
        源码分析就到这了，由于之前讲过响应式原理，这里就不需要太多的赘述了，这里只分析了一些关键代码，还有些辅助代码没有展示，都在源码中可以找到。
      </p>
    </div>
    <anchor :anchorData="anchorData"></anchor>
  </div>
</template>

<script>
import anchor from "../../../../components/anchor";
export default {
  name: "Computed",
  components: { anchor },
  setup() {
    const anchorData = [
      { id: "WhatComputed", title: "什么是 Computed" },
      { id: "UseComputed", title: "怎么使用 Computed" },
      { id: "FunComputed", title: "Computed 方法" },
    ];
    const Computeda = `
        方法1：接受一个 getter 函数，并根据 getter 的返回值返回一个不可变的响应式 ref 对象。
        const count = ref(1)
        const plusOne = computed(() => count.value + 1)
        console.log(plusOne.value) // 2
        什么是不可变的响应式呢？即执行这个代码 plusOne.value++ 是错误的，plusOne.value 是只读的

        方法2：接受一个具有 get 和 set 函数的对象，用来创建可写的 ref 对象。
        const count = ref(1)
        const plusOne = computed({
            get: () => count.value + 1,
            set: val => {
                count.value = val - 1
            }
        })
        plusOne.value = 1
        console.log(count.value) // 0
    `;
    const Computedb = `
        function computed(getterOrOptions, debugOptions) {
            let getter;
            let setter;
            const onlyGetter = isFunction(getterOrOptions);
            if (onlyGetter) {
                getter = getterOrOptions;
                setter = (process.env.NODE_ENV !== 'production')
                    ? () => {
                        console.warn('Write operation failed: computed value is readonly');
                    }
                    : NOOP;
            }
            else {
                getter = getterOrOptions.get;
                setter = getterOrOptions.set;
            }
            // 截止到这里，好像也没啥特别的处理，我们可以看到，之所以 Computed 的使用方法1 obj.value++ 会报错
            // 因为只传一个 getter 的话，那 setter 就是只读的了
            // 重点是下面这行的 ComputedRefImpl 类
            const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter);
            if ((process.env.NODE_ENV !== 'production') && debugOptions) {
                cRef.effect.onTrack = debugOptions.onTrack;
                cRef.effect.onTrigger = debugOptions.onTrigger;
            }
            return cRef;
        }

        class ComputedRefImpl {
            constructor(getter, _setter, isReadonly) {
                this._setter = _setter;
                this.dep = undefined;
                this._dirty = true; // 是否需要重新赋值
                this.__v_isRef = true; // 是否是个 ref 对象
                this.effect = new ReactiveEffect(getter, () => { // 创建一个影响关系，第二个参数是一个调度器
                    if (!this._dirty) {
                        this._dirty = true;
                        triggerRefValue(this);
                    }
                });
                this["__v_isReadonly" /* IS_READONLY */] = isReadonly;
            }
            get value() {
                // the computed ref may get wrapped by other proxies e.g. readonly() #3376
                const self = toRaw(this); // 判断 this 是否已经是 ref 对象，为啥？看上面这一行
                trackRefValue(self);
                if (self._dirty) { // 是否需要重新赋值
                    self._dirty = false; // 开始更新，并将 _dirty 改为 false
                    self._value = self.effect.run(); // 需要赋值，获取新值后重新赋给缓存
                }
                return self._value; // 将缓存返回
            }
            set value(newValue) {
                this._setter(newValue);
            }
        }
    `;
    const Computedc = `
        class ReactiveEffect {
            constructor(fn, scheduler = null, scope) {
                this.fn = fn;
                this.scheduler = scheduler;
                this.active = true;
                this.deps = [];
                recordEffectScope(this, scope);
            }
            run() {
                if (!this.active) {
                    return this.fn();
                }
                if (!effectStack.includes(this)) {
                    try {
                        effectStack.push((activeEffect = this));
                        enableTracking();
                        trackOpBit = 1 << ++effectTrackDepth;
                        if (effectTrackDepth <= maxMarkerBits) {
                            initDepMarkers(this); // 初始化所有 effect
                        }
                        else {
                            cleanupEffect(this); // 清空所有 effect
                        }
                        return this.fn();
                    }
                    finally {
                        if (effectTrackDepth <= maxMarkerBits) {
                            finalizeDepMarkers(this);
                        }
                        trackOpBit = 1 << --effectTrackDepth;
                        resetTracking();
                        effectStack.pop();
                        const n = effectStack.length;
                        activeEffect = n > 0 ? effectStack[n - 1] : undefined;
                    }
                }
            }
            stop() {
                if (this.active) {
                    cleanupEffect(this);
                    if (this.onStop) {
                        this.onStop();
                    }
                    this.active = false;
                }
            }
        }
        function triggerEffects(dep, debuggerEventExtraInfo) {
            // spread into array for stabilization
            for (const effect of isArray(dep) ? dep : [...dep]) {
                if (effect !== activeEffect || effect.allowRecurse) {
                    if ((process.env.NODE_ENV !== 'production') && effect.onTrigger) {
                        effect.onTrigger(extend({ effect }, debuggerEventExtraInfo));
                    }
                    if (effect.scheduler) { 
                        effect.scheduler();
                    }
                    else {
                        effect.run();
                    }
                }
            }
        }
    `;

    return {
      anchorData,
      Computeda,
      Computedb,
      Computedc,
    };
  },
};
</script>

<style>
</style>