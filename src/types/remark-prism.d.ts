// types/remark-prism.d.ts

declare module 'remark-prism' {
    import { Plugin } from 'unified';
  
    interface Options {
      /**
       * Enable syntax highlighting for inline code as well as code blocks.
       * @default false
       */
      inlineCode?: boolean;
  
      /**
       * Show line numbers next to the code blocks.
       * @default false
       */
      showLineNumbers?: boolean;
  
      /**
       * Add a CSS class to code blocks.
       */
      plugins?: string[];
    }
  
    const remarkPrism: Plugin<[Options?]>;
    export default remarkPrism;
  }