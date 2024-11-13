<template>
  <div class="article">
    <div class="markdown-body" v-html="renderedText"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import textstring from '@/hooks/content';
import '@/assets/markdown.css'

const md = new MarkdownIt({
  html: true,  // 允许渲染 HTML 标签
  linkify: true, // 自动识别链接
  typographer: true, // 启用一些语言学的替换和格式
  breaks: true,
  highlight: function (str: string, lang: string | undefined): string {  // 添加返回类型和参数类型注解
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="markdown"><code class="hljs markdown">' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="markdown"><code class="hljs markdown">' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

// 给渲染的html标签加上名为markdown的class，因为无法在vue页面内用scoped渲染，所以用这个方法。
const addMarkdownClass = (originalRule:any) => {
  return (tokens:any, idx:any, options:any, env:any, self:any) => {
    const token = tokens[idx];
    token.attrJoin('class', 'markdown');
    if (originalRule) {
      return originalRule(tokens, idx, options, env, self);
    } else {
      return self.renderToken(tokens, idx, options);
    }
  };
};
const tags = [
  'heading_open', 'paragraph_open', 'blockquote_open', 'list_item_open',
  'bullet_list_open', 'ordered_list_open', 'code_block', 'fence', 'table_open',
  'tr_open', 'th_open', 'td_open', 'hr', 'em_open', 'strong_open', 'del_open',
  'link_open', 'image', 'html_block', 'html_inline', 'code_inline'
];
tags.forEach(tag => {
  md.renderer.rules[tag] = addMarkdownClass(md.renderer.rules[tag]);
});


// markdown字符串渲染成html
const text = ref(textstring);
const renderedText = ref(md.render(text.value));
</script>

<style scoped>
.article {
  background-color: #ffffff;
  padding: 10px;
  margin: 0;
  border: 1px solid #0c00002a;
  border-radius: 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>