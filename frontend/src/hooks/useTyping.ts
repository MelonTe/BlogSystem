import { ref } from 'vue';

let myWords: string = ""; // 定义为字符串类型
let i: number = 0;
let typingDirection: number = 0;
let lastTime = 0;  // 用于计算时间差
const frameDelay = 100; // 最小检测时间，优化性能
const typingInterval = 150; // 打字间隔，单位：毫秒
const deleteInterval = 100; // 删除间隔，单位：毫秒
const switchInterval = 3000; // 切换间隔，单位：毫秒
const resetInterval = 1000; // 重置间隔，单位：毫秒

export function useTypingEffect(fetchData: () => void) {
    const typingWords = ref<string>("");

    const typing = (timestamp: DOMHighResTimeStamp) => {
        let deltaTime = timestamp - lastTime;
        if (deltaTime < frameDelay) {
            requestAnimationFrame(typing);
            return;
        }
        // 打字
        if (i <= myWords.length && typingDirection === 0 && deltaTime > typingInterval) {
            typingWords.value = myWords.slice(0, i++);
            lastTime = timestamp;
        }
        // 删除
        else if (i >= 0 && typingDirection === 1 && deltaTime > deleteInterval) {
            typingWords.value = myWords.slice(0, i--);
            lastTime = timestamp;
        }
        // 完成打字
        else if (i > myWords.length && deltaTime > switchInterval) {
            typingDirection = 1;
            lastTime = timestamp;
        }
        // 完成删除
        else if (i < 0 && deltaTime > resetInterval) {
            i = 0;
            typingDirection = 0; // 切回打字状态
            fetchData(); // 执行获取数据的操作
            lastTime = timestamp;
        }
        requestAnimationFrame(typing);
    }

    const startTyping = () => {
        // 启动打字机效果
        lastTime = performance.now();
        requestAnimationFrame(typing);
    };

    return { typingWords, startTyping };
}

export function setTypingWords(newWords: string) {
    myWords = newWords;
}
