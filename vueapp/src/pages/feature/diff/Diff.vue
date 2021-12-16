<template>
  <div class="main-normal-box flex-start">
    <div class="doc-main">
      <p class="title-1">虚拟 DOM</p>
      <p class="title-2" id="WhatVdom">什么是虚拟 Dom</p>
      <p class="text-normal">
        虚拟 Dom ( 以后简称 VDom ) 是将真实 Dom
        的数据抽取出来，组成一个树形结构的数据，真实 Dom 和 VDom 都是对象。
      </p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ VDomMain }} </code>
        </pre>
      <p class="title-2" id="WhyVdom">为什么需要虚拟 Dom</p>
      <p class="text-normal">
        在 web
        发展的初期，一个页面的内容比较简单，没有太多的交互、功能、状态管理等等，往往只是做一些简单的展示就好了，但随着
        web 的发展，功能需求越来越多，代码随着页面的复杂而复杂，Dom
        相关的操作会越来越频繁，但是直接操作 Dom
        会引起页面的重排重绘，增加浏览器的性能开销，降低页面渲染速度，于是就有了
        VDom 的概念。
      </p>
      <p class="text-normal">
        Vue 1.0
        的时候，通过细粒度绑定实现响应式，因为该方法粒度太细，Object.defineProperty()
        每个数据的修改都会通知 watcher，进而通知 Dom
        去改变，代码少还好，对于大型的网站、展示内容较多的情况下内存开销会非常大。Vue
        2.0 的时候引入了 VDom ，渲染速度提高了 2 ~ 4 倍。
      </p>
      <p class="title-2" id="HowVdom">Vue 是怎么实现虚拟 Dom 的</p>
      <p class="text-normal">VDom 简单来讲只做两件事：</p>
      <ul class="normal-ul">
        <li>将真实 Dom 的数据转换为 VDom</li>
        <li>状态发生变化时，对比新旧 Dom 数据并更新</li>
      </ul>
      <p class="text-normal">
        vue-loader 允许我们直接在 template 中编写模板字符串，将内容提取出来给
        vue-template-compiler，Vue
        通过编译器将模板转换成渲染函数中的内容，执行这个函数可以得到一个 VDom
        树，使用这个树就可以渲染页面了。
      </p>
      <el-image
        key="vDompng"
        :src="require('../../../assets/vdom/vdom.png')"
        :preview-src-list="[require('../../../assets/vdom/vdom.png')]"
      ></el-image>
      <p class="title-2" id="Patch">Patch</p>
      <p class="text-normal">
        patch 是VDom 更新视图的核心方法之一，顾名思义，对比新旧 Dom
        打补丁，其规则如下(按顺序执行)：
      </p>
      <ul class="normal-ul">
        <li>
          判断新旧节点 type 是否相同，如果连 type 都不同，直接全部替换，结束。
        </li>
        <li>判断新旧节点是否是文本类型，是的话直接替换文本，结束。</li>
        <li>
          通过以上两个判断(都没结束)，可以认为新旧节点的
          dom元素基本相同,更新属性 样式 绑定事件即可
        </li>
        <li>判断新节点有子节点，旧节点没有子节点，全部替换</li>
        <li>判断新节点没有有子节点，旧节点有子节点，全部删除</li>
        <li>
          判断新旧节点都有子节点，子节点开始比对，这是最复杂的情况 ( Diff 算法)
        </li>
      </ul>
      <p class="text-normal">
        这里只展示 patch 相关 的部分代码，其余可在该模块代码中查看。
      </p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ patchBase }} </code>
        </pre>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ patchUpdate}} </code>
      </pre>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ patchIssame}} </code>
      </pre>
      <p class="title-2" id="Diff">Diff 算法</p>
      patch
      中最复杂的是新旧节点都有子节点的情况，需要继续比较子节点，为了尽可能的保证性能和结果的准确性，我们会从新旧子节点的头尾开始比较，会有以下几种情况(
      按以下顺序循环执行，简称：新子节点=>新、旧子节点=>旧)：
      <ul class="normal-ul">
        <li>新头比旧头，相同则将新头和旧头送进 patch 方法更新，跳出循环</li>
        <li>新尾比旧尾，相同则将新尾和旧尾送进 patch 方法更新，跳出循环</li>
        <li>新尾比旧头，相同则将新尾和旧头送进 patch 方法更新，跳出循环</li>
        <li>新头比旧尾，相同则将新头和旧尾送进 patch 方法更新，跳出循环</li>
        <li>以上条件都不满足，则暴力比对，比对所有新旧并 patch 更新</li>
      </ul>
      以上这一过程，就是 VDom 更新的 Diff 算法，接下来详细讲解一下( 注意：从
      patch 的 isSameVnode 方法中得知，新旧节点的 type 和 key
      都相同，就说明两节点相同了，更新属性即可 )
      <p class="text-normal">
        首先，diff
        算法需要有一些基础工作需要做，从新旧子节点中取出一个节点做对比、记录下标、获取
        key 等等
      </p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ diffBase }} </code>
        </pre>
      <p class="text-normal">
        准备工作做完之后开始比对，如果 oldStartIndex > oldEndIndex ||
        newStartIndex > newEndIndex
        ，则说明新子节点或者旧子节点其中一个循环完了，结束即可(
        留个疑问，新子节点比对完了，循环停止，那旧子节点还有剩余怎么办?
        )。先来第一步，新头比旧头( 部分方法在上文 patch 中有讲到 )：
      </p>

      <el-image
        key="vDompng"
        :src="require('../../../assets/vdom/diffhh.png')"
        :preview-src-list="[require('../../../assets/vdom/diffhh.png')]"
      ></el-image>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ diffhh }} </code>
        </pre>
      <p class="text-normal">
        新头和旧头相同，两者进入 patch 更新，两者下标
        +1，并获取下一个新头和旧头的数据，接着比较,以此类推。
      </p>
      <p class="text-normal">
        这里有个小 demo ，按下按钮即可变更 dom , f12 选中观察这些 dom
        ，只有头节点发生变化了( 这里更新用的是手写的虚拟 Dom
        更新方法，在本模块的代码中可以详细查看 )。
      </p>
      <el-button type="primary" round @click="diffhhChange">更新 Dom</el-button>
      <div id="diffhhdemo" style="margin: 20px 0px"></div>
      <p class="text-normal">
        如果新头和旧头不相同，就比较新尾和旧尾、新头旧尾、新尾旧头，处理方式是类似的。
      </p>
      <p class="text-normal">
        最后就是暴力检测，相对前面几种情况来讲，这个检测比较复杂和耗时，即当前的新节点跟旧头旧尾都不相同，旧从旧节点剩余节点中找相同的。
      </p>
      <el-image
        key="vDompng"
        :src="require('../../../assets/vdom/diffall.png')"
        :preview-src-list="[require('../../../assets/vdom/diffall.png')]"
      ></el-image>
      <p class="text-normal">先准备好 keymap 方便比较。</p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ diffallkeymap }} </code>
        </pre>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ diffall }} </code>
        </pre>
      <p class="text-normal">
        从代码中可以看出，暴力比对要做的就是拿到某个新子节点的数据与剩余旧子节点比较，如果在旧子节点中能找到相同的就更新然后置空相同的旧子节点，并挪到当前起始旧节点之前，没有找到则直接放在起始旧节点前。
      </p>
      <el-button type="primary" round @click="diffallChange"
        >更新 Dom</el-button
      >
      <div id="diffalldemo" style="margin: 20px 0px"></div>
      <p class="text-normal">
        至于置空的旧子节点，在下次循环到时，直接跳过取下一个。
      </p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ diffstart }} </code>
        </pre>
      <p class="text-normal">上文 diff 第一步中留了一个问题，现在来看一下。</p>
      <pre v-highlight class="highlight">
            <code class="javascript">{{ diffend }} </code>
        </pre>
      <p class="text-normal">上方代码是 diff 算法的收尾工作：</p>
      <ul class="normal-ul">
        <li>
          当旧子节点循环完毕，新子节点还有剩余，则说明剩余的新子节点都是添加的，这里要判断是新子节点的头部有剩余还是尾部有剩余继而决定添加位置
        </li>
        <li>
          当新子节点循环完毕，旧子节点还有剩余，并且是有数据的 (
          暴力比对中可能会把旧子节点置空 )，删除即可。
        </li>
      </ul>
    </div>

    <anchor :anchorData="anchorData"></anchor>
  </div>
