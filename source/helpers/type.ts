import {LoremIpsum} from 'lorem-ipsum';
import stripIndent from 'strip-indent';
import truncate from 'truncate-html';
import {typogrify} from 'typogr';

import {markdownEngine} from './engines';

const lorem = new LoremIpsum();

/**
 * Returns block of generated `lorem ipsum` text.
 *
 * @see https://github.com/knicklabs/lorem-ipsum.js
 */
export const getLorem = (type: string, number = 1) => {
  switch (type) {
    case 'sentence':
    case 'sentences':
      return lorem.generateSentences(number);
    case 'paragraph':
    case 'paragraphs':
      return lorem.generateParagraphs(number);
    case 'word':
    case 'words':
      return lorem.generateWords(number);
  }
  return '';
};

/**
 * Truncates an HTML string without breaking tags.
 *
 * @see https://github.com/oe/truncate-html
 */
export const truncateHTML = (html: string, words = 170) =>
  truncate(html, words, {byWords: true, keepWhitespaces: true});

/**
 * Renders block of Markdown into HTML.
 */
export const markdown = (content: string) =>
  markdownEngine.render(stripIndent(content));

/**
 * Renders single line of Markdown into HTML, without wrapping `<p>`.
 */
export const markdownInline = (content: string) =>
  markdownEngine.renderInline(content);

/**
 * Applies various transformations to plain text in order to yield
 * typographically-improved HTML.
 *
 * @see https://github.com/ekalinin/typogr.js
 */
export const typogr = (content: string) => typogrify(content);

/**
 * Appends full page URL to internal links (for embedding in another page).
 */
export const replaceInternalLinks = (content: string, url: string) =>
  content.replace(/href="#/g, `href="${url}#`);

/**
 * Checks if a given string starts with a comparison string.
 */
export const startsWith = (str: string, check: string) => str.startsWith(check);

/**
 * Strips leading whitespace from each line in a string.
 *
 * @see https://github.com/sindresorhus/strip-indent
 */
export const stripInd = (str: string) => stripIndent(str);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function typePlugin(eleventyConfig: any) {
  // filters...
  eleventyConfig.addLiquidFilter('truncateHTML', truncateHTML);
  eleventyConfig.addLiquidFilter('markdown', markdown);
  eleventyConfig.addLiquidFilter('markdownInline', markdownInline);
  eleventyConfig.addLiquidFilter('typogr', typogr);
  eleventyConfig.addLiquidFilter('replaceInternalLinks', replaceInternalLinks);
  eleventyConfig.addLiquidFilter('startsWith', startsWith);
  eleventyConfig.addLiquidFilter('stripIndent', stripInd);

  // shortcodes...
  eleventyConfig.addLiquidShortcode('lorem', getLorem);

  // paired shortcodes...
  eleventyConfig.addPairedLiquidShortcode('markdown', markdown);
  eleventyConfig.addPairedLiquidShortcode('typogr', typogr);
  eleventyConfig.addPairedLiquidShortcode('stripIndent', stripInd);
}
