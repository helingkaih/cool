<template>
  <div class="main-normal-box flex-start">
    <div class="doc-main">
      <p class="title-1">js 设计原则</p>
      <p class="title-2" id="Whyprinciple">为什么需要 js 设计原则</p>
      <p class="text-normal">js 设计的五大原则，也就是著名的 SOLID 原则：</p>
      <ul class="normal-ul">
        <li>单一职责原则 The Single Responsibility Principle (SRP)</li>
        <li>开放封闭原则 The Open Closed Principle (OCP)</li>
        <li>里式替换原则 The Liskov Substitution Principle (LSP)</li>
        <li>接口分离原则 The Interface Segregation Principle (ISP)</li>
        <li>依赖倒置原则 The Dependency Inversion Principle(DIP)</li>
      </ul>
      <p class="text-normal">
        想要有一个高质量的软件，我们必须尝试低耦合高内聚，而 SOLID
        原则正好帮助我们完成这个任务。如果我们遵循这些指引，我们的代码会更健壮，更易于维护，有更高的复用性和可扩展性。同时，可以避免每次变更都要修改多处代码的问题。
      </p>
      <p class="title-2" id="SRP">单一职责原则</p>
      <p class="text-bold">一个类只负责一件事情！</p>
      <p class="text-normal">
        这应该是所有原则中最容易理解和最容易做到的一个原则，但也是最容易违反的一个原则。单一职责原则可以看作是低耦合、高内聚最基本的实现方式，举个例子，一个购物车功能，有两个类分别负责添加购物车和清空购物车功能，这两个类修改的话是不会互相影响的，以提高内聚性的方式来减少变化的原因。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ SRP }} </code>
    </pre>
      <p class="title-2" id="OCP">开放封闭原则</p>
      <p class="text-bold">软件实体应该是可扩展且不可修改的！</p>
      <p class="text-normal">
        在一个已经完成的功能中添加新的功能，通过添加代码实现而不是修改原来的代码，这样的话代码会很好阅读和维护，代码也好越来越健壮。但有个非常关键的点，就是原有功能的代码要足够的抽象且稳定，不能是新添加的功能必须要修改原有的代码，或者是原有的代码依然存在严重问题，这种情况扩展起来只会越来越糟糕
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ OCP }} </code>
    </pre>
      <p class="title-2" id="LSP">里式替换原则</p>
      <p class="text-bold">
        程序里的对象都应该可以被它的子类实例替换而不用更改程序
      </p>
      <p class="text-normal">
        这个原则的内容理解起来有点像多态，也有点像上面所说的
        开放封闭原则，代码中任何用到父类的地方都可以被子类替代，也就是说子类基于父类，拥有所有父类所拥有的东西；父类不能替换子类，也就是说子类在父类的基础上有一些额外的东西。这样的设计提高了父类代码的复用性、可拓展性，但给了子类一定的约束，降低了子类的灵活性。
      </p>
      <p class="title-2" id="ISP">接口分离原则</p>
      <p class="text-bold">多个特定客户端接口要好于一个宽泛用途的接口</p>
      <p class="text-normal">
        不能强迫用户去依赖那些他们不使用的接口。换句话说，使用多个专门的接口比使用单一的总接口总要好。这个原则听起来有点像
        单一职责原则 ( 毕竟这是基础
        )，其做法就是将一个大类中加一个接口层，通过接口控制该类中方法的使用，避免浪费资源。
      </p>
      <pre v-highlight class="highlight">
        <code class="javascript">{{ ISP }} </code>
    </pre>
      <p class="title-2" id="DIP">依赖倒转原则</p>
      <p class="text-bold">
        高层次的模块不应该依赖于低层次的模块，它们都应该依赖于抽象。抽象不应该依赖于细节。细节应该依赖于抽象。
      </p>
      <p class="text-normal">
        这个原则有点难实现，简单点说明。 A 模块 ( 高层次 )，B 模块 ( 低层次 )，C
        模块 ( 低层次 )，A 功能的实现会用到 B，且 A 功能的一些数据处理放在 B
        里了，如果想换用 C
        ，那么低层次模块的代码需要修改，如果低层次代码中有其他高层次模块的相关代码，那影响会很大，且难改。这一原则要做的就是，将低层次中的多余代码挪出去，比如
        A 的数据处理挪走，可以放 A
        中自己实现，或者抽象处理，而底层模块只负责实现自己的功能，这样一来降低了耦合度，提高了低层次模块代码的复用性。
      </p>
      <p class="text-normal">
        读到这里，可以明显的感觉到，这几个原则都在关注一点，耦合度，耦合度不能太高，代码间的关联性太强，修改困难，扩展困难，牵一发而动全身，耦合度也不能太低，该复用的代码还得复用，降低重复的工作量，通过以上几个原则就可以很好的拿捏着耦合度。严格遵守规范写出来的代码，百利而无一害。
      </p>
    </div>
    <anchor :anchorData="anchorData"></anchor>
  </div>
</template>

<script>
import anchor from "../../../../components/anchor.vue";
export default {
  name: "Jsprinciple",
  components: { anchor },
  setup() {
    const anchorData = [
      { id: "Whyprinciple", title: "为什么需要 js 设计原则" },
      { id: "SRP", title: "单一职责原则" },
      { id: "OCP", title: "开放封闭原则" },
      { id: "LSP", title: "里式替换原则" },
      { id: "ISP", title: "接口分离原则" },
      { id: "DIP", title: "依赖倒转原则" },
    ];
    const SRP = `
        // bad code
        class opt{
            constructor(props) {
                this.props = props;
            }
            add(){
                ...
            }
            delete(){
                ...
            }
        }
        // good code
        class add{
            constructor(props) {
                this.props = props;
            }
            fn(){
                ...
            }
        }
        class delete{
            constructor(props) {
                this.props = props;
            }
            fn(){
                ...
            }
        }
    `;
    const OCP = `
        // bad code
        class replaceA{
            constructor(props) {
                const str = props.str.replace('a','A');
            }
        }
        class replaceB{
            constructor(props) {
                const str = props.str.replace('b','B');
            }
        }
        // good code
        class replaceB{
            constructor(props) {
                this.props=props;
            }
            fn(){
                if(this.props.type==='A'){
                    const str = props.str.replace('a','A');
                }else if(this.props.type==='B'){
                    const str = props.str.replace('b','B');
                }
            }
        }
    `;
    const ISP = `
    // bad code
    interface I {
        public void method1();
        public void method2();
        public void method3(); // 这一行是多余的
    }

    class B implements I{
        public void method1() {
            System.out.println("类B实现接口I的方法1");
        }
        public void method2() {
            System.out.println("类B实现接口I的方法2");
        }
    }
    // good code
    interface I1 {
        public void method1();
    }
    interface I2 {
        public void method2();
    }
    class B implements I1, I2{
	    public void method1() {
            System.out.println("类B实现接口I1的方法1");
        }
        public void method2() {
            System.out.println("类B实现接口I2的方法2");
        }
    }
    `;

    return {
      anchorData,
      SRP,
      OCP,
      ISP,
    };
  },
};
</script>

<style>
</style>