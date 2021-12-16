<template>
  <div class="main-normal-box flex-start">
    <div class="doc-main">
      <p class="title-1">Promise</p>
      <p class="title-2" id="WhatPromise">什么是 Promise</p>
      <p class="text-normal">
        Promise 是异步编程的一种解决方案，是一个构造函数，顾名思义， Promsie
        是一种承诺，承诺过段时间会给出一个答复。Promise 有三种状态： pending (
        等待态 )，fulfiled ( 成功态 )，rejected( 失败态
        )；状态一旦改变，就不会再变。创造Promise 实例后，它会立即执行。注意，
        Promise 本身不是异步函数。
      </p>
      <p class="title-2" id="WhyPromise">Promise 有什么用</p>
      <ul class="normal-ul">
        <li>解决回调地狱的问题</li>
        <li>可以处理多个异步请求</li>
      </ul>
      <p class="title-2" id="CreatPromise">手写 Promise</p>
      <p class="text-normal">先看一个 Promise 最基本的用法：</p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ PromiseBase }} </code>
        </pre>
      <ul class="normal-ul">
        <li>Promise 是一个构造函数；</li>
        <li>接受两个参数 resolve ， reject 控制着上文说的三种状态；</li>
        <li>Promsie 的原型对象含有 then，catch 这两个方法；</li>
        <li>
          then 方法可以接受两个参数，一个成功的回调，一个失败的回调。也就是
          onResolved 和 onRejected；
        </li>
        <li>
          catch 这个方法只可以接受一个参数，失败的回调，也就是 onRejected；
        </li>
        <li>
          then 这个方法，是返回一个新的 Promise
          对象，它里面的执行方法也是异步的；
        </li>
        <li>
          触发 then 的时候，也会有三个可能，一个是状态为 resolved
          时，一个是状态为 rejected 时，一个是状态为 pending 时；
        </li>
      </ul>
      <p class="text-normal">
        通过以上描述，我们大概有了基本的框架，直接上代码。
      </p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ PromiseOne }} </code>
        </pre>
      <p class="text-normal">
        从代码中可以看出，当我们实例化 Promise
        的时候，传入的参数会被立马执行，比如这段代码：
      </p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ PromiseOneTest }} </code>
        </pre>
      <p class="text-normal">
        Promise/A+ 规范中规定，当 Promise
        对象已经由等待态（Pending）改变为执行态（Fulfilled）或者拒绝态（Rejected）后，就不能再次更改状态，且终值也不可改变。
      </p>
      <p class="text-normal">所以我们还需要再修改一下代码。</p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ PromiseOneA }} </code>
        </pre>
      <p class="title-2" id="CreatThen">Then</p>
      <p class="text-normal">
        当 Promise 的状态改变之后，不管成功还是失败，都会触发 then
        回调函数。因此，then
        的实现也很简单，就是根据状态的不同，来调用不同处理终值的函数。
      </p>
      <p class="text-normal">
        在规范中也说了，onFulfilled 和 onRejected
        是可选的，因此我们对两个值进行一下类型的判断： onFulfilled 和 onRejected
        都是可选参数。如果 onFulfilled 不是函数，其必须被忽略。如果 onRejected
        不是函数，其必须被忽略。
      </p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ ThenBase }} </code>
        </pre>
      <p class="text-normal">我们用这个 demo 尝试一下：</p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ ThenBaseDemo }} </code>
        </pre>
      <p class="text-normal">
        我们想要的效果是 3 秒之后，控制台输出 成功回调，但实际是出了点问题的。
      </p>
      <p class="text-normal">
        很显然，我们做了个异步才去执行 resolve ，但是还没等执行 then
        函数就已经触发了，所以这里要做个异步处理。当 then 执行的时候，如果还是
        PENDING 状态，我们不是马上去执行回调函数，而是将其存储起来：
      </p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ ThenBaseA }} </code>
        </pre>
      <p class="text-normal">
        之所以用数组存放待执行的函数，是因为存在连续调用 then
        的情况，否则最后执行的 then 会把前面的覆盖掉。
      </p>
      <p class="title-2" id="ChainThen">链式调用 then 比较难之后在写</p>
    </div>
    <anchor :anchorData="anchorData"></anchor>
  </div>
