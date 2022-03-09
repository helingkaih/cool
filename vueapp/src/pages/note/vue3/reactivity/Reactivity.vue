<template>
  <div class="main-normal-box flex-start">
    <div class="doc-main">
      <p class="title-1">响应式原理</p>
      <p class="title-2" id="WhatReact">什么是响应式</p>
      <p class="text-normal">
        简单的一句话说明：a = b + c ，b 的值被修改后，a 的值也要自动变化。
      </p>
      <p class="title-2" id="WhyReact">为什么需要响应式</p>
      <p>接着上面讲的例子：</p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemoa }} </code>
    </pre>
      <p class="text-normal">
        从代码中可以看到，在没有响应式的情况下，当 b 发生变化之后，需要再次给 a
        赋值，虽然看起来也没多少代码，但是在业务中，这种变化会非常多，要是还这样赋值，代码会跟鬼一样，所以我们需要用响应式，让
        a 自动修改。
      </p>
      <p class="title-2" id="effect">effect track trigger</p>
      <p class="text-normal">
        我们先假设一种场景：总价=成本*数量 (
        为什么不是售价而是成本，售价之后会用到 )，贴代码。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemob }} </code>
    </pre>
      <p class="text-normal">
        我们要的是 改变 price ，然后 total 自动变化。大体思路是将 total 与 price
        的关系式 (影响关系) 存储起来，当 price
        的值发生变化的时候，去调用影响关系改变 total 的值。做法如下：
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemoc }} </code>
    </pre>
      <p class="text-normal">
        实际情况中，一个值发生变化很可能影响的不止一个地方，与 price
        相关的影响关系应当存放到一个集合中。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemod }} </code>
    </pre>
      <p class="text-normal">
        这样一来，dep 中就存放了所有会因 price 变化而变化的影响关系函数，当
        price 发生变化时，我们只需要触发 dep 中所有的 effect 即可。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemoe }} </code>
    </pre>
      <p class="title-2" id="targetMap">目标图</p>
      <p class="text-normal">
        一般情况下，一个对象会有多个属性，每个属性都需要自己的
        dep，为了实现这一功能，我们需要对上面的代码做一些变化。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemof }} </code>
    </pre>
      <p class="text-normal">
        我们将 price 和 quantity 封装到一个产品对象中，price 和 quantity
        发生变化都会造成不同的影响，换句话说，product 的每个属性都要有属于自己的
        dep。要把这些 dep 存储起来方便之后使用，所以我们还需要一个
        depsMap。product 对象就是一个 depsMap ，key 是对象的属性，value
        就是各个属性的 deps。
      </p>
      <el-image
        key="depsmap"
        :src="require('../../../../assets/vue3/depsmap.png')"
        :preview-src-list="[require('../../../../assets/vue3/depsmap.png')]"
      ></el-image>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemog }} </code>
    </pre>
      <p class="text-normal">
        截止目前为止，我们完成了对一个对象的不同属性跟踪依赖的方法，但是如果有多个对象呢，所以我们还需要一张图，用来存储每一个响应式对象与它们各自的
        depsMap。这就是 vue 3 中所说的目标图。
      </p>
      <el-image
        key="vDomtargetmappng"
        :src="require('../../../../assets/vue3/targetmap.png')"
        :preview-src-list="[require('../../../../assets/vue3/targetmap.png')]"
      ></el-image>
      <p class="text-normal">
        从图中可以看到，targetMap 的 key
        是对象类型。接下来需要对代码再做一些修改。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemoh }} </code>
    </pre>
      <p>
        截止目前为止，我们已经初步完成了响应式关系的存储，我们现在只需要执行
        track 和 trigger 即可完成响应式处理：
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemoi }} </code>
    </pre>
      <p class="text-normal">
        但是还没结束，我们一开始讲了要让被影响的值自动变化，我们现在还在手动监听手动变化，继续往下看。
      </p>
      <p class="title-2" id="automation">响应式自动化</p>
      <p class="text-normal">
        要实现这一功能，我们将会用到访问器属性 get 和
        set，我们要修改这两个方法使其做一些额外的操作，这一过程，叫做属性劫持，在
        vue2 中是通过 es5 的 Object.defineProperty 实现的，vue3 中用的是 es6 的
        Proxy 和 Reflect。
      </p>
      <p class="text-normal">
        我们需要用 Proxy 完成对象的代理，为 get 和 set 方法增加一些 track 和
        trigger 的操作，这样一来，当我们访问属性和修改属性时，会触发 get 和
        set，继而完成响应式变化，这样看起来很自动化。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemoj }} </code>
    </pre>
      <p class="text-normal">
        上述过程即可完成对 product
        的代理(属性劫持)，重点是第二个参数，是一个处理函数，我们要做的就是修改这个处理函数，举个例子：
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemok }} </code>
    </pre>
      <p class="text-normal">
        按理来说我们访问 product.quantity 应该返回的是 2
        ，但经过代理之后，返回的是我们自定义的数据。
      </p>
      <p class="text-normal">
        我们现在新建一个构造函数，来完成对一个对象的代理，使它成为一个自动化的响应式对象。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemol }} </code>
    </pre>
      <p class="text-normal">
        现在有了代理之后，我们不需要手动去执行 track 和 trigger
        方法了，改变属性值，被影响的地方也会自动改变。
      </p>
      <p class="title-2" id="activeEffect">activeEffect</p>
      <p class="text-normal">
        目前的代码中还是有一些小瑕疵的，比如我们直接访问对象属性，会发生什么?
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemom }} </code>
    </pre>
      <p class="text-normal">
        结果很明显，直接输出改属性的值，但是这个过程会有点问题，经过代理后，我们访问
        product.quantity ，会执行 get 方法，在该方法中回去执行 track
        ，完成目标图的构建，但我们完全不需要这样操作，我现在只是简单的访问一下属性，不需要响应式的相关处理，这样做只会占用资源，所以我们还需要添加一个
        activeEffect 参数。track 判断如果 activeEffect
        不存在，则打断之后的处理，只有 set 方法会使 activeEffect 存在值。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemon }} </code>
    </pre>
      <p class="title-2" id="ref">ref</p>
      <p class="text-normal">
        回收开头留下的问题 ( 为什么不用售价 )
        ，我们现在添加一个售价变量，并修改总价的计算方法
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemoo }} </code>
    </pre>
      <p class="text-normal">
        这时候，如果我们修改 salePrice 的值，total 是不会发生改变的，因为
        salePrice 不是个响应式属性，我们需要把他做成响应式属性，这个时候就需要
        vue 的 ref 方法了。
      </p>
      <p class="text-normal">
        ref 方法接受一个值，并返回一个响应的，可变的 ref 对象，该对象只有一个
        value 属性，指向内部的值。所以我们需要再修改一下 total 的计算方式。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemop }} </code>
    </pre>
      <p class="text-normal">
        现在我们来实现一下 ref 的功能，类似于 reactive 方法( 你也可以直接用
        reactive )。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ Reactdemoq }} </code>
    </pre>
      <p class="text-normal">
        到此，vue 3
        的响应式原理就分析结束了，在本模块的代码中可以找到以上相关代码。
      </p>
    </div>
    <anchor :anchorData="anchorData"></anchor>
  </div>
