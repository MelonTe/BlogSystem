import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { figure } from "@mdit/plugin-figure";

const md = new MarkdownIt({
  html: true, // 允许渲染 HTML 标签
  linkify: true, // 自动识别链接
  typographer: true, // 启用一些语言学的替换和格式
  breaks: true,
  highlight: function (str: string, lang: string | undefined): string {
    // 添加返回类型和参数类型注解
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="markdown"><code class="hljs markdown">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }

    return (
      '<pre class="markdown"><code class="hljs markdown">' +
      md.utils.escapeHtml(str) +
      "</code></pre>"
    );
  },
});

// 使用插件
md.use(figure);

// 给渲染的html标签加上名为markdown的class，因为无法在vue页面内用scoped渲染，所以用这个方法。
function MdRenderRule(className: string) {
  const addMarkdownClass = (originalRule: any) => {
    return (tokens: any, idx: any, options: any, env: any, self: any) => {
      const token = tokens[idx];
      token.attrJoin("class", className);
      if (originalRule) {
        return originalRule(tokens, idx, options, env, self);
      } else {
        return self.renderToken(tokens, idx, options);
      }
    };
  };
  const tags = [
    "heading_open",
    "paragraph_open",
    "blockquote_open",
    "list_item_open",
    "bullet_list_open",
    "ordered_list_open",
    "code_block",
    "fence",
    "table_open",
    "tr_open",
    "th_open",
    "td_open",
    "hr",
    "em_open",
    "strong_open",
    "del_open",
    "link_open",
    "image",
    "html_block",
    "html_inline",
    "code_inline",
  ];
  tags.forEach((tag) => {
    md.renderer.rules[tag] = addMarkdownClass(md.renderer.rules[tag]);
  });
}

// 图片路径 URL 编码工具函数
function encodeImagePaths(markdown: string): string {
  return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    const encodedSrc = encodeURI(src); // 对图片路径进行 URL 编码
    return `![${alt}](${encodedSrc})`;
  });
}

/**
 * 将markdown文本渲染为html
 * @param markdown 需要渲染的文本
 * @param className 为渲染的标签添加上class，方便操作
 * @returns 渲染完成的文本(使用v-html应用)
 */
export function MdRender(markdown: string, className: string = "") {
  MdRenderRule(className);
  const blogContent = encodeImagePaths(markdown);
  return md.render(blogContent);
}
