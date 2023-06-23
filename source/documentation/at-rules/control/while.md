---
title: "@while"
introduction: >
  The `@while` rule, written `@while <expression> { ... }`, evaluates its block
  if its [expression](/documentation/syntax/structure#expressions) returns
  `true`. Then, if its expression still returns `true`, it evaluates its block
  again. This continues until the expression finally returns `false`.
---

{% codeExample 'while' %}
  @use "sass:math";

  /// Divides `$value` by `$ratio` until it's below `$base`.
  @function scale-below($value, $base, $ratio: 1.618) {
    @while $value > $base {
      $value: math.div($value, $ratio);
    }
    @return $value;
  }

  $normal-font-size: 16px;
  sup {
    font-size: scale-below(20px, 16px);
  }
  ===
  @use "sass:math"

  /// Divides `$value` by `$ratio` until it's below `$base`.
  @function scale-below($value, $base, $ratio: 1.618)
    @while $value > $base
      $value: math.div($value, $ratio)
    @return $value



  $normal-font-size: 16px
  sup
    font-size: scale-below(20px, 16px)
{% endcodeExample %}

{% headsUp %}
  Although `@while` is necessary for a few particularly complex stylesheets,
  you're usually better of using either [`@each`][] or [`@for`][] if either of
  them will work. They're clearer for the reader, and often faster to compile as
  well.

  [`@each`]: /documentation/at-rules/control/each
  [`@for`]: /documentation/at-rules/control/for
{% endheadsUp %}

{% render 'doc_snippets/truthiness-and-falsiness' %}