</template>

<script>
import anchor from "../../../../components/anchor.vue";
import { effect, ref, reactive, trigger, track } from "./reactdemo";
export default {
  name: "Reactivity",
  components: { anchor },
  setup() {
    const anchorData = [
      { id: "WhatReact", title: "什么是响应式" },
      { id: "WhyReact", title: "为什么需要响应式" },
      { id: "effect", title: "effect track trigger" },
      { id: "targetMap", title: "目标图" },
      { id: "automation", title: "响应式自动化" },
      { id: "activeEffect", title: "activeEffect" },
      { id: "ref", title: "ref" },
    ];
    const Reactdemoa = `
        let b = 1,c = 1;
        let a = b + c;
        console.log('a',a); // a=2
        b = 2; // a=2
        a = b + c; // a=3
        console.log('a',a); // a=3
    `;
    const Reactdemob = `
        let price = 5;
        let quantity = 2;
        let total = 0;
        total = price * quantity;
    `;
    const Reactdemoc = `
        let effect = function () { // 影响关系
            total = price * quantity;
        };
        track(effect); // 将 effect 存储起来
    `;
    const Reactdemod = `
        let dep = new Set(); // 依赖关系集合
        let track=function(effect){
            dep.add(effect); // 使用 set 不会重复存放 effect
        };
    `;
    const Reactdemoe = `
        let trigger=function(){
            dep.forEach(effect => {
                effect();
            });
        }
    `;
    const Reactdemof = `
        let product = { price: 5, quantity: 2 };
    `;
    const Reactdemog = `
        let product = { price: 5, quantity: 2 };
        let total = 0;
        let effect = () => {
            total = product.price * product.quantity;
        };
        const depsMap = new Map();
        function track(key) {
            let dep = depsMap.get(key);
            if (!dep) {
                // 如果 key 没有建立 dep ，就新建一个
                depsMap.set(key, (dep = new Set()));
            }
            dep.add(effect);
        }
        function trigger(key) {
            let dep = depsMap.get(key);
            if (dep) {
                dep.forEach(effect => {
                    effect();
                });
            }
        }
        track('quantity');
        effect() // total=10;
        product.quantity = 4;
        trigger('quantity');
        console.log('total', total) // total 20
    `;
    const Reactdemoh = `
        let product = { price: 5, quantity: 2 };
        let total = 0;
        let effect = () => {
            total = product.price * product.quantity;
        };
        const depsMap = new Map();
        const targetMap = new WeakMap();
        /**
         * @param target 对象
         * @param key 对象中的某个属性
         */
        function track(target, key) {
            let depsMap = targetMap.get(target);
            if (!depsMap) {
                targetMap.set(target, (depsMap = new Map()))
            }
            let dep = depsMap.get(key);
            if (!dep) {
                // 如果 key 没有建立 dep ，就新建一个
                depsMap.set(key, (dep = new Set()));
            }
            dep.add(effect);
        }
        function trigger(key) {
            const depsMap = targetMap.get(target);
            if (!depsMap) { return } // 如果目标图中没有相关的 depsMap，说明该对象没有建立响应式关系，直接返回
            let dep = depsMap.get(key);
            if (dep) {
                dep.forEach(effect => {
                    effect();
                });
            }
        }
        track(product, 'quantity');
        effect() // total=10;
        product.quantity = 4;
        trigger(product, 'quantity');
        console.log('total', total) // total 20
    `;
    const Reactdemoi = `
        track(product, 'quantity'); // 追踪 product 对象的 quantity 属性的变化
        trigger(product, 'quantity'); // 更新被 product 对象的 quantity 属性影响的值
    `;
    const Reactdemoj = `
        let product = { price: 5, quantity: 2 };
        let proxy = new Proxy(product, {});
    `;
    const Reactdemok = `
        let product = { price: 5, quantity: 2 };
        product = new Proxy(product, {
        get() {
            console.log("属性劫持");
            return "abc";
        },
        });
        console.log(product.quantity);
        // 打印结果：
        // 属性劫持
        // abc
    `;
    const Reactdemol = `
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
        let product = reactive({ price: 5, quantity: 2 });
        effect()
        console.log(total) // 10
        product.quantity = 3;
        console.log(total) // 15
    `;
    const Reactdemom = `
        console.log(product.quantity); // 2
    `;
    const Reactdemon = `
        let activeEffect = null;
        function effect(eff) {
            activeEffect = eff;
            activeEffect();
            activeEffect = null;
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
        effect(() => {
            total = product.price * product.quantity;
        });
    `;
    const Reactdemoo = `
        let salePrice = 0;
        effect(() => {
            total = salePrice * product.quantity;
        });
    `;
    const Reactdemop = `
        effect(() => {
            total = salePrice.value * product.quantity;
        });
    `;
    const Reactdemoq = `
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
    `;
    return {
      anchorData,
      Reactdemoa,
      Reactdemob,
      Reactdemoc,
      Reactdemod,
      Reactdemoe,
      Reactdemof,
      Reactdemog,
      Reactdemoh,
      Reactdemoi,
      Reactdemoj,
      Reactdemok,
      Reactdemol,
      Reactdemom,
      Reactdemon,
      Reactdemoo,
      Reactdemop,
      Reactdemoq,
    };
  },
};
</script>

<style>
</style>