---
title: At-Rules
introduction: >
  Much of Sass’s extra functionality comes in the form of new
  [at-rules](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule) it adds
  on top of CSS:
---

- [`@use`](/documentation/at-rules/use) loads mixins, functions, and variables
  from other Sass stylesheets, and combines CSS from multiple stylesheets
  together.

- [`@forward`](/documentation/at-rules/forward) loads a Sass stylesheet and
  makes its mixins, functions, and variables available when your stylesheet is
  loaded with the `@use` rule.

- [`@import`](/documentation/at-rules/import) extends the CSS at-rule to load
  styles, mixins, functions, and variables from other stylesheets.

- [`@mixin` and `@include`](/documentation/at-rules/mixin) makes it easy to
  re-use chunks of styles.

- [`@function`](/documentation/at-rules/function) defines custom functions that
  can be used in [SassScript expressions][].

- [`@extend`](/documentation/at-rules/extend) allows selectors to inherit styles
  from one another.

- [`@at-root`](/documentation/at-rules/at-root) puts styles within it at the
  root of the CSS document.

- [`@error`](/documentation/at-rules/error) causes compilation to fail with an
  error message.

- [`@warn`](/documentation/at-rules/warn) prints a warning without stopping
  compilation entirely.

- [`@debug`](/documentation/at-rules/debug) prints a message for debugging
  purposes.

- Flow control rules like [`@if`][], [`@each`][], [`@for`][], and [`@while`][]
  control whether or how many times styles are emitted.

[SassScript expressions]: /documentation/syntax/structure#expressions
[`@if`]: /documentation/at-rules/control/if
[`@each`]: /documentation/at-rules/control/each
[`@for`]: /documentation/at-rules/control/for
[`@while`]: /documentation/at-rules/control/while

Sass also has some special behavior for [plain CSS at-rules][]: they can contain
[interpolation][], and they can be nested in style rules. Some of them, like
[`@media`][] and [`@supports`][], also allow SassScript to be used directly in
the rule itself without interpolation.

[plain CSS at-rules]: /documentation/at-rules/css
[interpolation]: /documentation/interpolation
[`@media`]: /documentation/at-rules/css#media
[`@supports`]: /documentation/at-rules/css#supports
