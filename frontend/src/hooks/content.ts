let textstring = `
[TOC]
------

<center><font size=7><b> Vue进阶——个人笔记 </center></font></center>

---

## API 文档

[状态选项 | Vue.js (vuejs.org)](https://cn.vuejs.org/api/options-state.html)

 

## 深入组件

### 组件注册

一个 Vue 组件在使用前需要先被“注册”，这样 Vue 才能在渲染模板时找到其对应的实现。组件注册有两种方式：全局注册和局部注册。

#### 全局注册

我们可以使用 Vue 应用实例的 \`.component()\` 方法，让组件在当前 Vue 应用中全局可用。

\`\`\`js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // 注册的名字
  'MyComponent',
  // 组件的实现
  {
    /* ... */
  }
)
\`\`\`

如果使用单文件组件，你可以注册被导入的 \`.vue\` 文件：

\`\`\`js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
\`\`\`

\`.component()\` 方法可以被链式调用：

\`\`\`js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
\`\`\`

全局注册的组件可以在此应用的任意组件的模板中使用：

\`\`\`VUE
<!-- 这在当前应用的任意组件中都可用 -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
\`\`\`

所有的子组件也可以使用全局注册的组件，这意味着这三个组件也都可以在*彼此内部*使用。

**全局注册虽然很方便，但有以下几个问题：**

1. 全局注册，但并没有被使用的组件无法在生产打包时被自动移除 (也叫“tree-shaking”)。如果你全局注册了一个组件，即使它并没有被实际使用，它仍然会出现在打包后的 JS 文件中。
2. 全局注册在大型项目中使项目的依赖关系变得不那么明确。在父组件中使用子组件时，不太容易定位子组件的实现。和使用过多的全局变量一样，这可能会影响应用长期的可维护性。



#### 局部注册

局部注册的组件需要在使用它的父组件中显式导入，并且只能在该父组件中使用。它的优点是使组件之间的依赖关系更加明确，并且对 tree-shaking 更加友好。

在使用 \`<script setup>\` 的单文件组件中，导入的组件可以直接在模板中使用，无需注册：

\`\`\`VUE
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
\`\`\`

如果没有使用 \`<script setup>\`，则需要使用 \`components\` 选项来显式注册：

\`\`\`js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
\`\`\`

对于每个 \`components\` 对象里的属性，它们的 key 名就是注册的组件名，而值就是相应组件的实现。上面的例子中使用的是 ES2015 的缩写语法，等价于：

\`\`\`js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
\`\`\`

请注意：**局部注册的组件在后代组件中*不*可用**。在这个例子中，\`ComponentA\` 注册后仅在当前组件可用，而在任何的子组件或更深层的子组件中都不可用。



### Props

#### Props 声明

一个组件需要显式声明它所接受的 props，这样 Vue 才能知道外部传入的哪些是 props，哪些是透传 attribute。

在使用 \`<script setup>\` 的单文件组件中，props 可以使用 \`defineProps()\` 宏来声明：

\`\`\`vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
\`\`\`

在没有使用 \`<script setup>\` 的组件中，props 可以使用 \`props\` 选项来声明：

\`\`\`js
export default {
  props: ['foo'],
  setup(props) {
    // setup() 接收 props 作为第一个参数
    console.log(props.foo)
  }
}
\`\`\`

注意传递给 \`defineProps()\` 的参数和提供给 \`props\` 选项的值是相同的，两种声明方式背后其实使用的都是 props 选项。

除了使用字符串数组来声明 props 外，还可以使用对象的形式：

\`\`\`js
// 使用 <script setup>
defineProps({
  title: String,
  likes: Number
})
\`\`\`

\`\`\`js
// 非 <script setup>
export default {
  props: {
    title: String,
    likes: Number
  }
}
\`\`\`

对于以对象形式声明的每个属性，key 是 prop 的名称，而值则是该 prop 预期类型的构造函数。比如，如果要求一个 prop 的值是 \`number\` 类型，则可使用 \`Number\` 构造函数作为其声明的值。

对象形式的 props 声明不仅可以一定程度上作为组件的文档，而且如果其他开发者在使用你的组件时传递了错误的类型，也会在浏览器控制台中抛出警告。

#### 静态 与 动态

很多像这样的静态值形式的 props：

\`\`\`vue
<BlogPost title="My journey with Vue" />
\`\`\`

相应地，还有使用 \`v-bind\` 或缩写 \`:\` 来进行动态绑定的 props：

\`\`\`vue
<!-- 根据一个变量的值动态传入 -->
<BlogPost :title="post.title" />

<!-- 根据一个更复杂表达式的值动态传入 -->
<BlogPost :title="post.title + ' by ' + post.author.name" />
\`\`\`

在上述的两个例子中，我们只传入了字符串值，但实际上**任何**类型的值都可以作为 props 的值被传递。

#### 单向数据流

所有的 props 都遵循着**单向绑定**原则，props 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。这避免了子组件意外修改父组件的状态的情况，不然应用的数据流将很容易变得混乱而难以理解。

另外，每次父组件更新后，所有的子组件中的 props 都会被更新到最新值，这意味着你**不应该**在子组件中去更改一个 prop。若你这么做了，Vue 会在控制台上向你抛出警告：

\`\`\`js
const props = defineProps(['foo'])

// ❌ 警告！prop 是只读的！
props.foo = 'bar'
\`\`\`

1. **prop 被用于传入初始值；而子组件想在之后将其作为一个局部数据属性**。在这种情况下，最好是新定义一个局部数据属性，从 props 上获取初始值即可：

   \`\`\`js
   const props = defineProps(['initialCounter'])
   
   // 计数器只是将 props.initialCounter 作为初始值
   // 像下面这样做就使 prop 和后续更新无关了
   const counter = ref(props.initialCounter)
   \`\`\`

2. **需要对传入的 prop 值做进一步的转换**。在这种情况中，最好是基于该 prop 值定义一个计算属性：

   \`\`\`js
   const props = defineProps(['size'])
   
   // 该 prop 变更时计算属性也会自动更新
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   \`\`\`

##### 更改对象 / 数组类型的 props

当对象或数组作为 props 被传入时，虽然子组件无法更改 props 绑定，但仍然**可以**更改对象或数组内部的值。这是因为 JavaScript 的对象和数组是按引用传递，对 Vue 来说，阻止这种更改需要付出的代价异常昂贵。

这种更改的主要缺陷是它允许了子组件以某种不明显的方式影响父组件的状态，可能会使数据流在将来变得更难以理解。在最佳实践中，你应该尽可能避免这样的更改，除非父子组件在设计上本来就需要紧密耦合。在大多数场景下，子组件应该**抛出一个事件**来通知父组件做出改变。

#### Boolean 类型转换

为了更贴近原生 boolean attributes 的行为，声明为 \`Boolean\` 类型的 props 有特别的类型转换规则。以带有如下声明的 \`<MyComponent>\` 组件为例：

\`\`\`js
defineProps({
  disabled: Boolean
})
\`\`\`

该组件可以被这样使用：

\`\`\`vue
<!-- 等同于传入 :disabled="true" -->
<MyComponent disabled />

<!-- 等同于传入 :disabled="false" -->
<MyComponent />
\`\`\`

当一个 prop 被声明为允许多种类型时，\`Boolean\` 的转换规则也将被应用。然而，当同时允许 \`String\` 和 \`Boolean\` 时，有一种边缘情况——只有当 \`Boolean\` 出现在 \`String\` 之前时，\`Boolean\` 转换规则才适用：

\`\`\`js
// disabled 将被转换为 true
defineProps({
  disabled: [Boolean, Number]
})

// disabled 将被转换为 true
defineProps({
  disabled: [Boolean, String]
})

// disabled 将被转换为 true
defineProps({
  disabled: [Number, Boolean]
})

// disabled 将被解析为空字符串 (disabled="")
defineProps({
  disabled: [String, Boolean]
})
\`\`\`



### 组件事件

#### 触发与监听事件

在组件的模板表达式中，可以直接使用 \`$emit\` 方法触发自定义事件 (例如：在 \`v-on\` 的处理函数中)：

\`\`\`vue
<!-- MyComponent -->
<button @click="$emit('someEvent')">Click Me</button>
\`\`\`

父组件可以通过 \`v-on\` (缩写为 \`@\`) 来监听事件：

\`\`\`vue
<MyComponent @some-event="callback" />
\`\`\`

同样，组件的事件监听器也支持 \`.once\` 修饰符：

\`\`\`vue
<MyComponent @some-event.once="callback" />
\`\`\`

#### 事件参数

有时候我们会需要在触发事件时附带一个特定的值。举例来说，我们想要 \`<BlogPost>\` 组件来管理文本会缩放得多大。在这个场景下，我们可以给 \`$emit\` 提供一个额外的参数：

\`\`\`vue
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
\`\`\`

然后我们在父组件中监听事件，我们可以先简单写一个内联的箭头函数作为监听器，此函数会接收到事件附带的参数：

\`\`\`vue
<MyButton @increase-by="(n) => count += n" />
\`\`\`

或者，也可以用一个组件方法来作为事件处理函数：

\`\`\`vue
<MyButton @increase-by="increaseCount" />
\`\`\`

该方法也会接收到事件所传递的参数：

\`\`\`js
function increaseCount(n) {
  count.value += n
}
\`\`\`

#### 声明触发的事件

组件可以显式地通过 \`defineEmits()\` 宏来声明它要触发的事件：

\`\`\`vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
\`\`\`

我们在 \`<template>\` 中使用的 \`$emit\` 方法不能在组件的 \`<script setup>\` 部分中使用，但 \`defineEmits()\` 会返回一个相同作用的函数供我们使用：

\`\`\`vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
\`\`\`

\`defineEmits()\` 宏**不能**在子函数中使用。如上所示，它必须直接放置在 \`<script setup>\` 的顶级作用域下。

如果你显式地使用了 \`setup\` 函数而不是 \`<script setup>\`，则事件需要通过 [\`emits\`](https://cn.vuejs.org/api/options-state.html#emits) 选项来定义，\`emit\` 函数也被暴露在 \`setup()\` 的上下文对象上：

\`\`\`js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
\`\`\`

与 \`setup()\` 上下文对象中的其他属性一样，\`emit\` 可以安全地被解构：

\`\`\`js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
\`\`\`



### 组件 v-model

#### 基本用法

\`v-model\` 可以在组件上使用以实现双向绑定。

1. \`v-model\`的本质

   \`\`\`vue
   <!-- 使用v-model指令 -->
   <input type="text" v-model="userName">
   
   <!-- v-model的本质是下面这行代码 -->
   <input 
     type="text" 
     :value="userName" 
     @input="userName =(<HTMLInputElement>$event.target).value"
   >
   \`\`\`

2. 组件标签上的\`v-model\`的本质：\`:moldeValue\` ＋ \`update:modelValue\`事件。

   \`\`\`vue
   <!-- 组件标签上使用v-model指令 -->
   <AtguiguInput v-model="userName"/>
   
   <!-- 组件标签上v-model的本质 -->
   <AtguiguInput :modelValue="userName" @update:model-value="userName = $event"/>
   \`\`\`


在 3.4 版本之前，一般会按照如下的方式来实现子组件：

\`\`\`vue
<!-- Child.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
\`\`\`

然后，父组件中的 \`v-model="foo"\` 将被编译为：

\`\`\`vue
<!-- Parent.vue -->
<Child v-model="foo" />
<!-- 编译为 -->
<Child
  :modelValue="foo"
  @update:modelValue="$event => (foo = $event)"
/>
\`\`\`

从 Vue 3.4 开始，推荐的实现方式是使用 \`defineModel()\`宏：

\`defineModel\` 是一个便利宏。编译器将其展开为以下内容：

- 一个名为 \`modelValue\` 的 prop，本地 ref 的值与其同步；
- 一个名为 \`update:modelValue\` 的事件，当本地 ref 的值发生变更时触发。

\`\`\`vue
<!-- Parent.vue -->
<Child v-model="countModel" />

<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <button @click="update">Increment</button>
</template>
\`\`\`

\`defineModel()\` 返回的值是一个 ref。它可以像其他 ref 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用：

- 它的 \`.value\` 和父组件的 \`v-model\` 的值同步；
- 当它被子组件变更了，会触发父组件绑定的值一起更新。

这意味着你也可以用 \`v-model\` 把这个 ref 绑定到一个原生 input 元素上，在提供相同的 \`v-model\` 用法的同时轻松包装原生 input 元素：

\`\`\`vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
\`\`\`

#### 接收参数

组件上的 \`v-model\` 也可以接受一个参数。

有了参数之后，就可以实现**多个** v-model 绑定。

**3.4之前**

可以更换\`value\`，例如改成\`abc\`（如果\`value\`可以更换，那么就可以在组件标签上多次使用\`v-model\`）

\`\`\`vue
<!-- 也可以更换value，例如改成abc-->
<Child v-model:abc="userName" v-model:xyz="password"/>
\`\`\`

\`Child\`组件中：

\`\`\`vue
<template>
  <div class="box">
    <input 
       type="text" 
       :value="abc" 
       @input="emit('update:abc',$event.target.value)"
    >
      <input 
       type="password" 
       :value="xyz" 
       @input="emit('update:abc',$event.target.value)"
    >
  </div>
</template>

<script setup lang="ts" name="AtguiguInput">
  // 接收props
  defineProps(['abc','xyz'])
  // 声明事件
  const emit = defineEmits(['update:abc','update:xyz'])
</script>
\`\`\`

**3.4之后**

在子组件中，我们可以通过将字符串作为第一个参数传递给 \`defineModel()\` 来支持相应的参数

\`\`\`vue
<!-- MyComponent.vue -->
<script setup>
    const username = defineModel('abc')
    const password = defineModel('abc')
</script>

<template>
    <input type="text" v-model="username" />
    <input type="password" v-model="password" />
</template>
\`\`\`

#### v-model 修饰符

\`v-model\` 有一些[内置的修饰符](https://cn.vuejs.org/guide/essentials/forms.html#modifiers)，例如 \`.trim\`，\`.number\` 和 \`.lazy\`。在某些场景下，你可能想要一个自定义组件的 \`v-model\` 支持自定义的修饰符。

> 我们来创建一个自定义的修饰符 \`capitalize\`，它会自动将 \`v-model\` 绑定输入的字符串值第一个字母转为大写：
>
> \`\`\`vue
> <MyComponent v-model.capitalize="myText" />
> \`\`\`
>
> 通过像这样解构 \`defineModel()\` 的返回值，可以在子组件中访问添加到组件 \`v-model\` 的修饰符：
>
> \`\`\`vue
> <script setup>
> const [model, modifiers] = defineModel()
> 
> console.log(modifiers) // { capitalize: true }
> </script>
> 
> <template>
>   <input type="text" v-model="model" />
> </template>
> \`\`\`
>
> 为了能够基于修饰符选择性地调节值的读取和写入方式，我们可以给 \`defineModel()\` 传入 \`get\` 和 \`set\` 这两个选项。这两个选项在从模型引用中读取或设置值时会接收到当前的值，并且它们都应该返回一个经过处理的新值。下面是一个例子，展示了如何利用 \`set\` 选项来应用 \`capitalize\` (首字母大写) 修饰符：
>
> \`\`\`vue
> <script setup>
> const [model, modifiers] = defineModel({
>   set(value) {
>     if (modifiers.capitalize) {
>       return value.charAt(0).toUpperCase() + value.slice(1)
>     }
>     return value
>   }
> })
> </script>
> 
> <template>
>   <input type="text" v-model="model" />
> </template>
> \`\`\`



### 透传 Attributes

#### Attributes 继承

“透传 attribute”指的是传递给一个组件，却没有被该组件声明为 props 或 emits 的 attribute 或者 \`v-on\` 事件监听器。最常见的例子就是 \`class\`、\`style\` 和 \`id\`。

当一个组件以单个元素为根作渲染时，透传的 attribute 会自动被添加到根元素上。

如果一个子组件的根元素已经有了 \`class\` 或 \`style\` attribute，它会和从父组件上继承的值合并。

举例来说，假如我们有一个 \`<MyButton>\` 组件，它的模板长这样：

\`\`\`vue
<!-- <MyButton> 的模板 -->
<button class="btn">Click Me</button>
\`\`\`

一个父组件使用了这个组件，并且传入了 \`class\`：

\`\`\`vue
<MyButton class="large" />
\`\`\`

最后渲染出的 DOM 结果是：

\`\`\`html
<button class="btn large">Click Me</button>
\`\`\`

这里，\`<MyButton>\` 并没有将 \`class\` 声明为一个它所接受的 prop，所以 \`class\` 被视作透传 attribute，自动透传到了 \`<MyButton>\` 的根元素上。

####  v-on 监听器继承

同样的规则也适用于 \`v-on\` 事件监听器：

\`\`\`vue
<MyButton @click="onClick" />
\`\`\`

\`click\` 监听器会被添加到 \`<MyButton>\` 的根元素，即那个原生的 \`<button>\` 元素之上。当原生的 \`<button>\` 被点击，会触发父组件的 \`onClick\` 方法。同样的，如果原生 \`button\` 元素自身也通过 \`v-on\` 绑定了一个事件监听器，则这个监听器和从父组件继承的监听器都会被触发。

#### 深层组件继承

有些情况下一个组件会在根节点上渲染另一个组件。

例如，我们重构一下 \`<MyButton>\`，让它在根节点上渲染 \`<BaseButton>\`：

\`\`\`vue
<!-- <MyButton/> 的模板，只是渲染另一个组件 -->
<BaseButton />
\`\`\`

此时 \`<MyButton>\` 接收的透传 attribute 会直接继续传给 \`<BaseButton>\`。

请注意：

1. 透传的 attribute 不会包含 \`<MyButton>\` 上声明过的 props 或是针对 \`emits\` 声明事件的 \`v-on\` 侦听函数，换句话说，声明过的 props 和侦听函数被 \`<MyButton>\`“消费”了。
2. 透传的 attribute 若符合声明，也可以作为 props 传入 \`<BaseButton>\`。

#### 禁用 Attributes 继承

如果**不想要**一个组件自动地继承 attribute，可以在组件选项中设置 \`inheritAttrs: false\`。

从 3.3 开始也可以直接在 \`<script setup>\` 中使用 [\`defineOptions\`](https://cn.vuejs.org/api/sfc-script-setup.html#defineoptions)：

\`\`\`vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup 逻辑
</script>
\`\`\`

最常见的需要禁用 attribute 继承的场景就是 attribute 需要应用在根节点以外的其他元素上。通过设置 \`inheritAttrs\` 选项为 \`false\`，你可以完全控制透传进来的 attribute 被如何使用。

这些透传进来的 attribute 可以在模板的表达式中直接用 \`$attrs\` 访问到。

\`\`\`vue
<span>Fallthrough attribute: {{ $attrs }}</span>
\`\`\`

这个 \`$attrs\` 对象包含了除组件所声明的 \`props\` 和 \`emits\` 之外的所有其他 attribute，例如 \`class\`，\`style\`，\`v-on\` 监听器等等。

有几点需要注意：

- 和 props 有所不同，透传 attributes 在 JavaScript 中保留了它们原始的大小写，所以像 \`foo-bar\` 这样的一个 attribute 需要通过 \`$attrs['foo-bar']\` 来访问。
- 像 \`@click\` 这样的一个 \`v-on\` 事件监听器将在此对象下被暴露为一个函数 \`$attrs.onClick\`。

现在我们要再次使用一下之前小节中的 \`<MyButton>\` 组件例子。有时候我们可能为了样式，需要在 \`<button>\` 元素外包装一层 \`<div>\`：

\`\`\`vue
<div class="btn-wrapper">
  <button class="btn">Click Me</button>
</div>
\`\`\`

我们想要所有像 \`class\` 和 \`v-on\` 监听器这样的透传 attribute 都应用在内部的 \`<button>\` 上而不是外层的 \`<div>\` 上。我们可以通过设定 \`inheritAttrs: false\` 和使用 \`v-bind="$attrs"\` 来实现：

\`\`\`vue
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>
\`\`\`

小提示：没有参数的 \`v-bind\`, 会将一个对象的所有属性都作为 attribute 应用到目标元素上。

#### 多根节点的 Attributes 继承

和单根节点组件有所不同，有着**多个根节点的组件没有自动 attribute 透传行为**。

如果 \`$attrs\` 没有被显式绑定，将会抛出一个运行时警告。

> \`\`\`vue
> <CustomLayout id="custom-layout" @click="changeValue" />
> \`\`\`
>
> 如果 \`<CustomLayout>\` 有下面这样的多根节点模板，由于 Vue 不知道要将 attribute 透传到哪里，所以会抛出一个警告。
>
> \`\`\`vue
> <header>...</header>
> <main>...</main>
> <footer>...</footer>
> \`\`\`
>
> 如果 \`$attrs\` 被显式绑定，则不会有警告：
>
> \`\`\`vue
> <header>...</header>
> <main v-bind="$attrs">...</main>
> <footer>...</footer>
> \`\`\`

#### 在 JavaScript 中访问透传 Attributes

如果需要，可以在 \`<script setup>\` 中使用 \`useAttrs()\` API 来访问一个组件的所有透传 attribute：

\`\`\`vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
\`\`\`

如果没有使用 \`<script setup>\`，\`attrs\` 会作为 \`setup()\` 上下文对象的一个属性暴露：

\`\`\`js
export default {
  setup(props, ctx) {
    // 透传 attribute 被暴露为 ctx.attrs
    console.log(ctx.attrs)
  }
}
\`\`\`

需要注意的是，虽然这里的 \`attrs\` 对象总是反映为最新的透传 attribute，但它并不是响应式的 (考虑到性能因素)。你不能通过侦听器去监听它的变化。如果你需要响应性，可以使用 prop。或者你也可以使用 \`onUpdated()\` 使得在每次更新时结合最新的 \`attrs\` 执行副作用。



### 插槽 slot

![插槽图示](https://cn.vuejs.org/assets/slots.CKcE8XYd.png)

通过使用插槽，\`<FancyButton>\` 仅负责渲染外层的 \`<button>\` (以及相应的样式)，而其内部的内容由父组件提供。

理解插槽的另一种方式是和下面的 JavaScript 函数作类比，其概念是类似的：

\`\`\`js
// 父元素传入插槽内容
FancyButton('Click me!')

// FancyButton 在自己的模板中渲染插槽内容
function FancyButton(slotContent) {
  return \`<button class="fancy-btn">
      \${slotContent}
    </button>\`
}
\`\`\`

插槽内容可以是任意合法的模板内容，不局限于文本。例如我们可以传入多个元素，甚至是组件

通过使用插槽，组件更加灵活和具有可复用性。现在组件可以用在不同的地方渲染各异的内容，但同时还保证都具有相同的样式。

#### 渲染作用域

插槽内容可以访问到父组件的数据作用域，因为插槽内容本身是在父组件模板中定义的。举例来说：

\`\`\`vue
<span>{{ message }}</span>
<FancyButton>{{ message }}</FancyButton>
\`\`\`

这里的两个 \`{{ message }}\` 插值表达式渲染的内容都是一样的。

插槽内容**无法访问**子组件的数据。Vue 模板中的表达式只能访问其定义时所处的作用域，这和 JavaScript 的词法作用域规则是一致的。

换言之：父组件模板中的表达式只能访问父组件的作用域；子组件模板中的表达式只能访问子组件的作用域。

#### 默认内容

在外部没有提供任何内容的情况下，可以在\<slot>内为插槽指定默认内容。

> 比如有这样一个 \`<SubmitButton>\` 组件：
>
> \`\`\`vue
> <button type="submit">
>   <slot></slot>
> </button>
> \`\`\`
>
> 如果我们想在父组件没有提供任何插槽内容时在 \`<button>\` 内渲染“Submit”，只需要将“Submit”写在 \`<slot>\` 标签之间来作为默认内容：
>
> \`\`\`vue
> <button type="submit">
>   <slot>
>     Submit <!-- 默认内容 -->
>   </slot>
> </button>
> \`\`\`
>
> 现在，当我们在父组件中使用 \`<SubmitButton>\` 且没有提供任何插槽内容时：
>
> \`\`\`vue
> <SubmitButton />
> \`\`\`
>
> “Submit”将会被作为默认内容渲染：
>
> \`\`\`vue
> <button type="submit">Submit</button>
> \`\`\`
>
> 但如果我们提供了插槽内容：
>
> \`\`\`vue
> <SubmitButton>Save</SubmitButton>
> \`\`\`
>
> 那么被显式提供的内容会取代默认内容：
>
> \`\`\`vue
> <button type="submit">Save</button>
> \`\`\`



#### 具名插槽

\`<slot>\` 元素可以有一个特殊的 attribute \`name\`，用来给各个插槽分配唯一的 ID，以确定每一处要渲染的内容。

这类带 \`name\` 的插槽被称为具名插槽 (named slots)。没有提供 \`name\` 的 \`<slot>\` 出口会隐式地命名为“default”。

要为具名插槽传入内容，我们需要使用一个含 \`v-slot\` 指令的 \`<template>\` 元素，并将目标插槽的名字传给该指令。

\`v-slot\` 有对应的简写 \`#\`，因此 \`<template v-slot:header>\` 可以简写为 \`<template #header>\`。其意思就是“将这部分模板片段传入子组件的 header 插槽中”。

> 举例来说，在一个 \`<BaseLayout>\` 组件中，有如下模板：
>
> \`\`\`vue
> <div class="container">
>   <header>
>     <slot name="header"></slot>
>   </header>
>   <main>
>     <slot></slot>
>   </main>
>   <footer>
>     <slot name="footer"></slot>
>   </footer>
> </div>
> \`\`\`
>
> 下面我们给出完整的、向 \`<BaseLayout>\` 传递插槽内容的代码，指令均使用的是缩写形式：
>
> \`\`\`vue
> <BaseLayout>
>   <template #header>
>     <h1>Here might be a page title</h1>
>   </template>
> 
>   <template #default>
>     <p>A paragraph for the main content.</p>
>     <p>And another one.</p>
>   </template>
> 
>   <template #footer>
>     <p>Here's some contact info</p>
>   </template>
> </BaseLayout>
> \`\`\`
>
> 当一个组件同时接收默认插槽和具名插槽时，所有位于顶级的非 \`<template>\` 节点都被隐式地视为默认插槽的内容。所以上面也可以写成：
>
> \`\`\`vue
> <BaseLayout>
>   <template #header>
>     <h1>Here might be a page title</h1>
>   </template>
> 
>   <!-- 隐式的默认插槽 -->
>   <p>A paragraph for the main content.</p>
>   <p>And another one.</p>
> 
>   <template #footer>
>     <p>Here's some contact info</p>
>   </template>
> </BaseLayout>
> \`\`\`
>
> 现在 \`<template>\` 元素中的所有内容都将被传递到相应的插槽。最终渲染出的 HTML 如下：
>
> \`\`\`html
> <div class="container">
>   <header>
>     <h1>Here might be a page title</h1>
>   </header>
>   <main>
>     <p>A paragraph for the main content.</p>
>     <p>And another one.</p>
>   </main>
>   <footer>
>     <p>Here's some contact info</p>
>   </footer>
> </div>
> \`\`\`

#### 条件插槽

有时需要根据插槽是否存在来渲染某些内容。

可以结合使用 [$slots](https://cn.vuejs.org/api/component-instance.html#slots) 属性与 \`v-if\` 来实现。

> 在下面的示例中，我们定义了一个卡片组件，它拥有三个条件插槽：\`header\`、\`footer\` 和 \`default\`。 当 header、footer 或 default 存在时，我们希望包装它们以提供额外的样式：
>
> \`\`\`vue
> <template>
>   <div class="card">
>     <div v-if="$slots.header" class="card-header">
>       <slot name="header" />
>     </div>
>     
>     <div v-if="$slots.default" class="card-content">
>       <slot />
>     </div>
>     
>     <div v-if="$slots.footer" class="card-footer">
>       <slot name="footer" />
>     </div>
>   </div>
> </template>
> \`\`\`

#### 动态插槽名

动态指令参数在 \`v-slot\` 上也是有效的。

> 可以定义下面这样的动态插槽名：
>
> \`\`\`vue
> <base-layout>
>   <template v-slot:[dynamicSlotName]>
>     ...
>   </template>
> 
>   <!-- 缩写为 -->
>   <template #[dynamicSlotName]>
>     ...
>   </template>
> </base-layout>
> \`\`\`
>
> 注意这里的表达式和动态指令参数受相同的语法限制。

#### 作用域插槽

在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。要做到这一点，我们需要一种方法来让子组件在渲染时将一部分数据提供给插槽。

可以像对组件传递 props 那样，向一个插槽的出口上传递 attributes。

当需要接收插槽 props 时，默认插槽和具名插槽的使用方式有一些小区别。

**默认作用域插槽**接受 props：通过子组件标签上的 \`v-slot\` 指令，直接接收到了一个插槽 props 对象：

\`\`\`vue
<!-- <MyComponent> 的模板 -->
<script setup>
const greetingMessage = 'hello'
</script>

<template>
  	  <div>
  		<slot :text="greetingMessage" :count="1"></slot>
	</div>
</template>
\`\`\`

向默认插槽中传入 props：

\`\`\`vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
	<MyComponent v-slot="slotProps">
		{{ slotProps.text }} {{ slotProps.count }}
	</MyComponent>
</template>
\`\`\`

**具名作用域插槽**：插槽 props 可以作为 \`v-slot\` 指令的值被访问到：\`v-slot:name="slotProps"\`。当使用缩写时是这样：

\`\`\`vue
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>
</MyComponent>
\`\`\`

向具名插槽中传入 props：

\`\`\`vue
<slot name="header" message="hello"></slot>
\`\`\`

##### 高级列表组件示例

展示一个适合用到作用域插槽的场景：\`<FancyList>\` 组件

它会渲染一个列表，并同时会封装一些加载远端数据的逻辑、使用数据进行列表渲染、或者是像分页或无限滚动这样更进阶的功能。然而我们希望它能够保留足够的灵活性，将对单个列表元素内容和样式的控制权留给使用它的父组件。我们期望的用法可能是这样的：

\`\`\`vue
<script setup>
import FancyList from './FancyList.vue'
</script>

<template>
  <FancyList api-url="url" :per-page="10">
    <template #item="{ body, username, likes }">
      <div class="item">
        <p>{{ body }}</p>
        <p class="meta">by {{ username }} | {{ likes }} likes</p>
      </div>
    </template>
  </FancyList>
</template>

<style scoped>
.meta {
  font-size: 0.8em;
  color: #42b883;
}
</style>
\`\`\`

在 \`<FancyList>\` 之中，我们可以多次渲染 \`<slot>\` 并每次都提供不同的数据 (注意我们这里使用了 \`v-bind\` 来传递插槽的 props)：

\`\`\`vue
<script setup>
import { ref } from 'vue'

const props = defineProps(['api-url', 'per-page'])

const items = ref([])

// mock remote data fetching
setTimeout(() => {
  items.value = [
    { body: 'Scoped Slots Guide', username: 'Evan You', likes: 20 },
	  { body: 'Vue Tutorial', username: 'Natalia Tepluhina', likes: 10 }
  ]
}, 1000)
</script>

<template>
  <ul>
    <li v-if="!items.length">
      Loading...
    </li>
    <li v-for="item in items">
      <slot name="item" v-bind="item"/>
    </li>
  </ul>
</template>

<style scoped>
  ul {
    list-style-type: none;
    padding: 5px;
    background: linear-gradient(315deg, #42d392 25%, #647eff);
  }
  li {
    padding: 5px 20px;
    margin: 10px;
    background: #fff;
  }
</style>
\`\`\`

#### 无渲染组件

可以想象的是，一些组件可能只包括了逻辑而不需要自己渲染内容，视图输出通过作用域插槽全权交给了消费者组件。我们将这种类型的组件称为**无渲染组件**。

这里有一个无渲染组件的例子，一个封装了追踪当前鼠标位置逻辑的组件：

\`\`\`vue
<script setup>
import MouseTracker from './MouseTracker.vue'
</script>

<template>
	<MouseTracker v-slot="{ x, y }">
  	Mouse is at: {{ x }}, {{ y }}
	</MouseTracker>
</template>
\`\`\`

\`\`\`vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
  
const x = ref(0)
const y = ref(0)

const update = e => {
  x.value = e.pageX
  y.value = e.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>
  <slot :x="x" :y="y"/>
</template>
\`\`\`



### 依赖注入

#### Prop 逐级透传问题

通常情况下，当我们需要从父组件向子组件传递数据时，会使用 props。想象一下这样的结构：有一些多层级嵌套的组件，形成了一棵巨大的组件树，而某个深层的子组件需要一个较远的祖先组件中的部分数据。在这种情况下，如果仅使用 props 则必须将其沿着组件链逐级传递下去，这会非常麻烦：

![Prop 逐级透传的过程图示](https://cn.vuejs.org/assets/prop-drilling.XJXa8UE-.png)

注意，虽然这里的 \`<Footer>\` 组件可能根本不关心这些 props，但为了使 \`<DeepChild>\` 能访问到它们，仍然需要定义并向下传递。如果组件链路非常长，可能会影响到更多这条路上的组件。这一问题被称为“prop 逐级透传”，显然是我们希望尽量避免的情况。

\`provide\` 和 \`inject\` 可以帮助我们解决这一问题。一个父组件相对于其所有的后代组件，会作为**依赖提供者**。任何后代的组件树，无论层级有多深，都可以**注入**由父组件提供给整条链路的依赖。

#### Provide (提供)

要为组件后代提供数据，需要使用到 \`provide()\`函数：

\`\`\`vue
<script setup>
import { provide } from 'vue'

provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
</script>
\`\`\`

\`provide()\` 函数接收两个参数。第一个参数被称为**注入名**，可以是一个字符串或是一个 \`Symbol\`。后代组件会用注入名来查找期望注入的值。一个组件可以多次调用 \`provide()\`，使用不同的注入名，注入不同的依赖值。

第二个参数是提供的值，值可以是任意类型，包括响应式的状态，比如一个 ref：

\`\`\`js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
\`\`\`

提供的响应式状态使后代组件可以由此和提供者建立响应式的联系。

#### 应用层 Provide

除了在一个组件中提供依赖，我们还可以在整个应用层面提供依赖：

\`\`\`js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
\`\`\`

在应用级别提供的数据在该应用内的所有组件中都可以注入。这在你编写\`插件\`时会特别有用，因为插件一般都不会使用组件形式来提供值。

#### Inject (注入)

要注入上层组件提供的数据，需使用 \`inject()\` 函数：

\`\`\`vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
\`\`\`

如果提供的值是一个 ref，注入进来的会是该 ref 对象，而**不会**自动解包为其内部的值。这使得注入方组件能够通过 ref 对象保持了和供给方的响应性链接。

#### 注入默认值

默认情况下，\`inject\` 假设传入的注入名会被某个祖先链上的组件提供。如果该注入名的确没有任何组件提供，则会抛出一个运行时警告。

如果在注入一个值时不要求必须有提供者，那么我们应该声明一个默认值，和 props 类似：

\`\`\`js
// 如果没有祖先组件提供 "message"
// \`value\` 会是 "这是默认值"
const value = inject('message', '这是默认值')
\`\`\`

在一些场景中，默认值可能需要通过调用一个函数或初始化一个类来取得。为了避免在用不到默认值的情况下进行不必要的计算或产生副作用，我们可以使用工厂函数来创建默认值：

\`\`\`js
const value = inject('key', () => new ExpensiveClass(), true)
\`\`\`

第三个参数表示默认值应该被当作一个工厂函数。

#### 和响应式数据配合使用

当提供 / 注入响应式的数据时，**建议尽可能将任何对响应式状态的变更都保持在供给方组件中**。这样可以确保所提供状态的声明和变更操作都内聚在同一个组件内，使其更容易维护。

有的时候，我们可能需要在注入方组件中更改数据。在这种情况下，我们推荐在供给方组件内声明并提供一个更改数据的方法函数：

\`\`\`vue
<!-- 在供给方组件内 -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
\`\`\`

\`\`\`vue
<!-- 在注入方组件 -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
\`\`\`

最后，如果想确保提供的数据不能被注入方的组件更改，你可以使用 \`readonly()\` 来包装提供的值。

\`\`\`vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
\`\`\`

#### 使用 Symbol 作注入名

但如果正在构建大型的应用，包含非常多的依赖提供，或者正在编写提供给其他开发者使用的组件库，建议最好使用 Symbol 来作为注入名以避免潜在的冲突。

我们通常推荐在一个单独的文件中导出这些注入名 Symbol：

\`\`\`js
// keys.js
export const myInjectionKey = Symbol()
\`\`\`

\`\`\`js
// 在供给方组件中
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, { /*
  要提供的数据
*/ });
\`\`\`

\`\`\`js
// 注入方组件
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
\`\`\`



### 异步组件

#### 基本用法

在大型项目中，我们可能需要拆分应用为更小的块，并仅在需要时再从服务器加载相关组件。Vue 提供了 \`defineAsyncComponent\` 方法来实现此功能：

\`\`\`js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */)
  })
})
// ... 像使用其他一般组件一样使用 \`AsyncComp\`
\`\`\`

\`defineAsyncComponent\` 方法接收一个返回 Promise 的加载函数。这个 Promise 的 \`resolve\` 回调方法应该在从服务器获得组件定义时调用。也可以调用 \`reject(reason)\` 表明加载失败。

ES 模块动态导入 也会返回一个 Promise，所以多数情况下我们会将它和 \`defineAsyncComponent\` 搭配使用。类似 Vite 和 Webpack 这样的构建工具也支持此语法 (并且会将它们作为打包时的代码分割点)，因此我们也可以用它来导入 Vue 单文件组件：

\`\`\`js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
\`\`\`

最后得到的 \`AsyncComp\` 是一个外层包装过的组件，仅在页面需要它渲染时才会调用加载内部实际组件的函数。它会将接收到的 props 和插槽传给内部组件，所以你可以使用这个异步的包装组件无缝地替换原始组件，同时实现延迟加载。

与普通组件一样，异步组件可以使用 \`app.component()\` 全局注册：

\`\`\`js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
\`\`\`

也可以直接在父组件中直接定义它们：

\`\`\`vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
\`\`\`

#### 加载与错误状态

异步操作不可避免地会涉及到加载和错误状态，因此 \`defineAsyncComponent()\` 也支持在高级选项中处理这些状态：

\`\`\`js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
\`\`\`

如果提供了一个加载组件，它将在内部组件加载时先行显示。在加载组件显示之前有一个默认的 200ms 延迟——这是因为在网络状况较好时，加载完成得很快，加载组件和最终组件之间的替换太快可能产生闪烁，反而影响用户感受。

如果提供了一个报错组件，则它会在加载器函数返回的 Promise 抛错时被渲染。你还可以指定一个超时时间，在请求耗时超过指定时间时也会渲染报错组件。

#### 惰性激活

如果正在使用[服务器端渲染](https://cn.vuejs.org/guide/scaling-up/ssr.html)，这一部分才会适用。(vue3.5+)

 [惰性激活](https://cn.vuejs.org/guide/components/async.html#lazy-hydration) 点此查看





## 组件通信

**\`Vue3\`组件通信和\`Vue2\`的区别：**

- 移出事件总线，使用\`mitt\`代替。
- \`vuex\`换成了\`pinia\`。
- 把\`.sync\`优化到了\`v-model\`里面了。
- 把\`$listeners\`所有的东西，合并到\`$attrs\`中了。
- \`$children\`被砍掉了。

![image-20241027140511350](https://raw.githubusercontent.com/Jenlybein/My-Typora-Images/imgs/202410271405437.png)

**以下将从组件深入讲解中抽离出组件通信的方式单独讲解**

### prop

概述：\`props\`是使用频率最高的一种通信方式，常用与 ：**父 ↔ 子**。

- 若 **父传子**：属性值是**非函数**。
- 若 **子传父**：属性值是**函数**。

父组件：

\`\`\`vue
<template>
  <div class="father">
    <h3>父组件，</h3>
		<h4>我的车：{{ car }}</h4>
		<h4>儿子给的玩具：{{ toy }}</h4>
		<Child :car="car" :getToy="getToy"/>
  </div>
</template>

<script setup lang="ts" name="Father">
	import Child from './Child.vue'
	import { ref } from "vue";
	// 数据
	const car = ref('奔驰')
	const toy = ref()
	// 方法
	function getToy(value:string){
		toy.value = value
	}
</script>
\`\`\`

子组件:

\`\`\`vue
<template>
  <div class="child">
    <h3>子组件</h3>
		<h4>我的玩具：{{ toy }}</h4>
		<h4>父给我的车：{{ car }}</h4>
		<button @click="getToy(toy)">玩具给父亲</button>
  </div>
</template>

<script setup lang="ts" name="Child">
	import { ref } from "vue";
	const toy = ref('奥特曼')
	
	defineProps(['car','getToy'])
</script>
\`\`\`



### 自定义事件

1. 概述：自定义事件常用于：**子 => 父。**
2. 注意区分好：原生事件、自定义事件。

- 原生事件：
  - 事件名是特定的（\`click\`、\`mosueenter\`等等）	
  - 事件对象\`$event\`: 是包含事件相关信息的对象（\`pageX\`、\`pageY\`、\`target\`、\`keyCode\`）
- 自定义事件：
  - 事件名是任意名称
  - <strong style="color:red">事件对象\`$event\`: 是调用\`emit\`时所提供的数据，可以是任意类型！！！</strong >

3. 示例：

   \`\`\`html
   <!--在父组件中，给子组件绑定自定义事件：-->
   <Child @send-toy="toy = $event"/>
   
   <!--注意区分原生事件与自定义事件中的$event-->
   <button @click="toy = $event">测试</button>
   \`\`\`

   \`\`\`js
   //子组件中，触发事件：
   this.$emit('send-toy', 具体数据)
   // 或
   const emit =  defineEmits(['send-toy'])
   emit('send-toy',toy)
   \`\`\`



### mitt

概述：与消息订阅与发布（\`pubsub\`）功能类似，可以实现**任意组件间**通信。

安装\`mitt\`

\`\`\`shell
npm i mitt
\`\`\`

新建文件：\`src\\utils\emitter.ts\`

\`\`\`javascript
// 引入mitt 
import mitt from "mitt";

// 创建emitter
const emitter = mitt()

/*
  // 绑定事件
  emitter.on('abc',(value)=>{
    console.log('abc事件被触发',value)
  })
  emitter.on('xyz',(value)=>{
    console.log('xyz事件被触发',value)
  })

  setInterval(() => {
    // 触发事件
    emitter.emit('abc',666)
    emitter.emit('xyz',777)
  }, 1000);

  setTimeout(() => {
    // 清理事件
    emitter.all.clear()
  }, 3000); 
*/

// 创建并暴露mitt
export default emitter
\`\`\`

接收数据的组件中：绑定事件、同时在销毁前解绑事件：

\`\`\`typescript
import emitter from "@/utils/emitter";
import { onUnmounted } from "vue";

// 绑定事件
emitter.on('send-toy',(value)=>{
  console.log('send-toy事件被触发',value)
})

onUnmounted(()=>{
  // 解绑事件
  emitter.off('send-toy')
})
\`\`\`

【第三步】：提供数据的组件，在合适的时候触发事件

\`\`\`javascript
import emitter from "@/utils/emitter";

function sendToy(){
  // 触发事件
  emitter.emit('send-toy',toy.value)
}
\`\`\`

**注意这个重要的内置关系，总线依赖着这个内置关系**



### v-model

1. 概述：实现 **父↔子** 之间相互通信。

2. 具体内容查看上方**深入组件**中的**v-model**




### \$attrs

1. 概述：\`$attrs\`用于实现**当前组件的父组件**，向**当前组件的子组件**通信（**祖→孙**）。

2. 具体说明：\`$attrs\`是一个对象，包含所有父组件传入的标签属性。

   >  注意：\`$attrs\`会自动排除\`props\`中声明的属性(可以认为声明过的 \`props\` 被子组件自己“消费”了)

父组件：

\`\`\`vue
<template>
  <div class="father">
    <h3>父组件</h3>
		<Child :a="a" :b="b" :c="c" :d="d" v-bind="{x:100,y:200}" :updateA="updateA"/>
  </div>
</template>

<script setup lang="ts" name="Father">
	import Child from './Child.vue'
	import { ref } from "vue";
	let a = ref(1)
	let b = ref(2)
	let c = ref(3)
	let d = ref(4)

	function updateA(value){
		a.value = value
	}
</script>
\`\`\`

子组件：

\`\`\`vue
<template>
	<div class="child">
		<h3>子组件</h3>
		<GrandChild v-bind="$attrs"/>
	</div>
</template>

<script setup lang="ts" name="Child">
	import GrandChild from './GrandChild.vue'
</script>
\`\`\`

孙组件：

\`\`\`vue
<template>
	<div class="grand-child">
		<h3>孙组件</h3>
		<h4>a：{{ a }}</h4>
		<h4>b：{{ b }}</h4>
		<h4>c：{{ c }}</h4>
		<h4>d：{{ d }}</h4>
		<h4>x：{{ x }}</h4>
		<h4>y：{{ y }}</h4>
		<button @click="updateA(666)">点我更新A</button>
	</div>
</template>

<script setup lang="ts" name="GrandChild">
	defineProps(['a','b','c','d','x','y','updateA'])
</script>
\`\`\`



### \$parent 和 \$refs

1. 概述：

   * \`$refs\`用于 ：**父→子。**
   * \`$parent\`用于：**子→父。**
   * 数据都需要主动暴露才能被访问：\`defineExpose()\`

2. 原理如下：

   | 属性      | 说明                                                     |
   | --------- | -------------------------------------------------------- |
   | \`$refs\`   | 值为对象，包含所有被\`ref\`属性标识的\`DOM\`元素或组件实例。 |
   | \`$parent\` | 值为对象，当前组件的父组件实例对象。                     |

> \`\`\`vue
> 父组件：
> <template>
> 	<div class="father">
> 		<h3>父组件</h3>
> 		<h4>房产：{{ house }}</h4>
> 		<button @click="changeToy">修改Child1的玩具</button>
> 		<button @click="changeComputer">修改Child2的电脑</button>
> 		<button @click="getAllChild($refs)">让所有孩子的书变多</button>
> 		<Child1 ref="c1"/>
> 		<Child2 ref="c2"/>
> 	</div>
> </template>
> 
> <script setup lang="ts" name="Father">
> 	import Child1 from './Child1.vue'
> 	import Child2 from './Child2.vue'
> 	import { ref } from "vue";
> 	let c1 = ref()
> 	let c2 = ref()
> 	let house = ref(4)
> 	function changeToy(){
> 		c1.value.toy = '小猪佩奇'
> 	}
> 	function changeComputer(){
> 		c2.value.computer = '华为'
> 	}
> 	function getAllChild(refs:{[key:string]:any}){
> 		console.log(refs)
> 		for (let key in refs){
> 			refs[key].book += 3
> 		}
> 	}
> 	// 向外部提供数据
> 	defineExpose({house})
> </script>
> 
> 子组件1：
> <template>
>   <div class="child1">
>     <h3>子组件1</h3>
> 		<h4>玩具：{{ toy }}</h4>
> 		<h4>书籍：{{ book }} 本</h4>
> 		<button @click="minusHouse($parent)">干掉父亲的一套房产</button>
>   </div>
> </template>
> 
> <script setup lang="ts" name="Child1">
> 	import { ref } from "vue"
> 	let toy = ref('奥特曼')
> 	let book = ref(3)
> 	function minusHouse(parent:any){
> 		parent.house -= 1
> 	}
> 	// 把数据交给外部
> 	defineExpose({toy,book})
> </script>
> 
> 子组件2：
> <template>
>   <div class="child2">
>     <h3>子组件2</h3>
> 		<h4>电脑：{{ computer }}</h4>
> 		<h4>书籍：{{ book }} 本</h4>
>   </div>
> </template>
> 
> <script setup lang="ts" name="Child2">
> 		import { ref } from "vue";
> 		let computer = ref('联想')
> 		let book = ref(6)
> 		// 把数据交给外部
> 		defineExpose({computer,book})
> </script>
> \`\`\`



### provide、inject

1. 概述：实现**祖孙组件**直接通信

2. 具体使用：

   * 在祖先组件中通过\`provide\`配置向后代组件提供数据
   * 在后代组件中通过\`inject\`配置来声明接收数据

3. 具体编码：

   【第一步】父组件中，使用\`provide\`提供数据

   \`\`\`vue
   <template>
     <div class="father">
       <h3>父组件</h3>
       <h4>资产：{{ money }}</h4>
       <h4>汽车：{{ car }}</h4>
       <button @click="money += 1">资产+1</button>
       <button @click="car.price += 1">汽车价格+1</button>
       <Child/>
     </div>
   </template>
   
   <script setup lang="ts" name="Father">
     import Child from './Child.vue'
     import { ref,reactive,provide } from "vue";
     // 数据
     let money = ref(100)
     let car = reactive({
       brand:'奔驰',
       price:100
     })
     // 用于更新money的方法
     function updateMoney(value:number){
       money.value += value
     }
     // 提供数据
     provide('moneyContext',{money,updateMoney})
     provide('car',car)
   </script>
   \`\`\`

   > 注意：子组件中不用编写任何东西，是不受到任何打扰的

   【第二步】孙组件中使用\`inject\`配置项接受数据。

   \`\`\`vue
   <template>
     <div class="grand-child">
       <h3>我是孙组件</h3>
       <h4>资产：{{ money }}</h4>
       <h4>汽车：{{ car }}</h4>
       <button @click="updateMoney(6)">点我</button>
     </div>
   </template>
   
   <script setup lang="ts" name="GrandChild">
     import { inject } from 'vue';
     // 注入数据
    let {money,updateMoney} = inject('moneyContext',{money:0,updateMoney:(x:number)=>{}})
     let car = inject('car')
   </script>
   \`\`\`



### pinia

pinia也可以作为通信方式



### slot 插槽

1. 默认插槽

   \`\`\`vue
   父组件中：
           <Category title="今日热门游戏">
             <ul>
               <li v-for="g in games" :key="g.id">{{ g.name }}</li>
             </ul>
           </Category>
   子组件中：
           <template>
             <div class="item">
               <h3>{{ title }}</h3>
               <!-- 默认插槽 -->
               <slot></slot>
             </div>
           </template>
   \`\`\`

2. 具名插槽

   \`\`\`vue
   父组件中：
           <Category title="今日热门游戏">
             <template v-slot:s1>
               <ul>
                 <li v-for="g in games" :key="g.id">{{ g.name }}</li>
               </ul>
             </template>
             <template #s2>
               <a href="">更多</a>
             </template>
           </Category>
   子组件中：
           <template>
             <div class="item">
               <h3>{{ title }}</h3>
               <slot name="s1"></slot>
               <slot name="s2"></slot>
             </div>
           </template>
   \`\`\`

3. ### 作用域插槽

   1. 理解：<span style="color:red">数据在组件的自身，但根据数据生成的结构需要组件的使用者来决定。</span>（新闻数据在\`News\`组件中，但使用数据所遍历出来的结构由\`App\`组件决定）

   2. 具体编码：

      \`\`\`vue
      父组件中：
            <Game v-slot="params">
            <!-- <Game v-slot:default="params"> -->
            <!-- <Game #default="params"> -->
              <ul>
                <li v-for="g in params.games" :key="g.id">{{ g.name }}</li>
              </ul>
            </Game>
      
      子组件中：
            <template>
              <div class="category">
                <h2>今日游戏榜单</h2>
                <slot :games="games" a="哈哈"></slot>
              </div>
            </template>
      
            <script setup lang="ts" name="Category">
              import {reactive} from 'vue'
              let games = reactive([
                {id:'asgdytsa01',name:'英雄联盟'},
                {id:'asgdytsa02',name:'王者荣耀'},
                {id:'asgdytsa03',name:'红色警戒'},
                {id:'asgdytsa04',name:'斗罗大陆'}
              ])
            </script>
      \`\`\`





## 内置组件

### Transition

- \`<Transition>\` 会在一个元素或组件进入和离开 DOM 时应用动画。

\`<Transition>\` 是一个内置组件，这意味着它在任意别的组件中都可以被使用，无需注册。它可以将进入和离开动画应用到通过默认插槽传递给它的元素或组件上。进入或离开可以由以下的条件之一触发：

- 由 \`v-if\` 所触发的切换
- 由 \`v-show\` 所触发的切换
- 由特殊元素 \`<component>\` 切换的动态组件
- 改变特殊的 \`key\` 属性

当一个 \`<Transition>\` 组件中的元素被插入或移除时，会发生下面这些事情：

1. Vue 会自动检测目标元素是否应用了 CSS 过渡或动画。如果是，则一些 \`CSS 过渡 class\` 会在适当的时机被添加和移除。
2. 如果有作为监听器的 \`JavaScript hook\`，这些钩子函数会在适当时机被调用。
3. 如果没有探测到 CSS 过渡或动画、也没有提供 JavaScript 钩子，那么 DOM 的插入、删除操作将在浏览器的下一个动画帧后执行。

> 以下是最基本用法的示例：
>
> \`\`\`vue
> <button @click="show = !show">Toggle</button>
> <Transition>
>   <p v-if="show">hello</p>
> </Transition>
> \`\`\`
>
> \`\`\`css
> /* 下面我们会解释这些 class 是做什么的 */
> .v-enter-active,
> .v-leave-active {
>   transition: opacity 0.5s ease;
> }
> 
> .v-enter-from,
> .v-leave-to {
>   opacity: 0;
> }
> \`\`\`

#### 基于 CSS 的过渡效果

##### CSS 过渡 class

一共有 6 个应用于进入与离开过渡效果的 CSS class。

![过渡图示](https://cn.vuejs.org/assets/transition-classes.DYG5-69l.png)

1. \`v-enter-from\`：进入动画的起始状态。在元素插入之前添加，在元素插入完成后的下一帧移除。
2. \`v-enter-active\`：进入动画的生效状态。应用于整个进入动画阶段。在元素被插入之前添加，在过渡或动画完成之后移除。这个 class 可以被用来定义进入动画的持续时间、延迟与速度曲线类型。
3. \`v-enter-to\`：进入动画的结束状态。在元素插入完成后的下一帧被添加 (也就是 \`v-enter-from\` 被移除的同时)，在过渡或动画完成之后移除。
4. \`v-leave-from\`：离开动画的起始状态。在离开过渡效果被触发时立即添加，在一帧后被移除。
5. \`v-leave-active\`：离开动画的生效状态。应用于整个离开动画阶段。在离开过渡效果被触发时立即添加，在过渡或动画完成之后移除。这个 class 可以被用来定义离开动画的持续时间、延迟与速度曲线类型。
6. \`v-leave-to\`：离开动画的结束状态。在一个离开动画被触发后的下一帧被添加 (也就是 \`v-leave-from\` 被移除的同时)，在过渡或动画完成之后移除。

##### 为过渡效果命名

我们可以给 \`<Transition>\` 组件传一个 \`name\` prop 来声明一个过渡效果名：

\`\`\`vue
<Transition name="fade">
  ...
</Transition>
\`\`\`

对于一个有名字的过渡效果，对它起作用的过渡 class 会以其名字而不是 \`v\` 作为前缀。比如，上方例子中被应用的 class 将会是 \`fade-enter-active\` 而不是 \`v-enter-active\`。这个“fade”过渡的 class 应该是这样：

\`\`\`css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
\`\`\`

##### CSS 的 transition

\<Transition> 一般都会搭配原生 CSS 过渡一起使用，正如你在上面的例子中所看到的那样。这个 transition CSS 属性是一个简写形式，使我们可以一次定义一个过渡的各个方面，包括需要执行动画的属性、持续时间和速度曲线。

下面是一个更高级的例子，它使用了不同的持续时间和速度曲线来过渡多个属性：

\`\`\`vue
<Transition name="slide-fade">
  <p v-if="show">hello</p>
</Transition>
\`\`\`

\`\`\`css
/*
  进入和离开动画可以使用不同
  持续时间和速度曲线。
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
\`\`\`

##### CSS 的 animation

[原生 CSS 动画](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)和 CSS transition 的应用方式基本上是相同的，只有一点不同，那就是 \`*-enter-from\` 不是在元素插入后立即移除，而是在一个 \`animationend\` 事件触发时被移除。

对于大多数的 CSS 动画，我们可以简单地在 \`*-enter-active\` 和 \`*-leave-active\` class 下声明它们。下面是一个示例：

\`\`\`vue
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Hello here is some bouncy text!
  </p>
</Transition>
\`\`\`

\`\`\`css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
\`\`\`

##### 自定义过渡 class

也可以向 \`<Transition>\` 传递以下的 props 来指定自定义的过渡 class：

- \`enter-from-class\`
- \`enter-active-class\`
- \`enter-to-class\`
- \`leave-from-class\`
- \`leave-active-class\`
- \`leave-to-class\`

传入的这些 class 会覆盖相应阶段的默认 class 名。这个功能在你想要在 Vue 的动画机制下集成其他的第三方 CSS 动画库时非常有用。

##### 同时使用 transition 和 animation

然而在某些场景中，你或许想要在同一个元素上同时使用它们两个。举例来说，Vue 触发了一个 CSS 动画，同时鼠标悬停触发另一个 CSS 过渡。此时你需要显式地传入 \`type\` prop 来声明，告诉 Vue 需要关心哪种类型，传入的值是 \`animation\` 或 \`transition\`：

\`\`\`vue
<Transition type="animation">...</Transition>
\`\`\`

##### 深层级过渡与显式过渡时长

尽管过渡 class 仅能应用在 \`<Transition>\` 的直接子元素上，我们还是可以使用深层级的 CSS 选择器，在深层级的元素上触发过渡效果：

\`\`\`vue
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      Hello
    </div>
  </div>
</Transition>
\`\`\`

\`\`\`css
/* 应用于嵌套元素的规则 */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... 省略了其他必要的 CSS */
\`\`\`

我们甚至可以在深层元素上添加一个过渡延迟，从而创建一个带渐进延迟的动画序列：

\`\`\`css
/* 延迟嵌套元素的进入以获得交错效果 */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
\`\`\`

然而，这会带来一个小问题。默认情况下，\`<Transition>\` 组件会通过监听过渡根元素上的**第一个** \`transitionend\` 或者 \`animationend\` 事件来尝试自动判断过渡何时结束。而在嵌套的过渡中，期望的行为应该是等待所有内部元素的过渡完成。

在这种情况下，你可以通过向 \`<Transition>\` 组件传入 \`duration\` prop 来显式指定过渡的持续时间 (以毫秒为单位)。总持续时间应该匹配延迟加上内部元素的过渡持续时间：

\`\`\`vue
<Transition :duration="550">...</Transition>
\`\`\`

如果有必要的话，你也可以用对象的形式传入，分开指定进入和离开所需的时间：

\`\`\`vue
<Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
\`\`\`

##### 性能考量

你可能注意到我们上面例子中展示的动画所用到的 CSS 属性大多是 \`transform\` 和 \`opacity\` 之类的。用这些属性制作动画非常高效，因为：

1. 他们在动画过程中不会影响到 DOM 结构，因此不会每一帧都触发昂贵的 CSS 布局重新计算。
2. 大多数的现代浏览器都可以在执行 \`transform\` 动画时利用 GPU 进行硬件加速。

相比之下，像 \`height\` 或者 \`margin\` 这样的属性会触发 CSS 布局变动，因此执行它们的动画效果更昂贵，需要谨慎使用。

#### JavaScript 钩子

可以通过监听 \`<Transition>\` 组件事件的方式在过渡过程中挂上钩子函数：

\`\`\`html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
\`\`\`

\`\`\`js
// 在元素被插入到 DOM 之前被调用
// 用这个来设置元素的 "enter-from" 状态
function onBeforeEnter(el) {}

// 在元素被插入到 DOM 之后的下一帧被调用
// 用这个来开始进入动画
function onEnter(el, done) {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
}

// 当进入过渡完成时调用。
function onAfterEnter(el) {}

// 当进入过渡在完成之前被取消时调用
function onEnterCancelled(el) {}

// 在 leave 钩子之前调用
// 大多数时候，你应该只会用到 leave 钩子
function onBeforeLeave(el) {}

// 在离开过渡开始时调用
// 用这个来开始离开动画
function onLeave(el, done) {
  // 调用回调函数 done 表示过渡结束
  // 如果与 CSS 结合使用，则这个回调是可选参数
  done()
}

// 在离开过渡完成、
// 且元素已从 DOM 中移除时调用
function onAfterLeave(el) {}

// 仅在 v-show 过渡中可用
function onLeaveCancelled(el) {}
\`\`\`

这些钩子可以与 CSS 过渡或动画结合使用，也可以单独使用。

在使用仅由 JavaScript 执行的动画时，最好是添加一个 \`:css="false"\` prop。这显式地向 Vue 表明可以跳过对 CSS 过渡的自动探测。除了性能稍好一些之外，还可以防止 CSS 规则意外地干扰过渡效果：

\`\`\`vue
<Transition
  ...
  :css="false"
>
  ...
</Transition>
\`\`\`

在有了 \`:css="false"\` 后，我们就自己全权负责控制什么时候过渡结束了。这种情况下对于 \`@enter\` 和 \`@leave\` 钩子来说，回调函数 \`done\` 就是必须的。否则，钩子将被同步调用，过渡将立即完成。

##### Gasp库示例

这里是使用 [GSAP 库](https://gsap.com/)执行动画的一个示例，也可以使用任何想要的库，比如 [Anime.js](https://animejs.com/) 或者 [Motion One](https://motion.dev/)：

\`\`\`vue
<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

const show = ref(true)

function onBeforeEnter(el) {
  gsap.set(el, {
    scaleX: 0.25,
    scaleY: 0.25,
    opacity: 1
  })
}
  
function onEnter(el, done) {
  gsap.to(el, {
    duration: 1,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    ease: 'elastic.inOut(2.5, 1)',
    onComplete: done
  })
}

function onLeave(el, done) {
	gsap.to(el, {
    duration: 0.7,
    scaleX: 1,
    scaleY: 1,
    x: 300,
    ease: 'elastic.inOut(2.5, 1)'
  })
  gsap.to(el, {
    duration: 0.2,
    delay: 0.5,
    opacity: 0,
    onComplete: done
  })
}
</script>

<template>
  <button @click="show = !show">Toggle</button>

  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
    :css="false"
  >
    <div class="gsap-box" v-if="show"></div>
  </Transition>
</template>

<style>
.gsap-box {
  background: #42b883;
  margin-top: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
\`\`\`

#### 可复用过渡效果

得益于 Vue 的组件系统，过渡效果是可以被封装复用的。要创建一个可被复用的过渡，我们需要为 \`<Transition>\` 组件创建一个包装组件，并向内传入插槽内容：

\`\`\`vue
<!-- MyTransition.vue -->
<script>
// JavaScript 钩子逻辑...
</script>

<template>
  <!-- 包装内置的 Transition 组件 -->
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave">
    <slot></slot> <!-- 向内传递插槽内容 -->
  </Transition>
</template>

<style>
/*
  必要的 CSS...
  注意：避免在这里使用 <style scoped>
  因为那不会应用到插槽内容上
*/
</style>
\`\`\`

现在 \`MyTransition\` 可以在导入后像内置组件那样使用：

\`\`\`vue
<MyTransition>
  <div v-if="show">Hello</div>
</MyTransition>
\`\`\`

#### 初次渲染时过渡

如果你想在某个节点初次渲染时应用一个过渡效果，你可以添加 \`appear\` prop：

\`\`\`vue
<Transition appear>
  ...
</Transition>
\`\`\`

#### 元素间过渡

除了通过 \`v-if\` / \`v-show\` 切换一个元素，我们也可以通过 \`v-if\` / \`v-else\` / \`v-else-if\` 在几个组件间进行切换，只要确保任一时刻只会有一个元素被渲染即可：

\`\`\`vue
<script setup>
import { ref } from 'vue'

const docState = ref('saved')
</script>

<template>
	<span style="margin-right: 20px">Click to cycle through states:</span>
  <div class="btn-container">
		<Transition name="slide-up">
      <button v-if="docState === 'saved'"
              @click="docState = 'edited'">Edit</button>
      <button v-else-if="docState === 'edited'"
              @click="docState = 'editing'">Save</button>
      <button v-else-if="docState === 'editing'"
              @click="docState = 'saved'">Cancel</button>
    </Transition>
  </div>
</template>

<style>
.btn-container {
  display: inline-block;
  position: relative;
  height: 1em;
}

button {
  position: absolute;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
\`\`\`

#### 过渡模式

在之前的例子中，进入和离开的元素都是在同时开始动画的，因此我们不得不将它们设为 \`position: absolute\` 以避免二者同时存在时出现的布局问题。

然而，很多情况下这可能并不符合需求。我们可能想要先执行离开动画，然后在其完成**之后**再执行元素的进入动画。手动编排这样的动画是非常复杂的，好在我们可以通过向 \`<Transition>\` 传入一个 \`mode\` prop 来实现这个行为：

\`\`\`vue
<Transition mode="out-in">
  ...
</Transition>
\`\`\`

\`<Transition>\` 也支持 \`mode="in-out"\`，虽然这并不常用。

#### 组件间过渡

\`<Transition>\` 也可以作用于动态组件之间的切换：

\`\`\`vue
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
\`\`\`

#### 动态过渡

\`<Transition>\` 的 props (比如 \`name\`) 也可以是动态的！这让我们可以根据状态变化动态地应用不同类型的过渡：

\`\`\`vue
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
\`\`\`

这个特性的用处是可以提前定义好多组 CSS 过渡或动画的 class，然后在它们之间动态切换。

你也可以根据你的组件的当前状态在 JavaScript 过渡钩子中应用不同的行为。最后，创建动态过渡的终极方式还是创建可复用的过渡组件，并让这些组件根据动态的 props 来改变过渡的效果。

#### 使用 Key Attribute 过渡

有时为了触发过渡，你需要强制重新渲染 DOM 元素。

以计数器组件为例：

\`\`\`vue
<script setup>
import { ref } from 'vue';
const count = ref(0);

setInterval(() => count.value++, 1000);
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
\`\`\`

如果不使用 \`key\` attribute，则只有文本节点会被更新，因此不会发生过渡。但是，有了 \`key\` 属性，Vue 就知道在 \`count\` 改变时创建一个新的 \`span\` 元素，因此 \`Transition\` 组件有两个不同的元素在它们之间进行过渡。



### TransitionGroup

- \`<TransitionGroup>\` 会在一个 \`v-for\` 列表中的元素或组件被插入，移动，或移除时应用动画。

\`<TransitionGroup>\` 是一个内置组件，用于对 \`v-for\` 列表中的元素或组件的插入、移除和顺序改变添加动画效果。

#### 和 \`<Transition>\` 的区别

\`<TransitionGroup>\` 支持和 \`<Transition>\` 基本相同的 props、CSS 过渡 class 和 JavaScript 钩子监听器，但有以下几点区别：

- 默认情况下，它不会渲染一个容器元素。但你可以通过传入 \`tag\` prop 来指定一个元素作为容器元素来渲染。
- 过渡模式在这里不可用，因为我们不再是在互斥的元素之间进行切换。
- 列表中的每个元素都**必须**有一个独一无二的 \`key\` attribute。
- CSS 过渡 class 会被应用在列表内的元素上，**而不是**容器元素上。

#### 进入 / 离开动画

这里是 \`<TransitionGroup>\` 对一个 \`v-for\` 列表添加进入 / 离开动画的示例：

\`\`\`vue
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
\`\`\`

\`\`\`css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
\`\`\`

上面的示例有一些明显的缺陷：当某一项被插入或移除时，它周围的元素会立即发生“跳跃”而不是平稳地移动。我们可以通过添加一些额外的 CSS 规则来解决这个问题：

\`\`\`css
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
\`\`\`

现在它看起来好多了，甚至对整个列表执行洗牌的动画也都非常流畅

完整代码：

\`\`\`vue
<!--
通过内建的 <TransitionGroup> 实现“FLIP”列表过渡效果。
https://aerotwist.com/blog/flip-your-animations/
-->

<script setup>
import { shuffle as _shuffle } from 'lodash-es'
import { ref } from 'vue'

const getInitialItems = () => [1, 2, 3, 4, 5]
const items = ref(getInitialItems())
let id = items.value.length + 1

function insert() {
  const i = Math.round(Math.random() * items.value.length)
  items.value.splice(i, 0, id++)
}

function reset() {
  items.value = getInitialItems()
  id = items.value.length + 1
}

function shuffle() {
  items.value = _shuffle(items.value)
}

function remove(item) {
  const i = items.value.indexOf(item)
  if (i > -1) {
    items.value.splice(i, 1)
  }
}
</script>

<template>
  <button @click="insert">Insert at random index</button>
  <button @click="reset">Reset</button>
  <button @click="shuffle">Shuffle</button>

  <TransitionGroup tag="ul" name="fade" class="container">
    <li v-for="item in items" class="item" :key="item">
      {{ item }}
      <button @click="remove(item)">x</button>
    </li>
  </TransitionGroup>
</template>

<style>
.container {
  position: relative;
  padding: 0;
  list-style-type: none;
}

.item {
  width: 100%;
  height: 30px;
  background-color: #f3f3f3;
  border: 1px solid #666;
  box-sizing: border-box;
}

/* 1. 声明过渡效果 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. 声明进入和离开的状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
.fade-leave-active {
  position: absolute;
}
</style>
\`\`\`

#### 渐进延迟列表动画

通过在 JavaScript 钩子中读取元素的 data attribute，我们可以实现带渐进延迟的列表动画。首先，我们把每一个元素的索引渲染为该元素上的一个 data attribute：

\`\`\`vue
<TransitionGroup
  tag="ul"
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <li
    v-for="(item, index) in computedList"
    :key="item.msg"
    :data-index="index"
  >
    {{ item.msg }}
  </li>
</TransitionGroup>
\`\`\`

接着，在 JavaScript 钩子中，我们基于当前元素的 data attribute 对该元素的进场动画添加一个延迟。以下是一个基于 [GSAP library](https://gsap.com/) 的动画示例：

\`\`\`js
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
\`\`\`

完整：

\`\`\`vue
<script setup>
import { ref, computed } from 'vue'
import gsap from 'gsap'

const list = [
  { msg: 'Bruce Lee' },
  { msg: 'Jackie Chan' },
  { msg: 'Chuck Norris' },
  { msg: 'Jet Li' },
  { msg: 'Kung Fury' }
]

const query = ref('')

const computedList = computed(() => {
  return list.filter((item) => item.msg.toLowerCase().includes(query.value))
})

function onBeforeEnter(el) {
  el.style.opacity = 0
  el.style.height = 0
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
</script>

<template>
  <input v-model="query" />
  <TransitionGroup
    tag="ul"
    :css="false"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
  >
    <li
      v-for="(item, index) in computedList"
      :key="item.msg"
      :data-index="index"
    >
      {{ item.msg }}
    </li>
  </TransitionGroup>
</template>
\`\`\`



### KeepAlive

#### 基本使用

默认情况下，一个组件实例在被替换掉后会被销毁。这会导致它丢失其中所有已变化的状态——当这个组件再一次被显示时，会创建一个只带有初始状态的新实例。

在切换时创建新的组件实例通常是有意义的，但在这个例子中，我们的确想要组件能在被“切走”的时候保留它们的状态。要解决这个问题，我们可以用 \`<KeepAlive>\` 内置组件将这些动态组件包装起来：

\`\`\`vue
<!-- 非活跃的组件将会被缓存！ -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
\`\`\`

现在，在组件切换时状态也能被保留了。

#### 包含/排除

\`<KeepAlive>\` 默认会缓存内部的所有组件实例，但我们可以通过 \`include\` 和 \`exclude\` prop 来定制该行为。这两个 prop 的值都可以是一个以英文逗号分隔的字符串、一个正则表达式，或是包含这两种类型的一个数组：

\`\`\`vue
<!-- 以英文逗号分隔的字符串 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正则表达式 (需使用 \`v-bind\`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 数组 (需使用 \`v-bind\`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
\`\`\`

它会根据组件的 \`name\` 选项进行匹配，所以组件如果想要条件性地被 \`KeepAlive\` 缓存，就必须显式声明一个 \`name\` 选项。

在 3.2.34 或以上的版本中，使用 \`<script setup>\` 的单文件组件会自动根据文件名生成对应的 \`name\` 选项，无需再手动声明。

#### 最大缓存实例数

我们可以通过传入 \`max\` prop 来限制可被缓存的最大组件实例数。\`<KeepAlive>\` 的行为在指定了 \`max\` 后类似一个 [LRU 缓存](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU))：如果缓存的实例数量即将超过指定的那个最大数量，则最久没有被访问的缓存实例将被销毁，以便为新的实例腾出空间。

\`\`\`vue
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
\`\`\`

#### 缓存实例的生命周期

当一个组件实例从 DOM 上移除但因为被 \`<KeepAlive>\` 缓存而仍作为组件树的一部分时，它将变为**不活跃**状态而不是被卸载。当一个组件实例作为缓存树的一部分插入到 DOM 中时，它将重新**被激活**。

一个持续存在的组件可以通过 [\`onActivated()\`](https://cn.vuejs.org/api/composition-api-lifecycle.html#onactivated) 和 [\`onDeactivated()\`](https://cn.vuejs.org/api/composition-api-lifecycle.html#ondeactivated) 注册相应的两个状态的生命周期钩子：

\`\`\`vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
})

onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
})
</script>
\`\`\`

请注意：

- \`onActivated\` 在组件挂载时也会调用，并且 \`onDeactivated\` 在组件卸载时也会调用。
- 这两个钩子不仅适用于 \`<KeepAlive>\` 缓存的根组件，也适用于缓存树中的后代组件。



### Teleport

\`<Teleport>\` 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。

#### 基本用法

有时我们可能会遇到这样的场景：一个组件模板的一部分在逻辑上从属于该组件，但从整个应用视图的角度来看，它在 DOM 中应该被渲染在整个 Vue 应用外部的其他地方。

这类场景最常见的例子就是全屏的模态框。理想情况下，我们希望触发模态框的按钮和模态框本身是在同一个组件中，因为它们都与组件的开关状态有关。但这意味着该模态框将与按钮一起渲染在应用 DOM 结构里很深的地方。这会导致该模态框的 CSS 布局代码很难写。

\`<Teleport>\` 提供了一个更简单的方式来解决此类问题，让我们不需要再顾虑 DOM 结构的问题。

\`<Teleport>\` 接收一个 \`to\` prop 来指定传送的目标。\`to\` 的值可以是一个 CSS 选择器字符串，也可以是一个 DOM 元素对象。

> 试想下面这样的 HTML 结构：
>
> \`\`\`vue
> <div class="outer">
>   <h3>Tooltips with Vue 3 Teleport</h3>
>   <div>
>     <MyModal />
>   </div>
> </div>
> \`\`\`
>
>  \`<MyModal>\` 的实现：
>
> \`\`\`vue
> <script setup>
> import { ref } from 'vue'
> 
> const open = ref(false)
> </script>
> 
> <template>
>   <button @click="open = true">Open Modal</button>
> 
>   <div v-if="open" class="modal">
>     <p>Hello from the modal!</p>
>     <button @click="open = false">Close</button>
>   </div>
> </template>
> 
> <style scoped>
> .modal {
>   position: fixed;
>   z-index: 999;
>   top: 20%;
>   left: 50%;
>   width: 300px;
>   margin-left: -150px;
> }
> </style>
> \`\`\`
>
> 这个组件中有一个 \`<button>\` 按钮来触发打开模态框，和一个 class 名为 \`.modal\` 的 \`<div>\`，它包含了模态框的内容和一个用来关闭的按钮。
>
> 当在初始 HTML 结构中使用这个组件时，会有一些潜在的问题：
>
> - \`position: fixed\` 能够相对于浏览器窗口放置有一个条件，那就是不能有任何祖先元素设置了 \`transform\`、\`perspective\` 或者 \`filter\` 样式属性。也就是说如果我们想要用 CSS \`transform\` 为祖先节点 \`<div class="outer">\` 设置动画，就会不小心破坏模态框的布局！
> - 这个模态框的 \`z-index\` 受限于它的容器元素。如果有其他元素与 \`<div class="outer">\` 重叠并有更高的 \`z-index\`，则它会覆盖住我们的模态框。
>
> 让我们用 \`<Teleport>\` 改写一下 \`<MyModal>\`：
>
> \`\`\`vue
> <button @click="open = true">Open Modal</button>
> 
> <Teleport to="body">
>   <div v-if="open" class="modal">
>     <p>Hello from the modal!</p>
>     <button @click="open = false">Close</button>
>   </div>
> </Teleport>
> \`\`\`
>
> 这段代码的作用就是告诉 Vue“把以下模板片段**传送到 \`body\`** 标签下”。
>
> 我们也可以将 \`<Teleport>\` 和 [\`\`](https://cn.vuejs.org/guide/built-ins/transition.html) 结合使用来创建一个带动画的模态框。可以看看：[示例](https://cn.vuejs.org/examples/#modal)。

#### 搭配组件使用

\`<Teleport>\` 只改变了渲染的 DOM 结构，它不会影响组件间的逻辑关系。也就是说，如果 \`<Teleport>\` 包含了一个组件，那么该组件始终和这个使用了 \`<Teleport>\` 的组件保持逻辑上的父子关系。传入的 props 和触发的事件也会照常工作。

这也意味着来自父组件的注入也会按预期工作，子组件将在 Vue Devtools 中嵌套在父级组件下面，而不是放在实际内容移动到的地方。

#### 禁用 Teleport

在某些场景下可能需要视情况禁用 \`<Teleport>\`。举例来说，我们想要在桌面端将一个组件当做浮层来渲染，但在移动端则当作行内组件。我们可以通过对 \`<Teleport>\` 动态地传入一个 \`disabled\` prop 来处理这两种不同情况。

\`\`\`vue
<Teleport :disabled="isMobile">
  ...
</Teleport>
\`\`\`

这里的 \`isMobile\` 状态可以根据 CSS media query 的不同结果动态地更新。

#### 多个 Teleport 共享目标

一个可重用的模态框组件可能同时存在多个实例。对于此类场景，多个 \`<Teleport>\` 组件可以将其内容挂载在同一个目标元素上，而顺序就是简单的顺次追加，后挂载的将排在目标元素下更后面的位置上。

比如下面这样的用例：

\`\`\`html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
\`\`\`

渲染的结果为：

\`\`\`html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
\`\`\`

#### 延迟解析的 Teleport

在 Vue 3.5 及更高版本中，我们可以使用 \`defer\` prop 推迟 Teleport 的目标解析，直到应用的其他部分挂载。这允许 Teleport 将由 Vue 渲染且位于组件树之后部分的容器元素作为目标：

\`\`\`vue
<Teleport defer to="#late-div">...</Teleport>

<!-- 稍后出现于模板中的某处 -->
<div id="late-div"></div>
\`\`\`

请注意，目标元素必须与 Teleport 在同一个挂载/更新周期内渲染，即如果 \`<div>\` 在一秒后才挂载，Teleport 仍然会报错。延迟 Teleport 的原理与 \`mounted\` 生命周期钩子类似。



### Suspense

\`<Suspense>\` 是一个内置组件，用来在组件树中协调对异步依赖的处理。它让我们可以在组件树上层等待下层的多个嵌套异步依赖项解析完成，并可以在等待时渲染一个加载状态。

#### 异步依赖

在这个组件树中可能有多个嵌套组件，要渲染出它们，首先得解析一些异步资源。如果没有 \`<Suspense>\`，则它们每个都需要处理自己的加载、报错和完成状态。在最坏的情况下，我们可能会在页面上看到三个旋转的加载态，在不同的时间显示出内容。

有了 \`<Suspense>\` 组件后，我们就可以在等待整个多层级组件树中的各个异步依赖获取结果时，在顶层展示出加载中或加载失败的状态。

\`<Suspense>\` 可以等待的异步依赖有两种：

1. 带有异步 \`setup()\` 钩子的组件。这也包含了使用 \`<script setup>\` 时有顶层 \`await\` 表达式的组件。
2. 异步组件。

##### async setup()

组合式 API 中组件的 \`setup()\` 钩子可以是异步的：

\`\`\`js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
\`\`\`

如果使用 \`<script setup>\`，那么顶层 \`await\` 表达式会自动让该组件成为一个异步依赖：

\`\`\`vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
\`\`\`

##### 异步组件

异步组件默认就是**“suspensible”**的。这意味着如果组件关系链上有一个 \`<Suspense>\`，那么这个异步组件就会被当作这个 \`<Suspense>\` 的一个异步依赖。在这种情况下，加载状态是由 \`<Suspense>\` 控制，而该组件自己的加载、报错、延时和超时等选项都将被忽略。

异步组件也可以通过在选项中指定 \`suspensible: false\` 表明不用 \`Suspense\` 控制，并让组件始终自己控制其加载状态。

#### 加载中状态

\`<Suspense>\` 组件有两个插槽：\`#default\` 和 \`#fallback\`。两个插槽都只允许**一个**直接子节点。在可能的时候都将显示默认插槽中的节点。否则将显示后备插槽中的节点。

\`\`\`vue
<Suspense>
  <!-- 具有深层异步依赖的组件 -->
  <Dashboard />

  <!-- 在 #fallback 插槽中显示 “正在加载中” -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
\`\`\`

在初始渲染时，\`<Suspense>\` 将在内存中渲染其默认的插槽内容。如果在这个过程中遇到任何异步依赖，则会进入**挂起**状态。在挂起状态期间，展示的是后备内容。当所有遇到的异步依赖都完成后，\`<Suspense>\` 会进入**完成**状态，并将展示出默认插槽的内容。

如果在初次渲染时没有遇到异步依赖，\`<Suspense>\` 会直接进入完成状态。

进入完成状态后，只有当默认插槽的根节点被替换时，\`<Suspense>\` 才会回到挂起状态。组件树中新的更深层次的异步依赖**不会**造成 \`<Suspense>\` 回退到挂起状态。

发生回退时，后备内容不会立即展示出来。相反，\`<Suspense>\` 在等待新内容和异步依赖完成时，会展示之前 \`#default\` 插槽的内容。这个行为可以通过一个 \`timeout\` prop 进行配置：在等待渲染新内容耗时超过 \`timeout\` 之后，\`<Suspense>\` 将会切换为展示后备内容。若 \`timeout\` 值为 \`0\` 将导致在替换默认内容时立即显示后备内容。

#### 事件

\`<Suspense>\` 组件会触发三个事件：\`pending\`、\`resolve\` 和 \`fallback\`。\`pending\` 事件是在进入挂起状态时触发。\`resolve\` 事件是在 \`default\` 插槽完成获取新内容时触发。\`fallback\` 事件则是在 \`fallback\` 插槽的内容显示时触发。

例如，可以使用这些事件在加载新组件时在之前的 DOM 最上层显示一个加载指示器。

#### 错误处理

\`<Suspense>\` 组件自身目前还不提供错误处理，不过你可以使用 [\`errorCaptured\`](https://cn.vuejs.org/api/options-lifecycle.html#errorcaptured) 选项或者 [\`onErrorCaptured()\`](https://cn.vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured) 钩子，在使用到 \`<Suspense>\` 的父组件中捕获和处理异步错误。

#### 和其他组件结合

将 \`<Suspense>\` 和 \`<Transition>\`、\`<KeepAlive>\` 等组件结合。要保证这些组件都能正常工作，嵌套的顺序非常重要。

另外，这些组件都通常与 Vue Router 中的 \`<RouterView>\` 组件结合使用。

下面的示例展示了如何嵌套这些组件，使它们都能按照预期的方式运：

\`\`\`vue
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- 主要内容 -->
          <component :is="Component"></component>

          <!-- 加载中状态 -->
          <template #fallback>
            正在加载...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
\`\`\`

Vue Router 使用动态导入对**懒加载组件**进行了内置支持。这些与异步组件不同，目前他们不会触发 \`<Suspense>\`。但是，它们仍然可以有异步组件作为后代，这些组件可以照常触发 \`<Suspense>\`。

#### 嵌套使用

当我们有多个类似于下方的异步组件 (常见于嵌套或基于布局的路由) 时：

\`\`\`vue
<Suspense>
  <component :is="DynamicAsyncOuter">
    <component :is="DynamicAsyncInner" />
  </component>
</Suspense>
\`\`\`

\`<Suspense>\` 创建了一个边界，它将如预期的那样解析树下的所有异步组件。然而，当我们更改 \`DynamicAsyncOuter\` 时，\`<Suspense>\` 会正确地等待它，但当我们更改 \`DynamicAsyncInner\` 时，嵌套的 \`DynamicAsyncInner\` 会呈现为一个空节点，直到它被解析为止 (而不是之前的节点或回退插槽)。

为了解决这个问题，我们可以使用嵌套的方法来处理嵌套组件的补丁，就像这样：

\`\`\`vue
<Suspense>
  <component :is="DynamicAsyncOuter">
    <Suspense suspensible> <!-- 像这样 -->
      <component :is="DynamicAsyncInner" />
    </Suspense>
  </component>
</Suspense>
\`\`\`

如果你不设置 \`suspensible\` 属性，内部的 \`<Suspense>\` 将被父级 \`<Suspense>\` 视为同步组件。这意味着它将会有自己的回退插槽，如果两个 \`Dynamic\` 组件同时被修改，则当子 \`<Suspense>\` 加载其自己的依赖关系树时，可能会出现空节点和多个修补周期，这可能不是理想情况。设置后，所有异步依赖项处理都会交给父级 \`<Suspense>\` (包括发出的事件)，而内部 \`<Suspense>\` 仅充当依赖项解析和修补的另一个边界。



## 其它重要 API

### toRaw 与 markRaw

#### toRaw

1. **作用**：用于获取一个响应式对象的原始对象， \`toRaw\` 返回的对象不再是响应式的，不会触发视图更新。

   1. 官网描述：这是一个可以用于临时读取而不引起代理访问/跟踪开销，或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，请谨慎使用。

   2. 何时使用？ —— 在需要将响应式对象传递给非 \`Vue\` 的库或外部系统时，使用 \`toRaw\` 可以确保它们收到的是普通对象

2. **具体编码**：

   \`\`\`js
   import { reactive,toRaw,markRaw,isReactive } from "vue";
   
   /* toRaw */
   // 响应式对象
   let person = reactive({name:'tony',age:18})
   // 原始对象
   let rawPerson = toRaw(person)
   
   
   /* markRaw */
   let citysd = markRaw([
     {id:'asdda01',name:'北京'},
     {id:'asdda02',name:'上海'},
     {id:'asdda03',name:'天津'},
     {id:'asdda04',name:'重庆'}
   ])
   // 根据原始对象citys去创建响应式对象citys2 —— 创建失败，因为citys被markRaw标记了
   let citys2 = reactive(citys)
   console.log(isReactive(person))
   console.log(isReactive(rawPerson))
   console.log(isReactive(citys))
   console.log(isReactive(citys2))
   \`\`\`

#### markRaw

1. 作用：标记一个对象，使其**永远不会**变成响应式的。

   > 例如使用\`mockjs\`时，为了防止误把\`mockjs\`变为响应式对象，可以使用 \`markRaw\` 去标记\`mockjs\`

2. 编码：

   \`\`\`js
   /* markRaw */
   let citys = markRaw([
     {id:'asdda01',name:'北京'},
     {id:'asdda02',name:'上海'},
     {id:'asdda03',name:'天津'},
     {id:'asdda04',name:'重庆'}
   ])
   // 根据原始对象citys去创建响应式对象citys2 —— 创建失败，因为citys被markRaw标记了
   let citys2 = reactive(citys)
   \`\`\`



### customRef 自定义响应式

\`customRef\` 是 Vue 3 中提供的一个高级 API，用于创建自定义的 \`ref\`，允许开发者对依赖项的跟踪和更新触发进行精细控制。它特别适用于需要对数据变化进行细粒度控制的场景，例如防抖和节流效果。

#### 基本语法

\`customRef\` 的基本语法如下：

\`\`\`typescript
const myRef = customRef((track, trigger) => {
  return {
    get() {
      // ...
    },
    set(newValue) {
      // ...
    }
  };
});
\`\`\`

\`customRef\` 接受一个回调函数作为参数，该回调函数接收两个参数：

- \`track\`: 用于告诉 Vue 需要跟踪该 \`ref\` 的依赖。
- \`trigger\`: 用于通知 Vue 该 \`ref\` 的值发生了变化。

#### \`get\` 和 \`set\` 方法

- \`get\` 方法：在访问 \`ref\` 的值时调用，用于告诉 Vue 需要跟踪该值。
- \`set\` 方法：在设置 \`ref\` 的值时调用，用于通知 Vue 该值发生了变化，并执行自定义的更新逻辑。

#### 示例：实现防抖效果

下面是一个使用 \`customRef\` 实现防抖效果的示例。防抖的意思是在某个操作完成后等待一段时间再执行，这在处理频繁的用户输入时非常有用。

自定义 \`ref\` 实现防抖hook（\`useDebouncedRef.ts\`）：

\`\`\`typescript
import { customRef } from "vue";

export default function useDebouncedRef(initValue: string, delay: number) {
  return customRef((track, trigger) => {
    let timer: number;
    let value = initValue;

    return {
      get() {
        track(); // 告诉 Vue 跟踪这个 ref 的依赖
        return value;
      },
      set(newValue) {
        clearTimeout(timer); // 清除之前的定时器
        timer = setTimeout(() => {
          value = newValue; // 更新值
          trigger(); // 通知 Vue 这个 ref 的值发生了变化
        }, delay); // 设置新的定时器
      }
    };
  });
}
\`\`\`

在 Vue 组件中使用这个自定义的防抖 \`ref\`：

\`\`\`vue
<template>
  <div>
    <input v-model="msg" placeholder="Type something...">
    <p>Debounced Message: {{ msg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useDebouncedRef from './useDebouncedRef';

const { msg } = useDebouncedRef('Hello', 1000); // 初始化值为 'Hello'，防抖延迟为 1000 毫秒
</script>
\`\`\`

**详细解释**

1. **\`useDebouncedRef\` 函数**：
   - 接收两个参数：\`initValue\`（初始值）和 \`delay\`（延迟时间，以毫秒为单位）。
   - 返回一个使用 \`customRef\` 创建的自定义 \`ref\`。
2. **\`customRef\` 回调函数**：
   - 接收两个参数：\`track\` 和 \`trigger\`。
   - 定义 \`get\` 和 \`set\` 方法。
3. **\`get\` 方法**：
   - 调用 \`track()\`，告诉 Vue 这个 \`ref\` 的值需要被依赖跟踪。
   - 返回当前的值。
4. **\`set\` 方法**：
   - 清除之前的定时器，以确保只有最后一次输入在延迟时间后被处理。
   - 设置一个新的定时器，在延迟时间到期后更新 \`value\` 并调用 \`trigger()\` 通知 Vue 值发生了变化。
5. **组件中的使用**：
   - 在组件中，使用 \`v-model\` 双向绑定到 \`msg\`。
   - 输入框中的值会通过防抖机制进行处理，只有在用户停止输入超过指定的延迟时间后，才会更新 \`msg\` 的值并重新渲染视图。

### 全局API转移到应用对象

- \`app.component\`
- \`app.config\`
- \`app.directive\`
- \`app.mount\`
- \`app.unmount\`
- \`app.use\`

### 观看官网的“从vue2迁移”了解区别

`

export default textstring;