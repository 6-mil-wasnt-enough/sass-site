---
title: "Breaking Change: CSS Variable Syntax"
introduction: >
  Older versions of LibSass and Ruby Sass parsed custom property declarations
  just like any other property declaration, allowing the full range of
  [SassScript expressions](/documentation/syntax/structure#expressions) as values. But this
  wasn't compatible with CSS.
---

{% compatibility true, '3.5.0', null, '3.5.0' %}{% endcompatibility %}

The CSS spec allows almost any string of characters to be used in a custom
property declaration. Even though these values might not be meaningful for any
CSS property, they could be accessed from JavaScript. When they were parsed as
SassScript values, syntax that would have been valid plain CSS failed to parse.
For example, the [Polymer library][] used this to support plain-CSS mixins:

[Polymer library]: https://polymer-library.polymer-project.org/3.0/docs/devguide/custom-css-properties#use-custom-css-mixins

{% codeExample 1, true, 'scss' %}
:root {
  --flex-theme: {
    border: 1px solid var(--theme-dark-blue);
    font-family: var(--theme-font-family);
    padding: var(--theme-wide-padding);
    background-color: var(--theme-light-blue);
  };
}
===
:root {
  --flex-theme: {
    border: 1px solid var(--theme-dark-blue);
    font-family: var(--theme-font-family);
    padding: var(--theme-wide-padding);
    background-color: var(--theme-light-blue);
  };
}
{% endcodeExample %}

To provide maximum compatibility with plain CSS, more recent versions of Sass
require SassScript expressions in custom property values to be written within
[interpolation](/documentation/interpolation). Interpolation will also work for older Sass
versions, and so is recommended for all stylesheets.

{% codeExample 2 %}
$accent-color: #fbbc04;

:root {
  // WRONG, will not work in recent Sass versions.
  --accent-color-wrong: $accent-color;

  // RIGHT, will work in all Sass versions.
  --accent-color-right: #{$accent-color};
}
===
$accent-color: #fbbc04

:root
  // WRONG, will not work in recent Sass versions.
  --accent-color-wrong: $accent-color

  // RIGHT, will work in all Sass versions.
  --accent-color-right: #{$accent-color}
===
:root {
  --accent-color-wrong: $accent-color;
  --accent-color-right: #fbbc04;
}
{% endcodeExample %}

{% headsUp %}
Because interpolation removes quotation marks from quoted strings, it may be
necessary to wrap them in the [`meta.inspect()` function][] to preserve their
quotes.

[`meta.inspect()` function]: /documentation/modules/meta#inspect

{% codeExample 3 %}
@use "sass:meta";

$font-family-monospace: Menlo, Consolas, "Courier New", monospace;

:root {
  --font-family-monospace: #{meta.inspect($font-family-monospace)};
}
===
@use "sass:meta"

$font-family-monospace: Menlo, Consolas, "Courier New", monospace

:root
  --font-family-monospace: #{meta.inspect($font-family-monospace)}
===
:root {
  --font-family-monospace: Menlo, Consolas, "Courier New", monospace;
}
{% endcodeExample %}
{% endheadsUp %}
