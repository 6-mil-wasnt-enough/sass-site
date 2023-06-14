import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const playgroundHighlightStyle = HighlightStyle.define([
  {
    tag: [tags.special(tags.variableName), tags.tagName],
    color: '#445588',
    fontWeight: '600',
  },
  { tag: tags.definitionKeyword, fontWeight: '600' },
  { tag: tags.comment, color: '#006666', fontStyle: 'italic' },
  { tag: tags.propertyName, color: '#990000' },
]);

export { playgroundHighlightStyle };