</template>

<script>
import cusPromise from "./demo";
import anchor from "../../../components/anchor";
export default {
  name: "Promise",
  components: { anchor: anchor },
  setup() {
    const PromiseBase = `
    var p = new cusPromise((resolve, reject) => {
        resolve("成功回调");
    });
    p.then((res)=>{});
    p.catch((err)=>{})
    `;
    const PromiseOne = `
    const PENDING = 'pending';
    const FULFILLED = 'fulfilled';
    const REJECTED = 'rejected';

    function cusPromise(executor) {
        this.onFulfilled = [];//成功的回调
        this.onRejected = []; //失败的回调
        var _this = this;
        this.state = PENDING; //状态
        this.value = undefined; //成功结果
        this.reason = undefined; //失败原因
        function resolve(value) {};
        function reject(reason) {};
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    module.exports = cusPromise;
    `;
    const PromiseOneTest = `
    var p = new cusPromise((resolve, reject) => {
      console.log("测试");
    });
    `;
    const PromiseOneA = `
    function resolve(value) {
        if (_this.state === PENDING) {
            _this.state = FULFILLED;
            _this.value = value;
        };
    };
    function reject(reason) {
        if (_this.state === PENDING) {
            _this.state = REJECTED;
            _this.reason = reason;
        };
    };
    `;
    const ThenBase = `
    cusPromise.prototype.then = function (onFulfilled, onRejected) {
        if(this.state === FULFILLED){
            typeof onFulfilled === 'function' && onFulfilled(this.value)
        }
        if(this.state === REJECTED){
            typeof onRejected === 'function' && onRejected(this.reason)
        }
    };`;
    const ThenBaseDemo = `
    var p = new cusPromise((resolve, reject) => {
        console.log("开始执行");
        setTimeout(() => {
            resolve("成功回调");
        }, 3000);
    });
    p.then((res) => {console.log(res)});
    `;
    const ThenBaseA = `
    function resolve(value) {
        if (_this.state === PENDING) {
            _this.state = FULFILLED;
            _this.value = value;
            _this.onFulfilled.forEach(fn => fn(value));
        };
    };
    function reject(reason) {
        if (_this.state === PENDING) {
            _this.state = REJECTED;
            _this.reason = reason;
            _this.onRejected.forEach(fn => fn(reason));
        };
    };
    ......
    ......
    ......
    cusPromise.prototype.then = function (onFulfilled, onRejected) {
        if(this.state === FULFILLED){
            typeof onFulfilled === 'function' && onFulfilled(this.value)
        }
        if(this.state === REJECTED){
            typeof onRejected === 'function' && onRejected(this.reason)
        }
        if(this.state === PENDING){
            typeof onFulfilled === 'function' && this.onFulfilled.push(onFulfilled)
            typeof onRejected === 'function' && this.onRejected.push(onRejected)
        }
    };
    `;

    const anchorData = [
      {
        id: "WhatPromise",
        title: "什么 Promise",
      },
      {
        id: "WhyPromise",
        title: "Promise 有什么用",
      },
      {
        id: "CreatPromise",
        title: "手写 Promise",
      },
      {
        id: "CreatThen",
        title: "Then",
      },
      {
        id: "ChainThen",
        title: "链式调用 then 比较难之后在写",
      },
    ];
    var p = new cusPromise((resolve, reject) => {
      console.log("开始执行");
      setTimeout(() => {
        resolve("成功回调");
      }, 3000);
    });
    p.then((res) => {
      console.log(res);
    });

    // p.then((res) => {
    //   return new cusPromise((resolve, reject) => {
    //     resolve("p2");
    //   });
    // }).then((res1) => {
    //   console.log("res1", res1);
    // });
    return {
      PromiseBase,
      PromiseOne,
      PromiseOneTest,
      PromiseOneA,
      ThenBase,
      ThenBaseDemo,
      ThenBaseA,
      anchorData,
    };
  },
};
</script>

<style>
</style>