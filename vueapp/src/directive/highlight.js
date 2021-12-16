import hljs from 'highlight.js';
// 使用方式
// <pre v-highlight class="highlight">
//     <code class="javascript">{{ code }} </code>
// </pre>

const highlight = {
    beforeMount(el, binding) {
        const targets = el.querySelectorAll('code')
        targets.forEach((target) => {
            if (binding.value) {
                target.textContent = binding.value;
            }
            hljs.highlightBlock(target);
        })
    },
    beforeUpdate(el, binding) {
        const targets = el.querySelectorAll('code')
        targets.forEach((target) => {
            if (binding.value) {
                target.textContent = binding.value;
            }
            hljs.highlightBlock(target);
        })
    }
}

export default highlight;