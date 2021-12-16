<template>
  <div class="main-normal-box flex-start">
    <div class="doc-main">
      <p class="title-1">Event Loop</p>
      <p class="title-2" id="WhatEventLoop">什么是 Event Loop</p>
      <p class="text-normal">
        Event Loop 中文名是事件循环，是指浏览器或 Node 环境的一种解决 javaScript
        单线程运行时不会阻塞的一种机制，也就是实现异步的原理。作为一种单线程语言，javascript
        本身是没有异步这一说法的，是由其宿主环境提供的。
      </p>
      <p class="title-2" id="StackTasks">执行栈和任务队列</p>
      <p class="text-normal">
        js
        在解析代码的时候，会将所有的同步任务放到执行栈中，将异步任务放入任务队列中，优先完成执行栈中的任务，完成后再去任务队列中完成所有的异步任务，之后再碰见同步任务和异步任务也是这样处理，如此循环就行成了事件循环。执行栈和任务队列都遵循一个特性：
        FIFO 先进先出。
      </p>
      <p class="title-2" id="TaskMircoTask">宏任务和微任务</p>
      <p class="text-normal">
        任务队列中的任务被分为两种，宏任务 (MacroTask/Task) 和微任务
        (MircoTask)。Event Loop在执行和协调各种任务时也将任务队列分为 Task Queue
        和 MircoTask Queue
        分别对应管理宏任务（MacroTask/Task）和微任务（MircoTask）。
      </p>
      <p class="text-normal">常见的宏任务</p>
      <ul class="normal-ul">
        <li>键鼠 IO 操作</li>
        <li>所有的网路请求</li>
        <li>setTimeout、setInterval、setImmediate</li>
      </ul>
      <p class="text-normal">常见的微任务</p>
      <ul class="normal-ul">
        <li>Promise.(then catch finally)</li>
        <li>MutationObserver</li>
        <li>Process.nextTick</li>
      </ul>
      <p class="title-2" id="CycleProcess">循环过程</p>
      <el-image
        key="CycleProcess"
        :src="require('../../../assets/eventloop/base.png')"
        :preview-src-list="[require('../../../assets/eventloop/base.png')]"
      ></el-image>
      <ul class="normal-ul">
        <li>主线程按顺序执行所有代码</li>
        <li>同步任务直接进入执行栈立马执行</li>
        <li>所有的异步任务放入任务队列中</li>
        <li>异步任务有结果后注册回调函数，等待主线程执行</li>
        <li>主线程执行完所有同步任务后，获取异步任务的回调并执行</li>
        <li>获取到的回调作为任务从头开始循环</li>
      </ul>
      <p class="text-normal">
        网上还有种说法，将所有同步任务和非微任务算作宏任务。宏任务和微任务是相对而言的，根据代码执时循环的先后，将代码执行分层理解，在每一层（一次）的事件循环中，首先整体代码块看作一个宏任务，宏任务中的
        Promise（then、catch、finally）、MutationObserver、Process.nextTick
        就是该宏任务层的微任务；宏任务中的同步代码进入主线程中立即执行的，宏任务中的非微任务异步执行代码将作为下一次循环的宏任务时进入调用栈等待执行的；此时，调用栈中等待执行的队列分为两种，优先级较高先执行的本层循环微任务队列，和优先级低的下层循环执行的宏任务队列。(
        转载自 https://blog.csdn.net/qq_31967985/article/details/110310685 )
      </p>
      <el-image
        key="CycleProcessgif"
        :src="require('../../../assets/eventloop/CycleProcess.gif')"
        :preview-src-list="[
          require('../../../assets/eventloop/CycleProcess.gif'),
        ]"
      ></el-image>
      <p class="text-normal">
        总结一下我的理解，执行顺序
        同步任务=>微任务=>宏任务，这是毋庸置疑的，微任务之所以比宏任务先执行，我觉得从某种意义上讲微任务并不算异步任务，它从一开始就注册好了回调函数，宏任务是需要一段时间才注册回调函数，结合任务队列的特性
        ( FIFO ) ，所以微任务会先执行 ( v8 引擎并不会用异步线程处理 promise.then
        )。
      </p>
      <p class="text-normal">
        写到这会发现一个问题，假如我们设置一个定时器 3
        秒后执行输出日志，但是我在同步任务或者微任务中写了 5
        秒的大量计算，那么按理说，定时器的日志要 8 秒后才能输出。
      </p>
    </div>
    <anchor :anchorData="anchorData"></anchor>
  </div>
</template>

<script>
import anchor from "../../../components/anchor";
export default {
  name: "EventLoop",
  components: { anchor: anchor },
  setup() {
    const anchorData = [
      {
        id: "WhatEventLoop",
        title: "什么是 EventLoop",
      },
      {
        id: "StackTasks",
        title: "执行栈和异步任务",
      },
      {
        id: "TaskMircoTask",
        title: "宏任务和微任务",
      },
      {
        id: "CycleProcess",
        title: "循环过程",
      },
    ];

    return { anchorData };
  },
};
</script>

<style>
</style>