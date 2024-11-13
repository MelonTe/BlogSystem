import { nextTick } from "vue";
import type { Ref } from "vue";

/**
 * 动态高度：
 * 1.添加删除子元素的时候没法触发css transition来自动平滑height。
 * 2.可以在切换组件的时候平滑适应父元素大小。
 * @param containers 输入ref包裹的html元素。
 * @returns 返回一个执行即可动态适应对应元素的函数，可以放在onUpdate和onMount。
 */
function dynamicHeight(delay:number,...containers: Ref<HTMLElement | null>[]) {
  // 标记是否已经为容器添加了 transition 样式
  let initialized = false;

  const adjustHeight = (container: HTMLElement | null) => {
    if (container) {
      let topMost = Number.POSITIVE_INFINITY;
      let bottomMost = Number.NEGATIVE_INFINITY;

      const children = Array.from(container.children);

      children.forEach((child) => {
        const rect = (child as HTMLElement).getBoundingClientRect();

        // 获取当前子元素的上下margin
        const style = window.getComputedStyle(child as HTMLElement);
        const marginTop = parseFloat(style.marginTop);
        const marginBottom = parseFloat(style.marginBottom);

        const childTop = rect.top - marginTop; // 计算时减去子元素上方的margin
        const childBottom = rect.bottom + marginBottom; // 计算时加上子元素下方的margin

        topMost = Math.min(topMost, childTop);
        bottomMost = Math.max(bottomMost, childBottom);
      });

      const totalHeight = bottomMost - topMost;
      const heightInVh = (totalHeight / window.innerHeight) * 100;
      container.style.height = `${heightInVh}vh`;
    }
  };

  const delayAdjustHeight = async () => {
    await nextTick();
    setTimeout(() => {
      containers.forEach((container) => adjustHeight(container.value));
    }, delay);
  };

  return () => {
    if (!initialized) {
      containers.forEach((container) => {
        if (container.value)
          container.value.style.transition = "height 0.5s ease";
        initialized = true;
      });
    }
    delayAdjustHeight();
  };
}

export default dynamicHeight;