</template>

<script>
import { ref } from "vue";
import { onMounted } from "@vue/runtime-core";
// import { provide } from "@vue/composition-api";
import { h, render, patch } from "./index";
import anchor from "../../../components/anchor";
export default {
  name: "Diff",
  components: { anchor: anchor },
  setup() {
    const VDomMain = `
        // 真实 Dom
        <div>
            <p>wulalala</p>
        </div>
        
        // VDom
        const Vnode={
            tag:'div',
            children: [
                { tag: 'p', text: 'wulalala' }
            ]
        }
    `;
    const patchBase = `
    function patch(oldVnode, newVnode) {
    // 类型不同 就不需要再比较了，直接全部替换
        if (oldVnode.type !== newVnode.type) {
            return oldVnode.domElement.parentNode.replaceChild(createDomElementFrom(newVnode), oldVnode.domElement);
        };

        // 文本类型
        if (oldVnode.text) {
            if (oldVnode.text === newVnode.text) return
            return oldVnode.domElement.textContent = newVnode.text;
        }

        //类型相同 根据新节点属性更新旧节点属性
        let domElement = newVnode.domElement = oldVnode.domElement;

        updateProperties(newVnode, oldVnode.domElement);

        let oldChildren = oldVnode.children; // 旧子节点
        let newChildren = newVnode.children; // 新子节点

        if (oldChildren.length > 0 && newChildren.length > 0) {
            // 都有儿子，比对两个儿子
            updateChildren(domElement, oldChildren, newChildren);
        } else if (oldChildren.length > 0) {
            // 旧的有儿子,新的没儿子，直接清空即可
            domElement.innerHTML = '';
        } else if (newChildren.length > 0) {
            // 旧的没有儿子，新的有儿子，全部渲染
            for (let i = 0; i < newChildren.length; i++) {
                domElement.appendChild(createDomElementFrom(newChildren[i]));
            };
        };
    }`;
    const patchUpdate = `
    function updateProperties(newVnode, oldProps = {}) {
        let domElement = newVnode.domElement; // 真实的dom元素
        let newProps = newVnode.props; // 当前虚拟节点中的属性

        // 如果旧的里面有 新的里面没有 这个属性要移除
        for (let oldPro in oldProps) {
            if (!newProps[oldPro]) {
                delete domElement[oldPro];
            };
        };

        // 新旧都有 style ,且 style 个别属性 不一样
        let newStyleObj = newProps.style || {};
        let oldStyleObj = oldProps.style || {};

        for (let propName in oldStyleObj) {
            if (!newStyleObj[propName]) {
                domElement.style[propName] = ''; // 删除样式，置空即可
            }
        };

        // 如果旧的没有 新的有 覆盖即可
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
    }`;
    const patchIssame = `
    function isSameVnode(oldVnode, newVnode) {
        return oldVnode.type === newVnode.type && oldVnode.key === newVnode.key;
    }
    `;
    const diffBase = `
    /*
    * parent 父节点的真实 dom 对象
    * oldChildren 旧的所有子节点
    * newChildren 新的所有子节点
    */
    function updateChildren(parent, oldChildren, newChildren) {
        // 从头尾开始循环，记录开始的 index ，获取头尾的虚拟节点数据
        let oldStartIndex = 0; 
        let oldStartVnode = oldChildren[0];
        let oldEndIndex = oldChildren.length - 1;
        let oldEndVnode = oldChildren[oldEndIndex];

        // 获取节点的 key 用来暴力比对，有 key 的话会方便很多
        // 这也是为什么 Vue 和 React 提倡大家为 dom 元素添加 key
        // 注意 key 最好不要用数组下标 0 1 2 3 这样的
        let map = createMapByKeyToIndex(oldChildren);

        let newStartIndex = 0;
        let newStartVnode = newChildren[0];
        let newEndIndex = newChildren.length - 1;
        let newEndVnode = newChildren[newEndIndex];
        ...
        ...
        ...
    }
    `;
    const diffstart = `
    if (!newStartVnode) {
        newStartVnode = newChildren[++newStartIndex];
    } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
    };
    `;
    const diffhh = `
    // 判断新旧子节点，谁先结束就停止循环
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (isSameVnode(oldStartVnode, newStartVnode)) { // 先比较头
            // 更新属性
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
        }
    }
    `;
    const diffallkeymap = `
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
    `;
    const diffall = `
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
    `;
    const diffend = `
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
    `;
    let diffhhOldVnode = h(
      "div",
      {},
      h("li", { key: "A" }, "A"),
      h("li", { key: "B" }, "B"),
      h("li", { key: "C" }, "C"),
      h("li", { key: "D" }, "D")
    );
    const diffhhChange = () => {
      let diffhhNewVnode = h(
        "div",
        {},
        h("li", { key: "E" }, "E"),
        h("li", { key: "B" }, "B"),
        h("li", { key: "C" }, "C"),
        h("li", { key: "D" }, "D")
      );
      patch(diffhhOldVnode, diffhhNewVnode);
    };
    let diffallOldVnode = h(
      "div",
      {},
      h("li", { key: "A" }, "A"),
      h("li", { key: "B" }, "B"),
      h("li", { key: "C" }, "C"),
      h("li", { key: "D" }, "D")
    );
    const diffallChange = () => {
      let diffallNewVnode = h(
        "div",
        {},
        h("li", { key: "E" }, "E"),
        h("li", { key: "B" }, "B"),
        h("li", { key: "F" }, "F"),
        h("li", { key: "C" }, "C"),
        h("li", { key: "A" }, "A")
      );
      patch(diffallOldVnode, diffallNewVnode);
    };
    onMounted(() => {
      render(diffhhOldVnode, document.getElementById("diffhhdemo"));
      render(diffallOldVnode, document.getElementById("diffalldemo"));
    });
    const anchorData = [
      {
        id: "WhatVdom",
        title: "什么是虚拟 Dom",
      },
      {
        id: "WhyVdom",
        title: "为什么需要虚拟 Dom",
      },
      {
        id: "HowVdom",
        title: "Vue 是怎么实现虚拟 Dom 的",
      },
      {
        id: "Patch",
        title: "Patch",
      },
      {
        id: "Diff",
        title: "Diff 算法",
      },
    ];
    return {
      anchorData,
      VDomMain,
      patchBase,
      patchIssame,
      patchUpdate,
      diffBase,
      diffstart,
      diffhh,
      diffallkeymap,
      diffall,
      diffend,
      diffhhChange,
      diffallChange,
    };
  },
};
</script>

<style>
</style>