import { onMounted, ref } from 'vue';

const rightbar = ref<HTMLElement | null>(null);
let fixposition: number = 0;
let fixactive: boolean = false;
let target: HTMLElement | null = null;

const onBarScroll = () => {
    // 使用 requestAnimationFrame 优化滚动性能
    requestAnimationFrame(() => {
        if (!target) return;

        const rect = target.children[1].getBoundingClientRect();
        const scrollY = window.scrollY;

        if (rect.bottom < 0 && !fixactive) {
            fixactive = true;
            fixposition = rect.bottom + scrollY;
            target.style.transform = `translateY(-${fixposition / window.innerHeight * 100}vh)`;
            target.style.position = "fixed";
        } else if (scrollY < fixposition && fixactive) {
            fixactive = false;
            target.style.transform = "";
            target.style.position = "";
        }
    });
}

onMounted(() => {
    if (rightbar.value) {
        target = rightbar.value.children[0] as HTMLElement;
        document.addEventListener("scroll", onBarScroll);
    }
})