---
title: Calculations
introduction: >
  Calculations are how Sass represents the `calc()` function, as well as similar
  functions like `clamp()`, `min()`, and `max()`. Sass will simplify these as
  much as possible, even if they're combined with one another.
---

{% compatibility 'dart: "1.40.0"', 'libsass: false', 'ruby: false' %}
  LibSass, Ruby Sass, and versions of Dart Sass prior to 1.40.0 parse `calc()`
  as a [special function] like `element()`.

  [special function]: /documentation/syntax/special-functions#element-progid-and-expression

  LibSass, Ruby Sass, and versions of Dart Sass prior to 1.31.0 parse `clamp()`
  as a [plain CSS function] rather than supporting special syntax within it.
  Versions of Dart Sass between 1.31.0 and 1.40.0 parse `clamp()` as a [special
  function] like `element()`.

  [plain CSS function]: /documentation/at-rules/function/#plain-css-functions
{% endcompatibility %}

{% codeExample 'calculations', false %}
  @debug calc(400px + 10%); // calc(400px + 10%)
  @debug calc(400px / 2); // 200px
  @debug min(100px, calc(1rem + 10%)); // min(100px, 1rem + 10%)
  ===
  @debug calc(400px + 10%)  // calc(400px + 10%)
  @debug calc(400px / 2)  // 200px
  @debug min(100px, calc(1rem + 10%) ; // min(100px, 1rem + 10%)
{% endcodeExample %}

Calculations use a special syntax that's different from normal SassScript. It's
the same syntax as the CSS `calc()`, but with the additional ability to use
[Sass variables] and call [Sass functions]. This means that `/` is always a
division operator within a calculation!

[Sass variables]: /documentation/variables
[Sass functions]: /documentation/modules

{% funFact %}
  The arguments to a Sass function call use the normal Sass syntax, rather than
  the special calculation syntax!
{% endfunFact %}

You can also use [interpolation] in a calculation. However, if you do, nothing
in the parentheses that surround that interpolation will be simplified or
type-checked, so it's easy to end up with extra verbose or even invalid CSS.
Rather than writing `calc(10px + #{$var})`, just write `calc(10px + $var)`!

[interpolation]: /documentation/interpolation

## Simplification

Sass will simplify adjacent operations in calculations if they use units that
can be combined at compile-time, such as `1in + 10px` or `5s * 2`. If possible,
it'll even simplify the whole calculation to a single number—for example,
`clamp(0px, 30px, 20px)` will return `20px`.

{% headsUp %}
  This means that a calculation expression won't necessarily always return a
  calculation! If you're writing a Sass library, you can always use the
  [`meta.type-of()`] function to determine what type you're dealing with.

  [`meta.type-of()`]: /documentation/modules/meta#type-of
{% endheadsUp %}

Calculations will also be simplified within other calculations. In particular,
if a `calc()` end up inside any other calculation, the function call will be
removed and it'll be replaced by a plain old operation.

{% codeExample 'simplification' %}
  $width: calc(400px + 10%);

  .sidebar {
    width: $width;
    padding-left: calc($width / 4);
  }
  ===
  $width: calc(400px + 10%)

  .sidebar
    width: $width
    padding-left: calc($width / 4)
{% endcodeExample %}

## Operations

You can't use calculations with normal SassScript operations like `+` and `*`.
If you want to write some math functions that allow calculations just write them
within their own `calc()` expressions—if they're passed a bunch of numbers with
compatible units, they'll return plain numbers as well, and if they're passed
calculations they'll return calculations.

This restriction is in place to make sure that if calculations *aren't* wanted,
they throw an error as soon as possible. Calculations can't be used everywhere
plain numbers can: they can't be injected into CSS identifiers (such as
`.item-#{$n}`), for example, and they can't be passed to Sass's built-in [math
functions]. Reserving SassScript operations for plain numbers makes it clear
exactly where calculations are allowed and where they aren't.

[math functions]: /documentation/modules/math

{% codeExample 'calc-operations', false %}
  $width: calc(100% + 10px);
  @debug $width * 2; // Error!
  @debug calc($width * 2); // calc((100% + 10px) * 2);
  ===
  $width: calc(100% + 10px);
  @debug $width * 2; // Error!
  @debug calc($width * 2); // calc((100% + 10px) * 2);
{% endcodeExample %}

## Constants

{% compatibility 'dart: "1.60.0"','libsass: false', 'ruby: false' %}{% endcompatibility %}

Calculations can also contain constants, which are written as CSS identifiers.
For forwards-compatibility with future CSS specs, *all* identifiers are allowed,
and by default they're just treated as unquoted strings that are passed-through
as-is.

{% codeExample 'calc-constants', false %}
  @debug calc(h + 30deg); // calc(h + 30deg);
  ===
  @debug calc(h + 30deg)  // calc(h + 30deg);
{% endcodeExample %}

Sass automatically resolves a few special constant names that are specified in
CSS to unitless numbers:

* `pi` is a shorthand for the [mathematical constant *π*].

  [mathematical constant *π*]: https://en.wikipedia.org/wiki/Pi

* `e` is a shorthand for the [mathematical constant *e*].

  [mathematical constant *e*]: https://en.wikipedia.org/wiki/E_(mathematical_constant)

* `infinity`, `-infinity`, and `NaN` represent the corresponding floating-point
  values.

{% codeExample 'unitless-numbers', false %}
  @use 'sass:math';

  @debug calc(pi); // 3.1415926536
  @debug calc(e);  // 2.7182818285
  @debug calc(infinity) > math.$max-number;  // true
  @debug calc(-infinity) < math.$min-number; // true
  ===
  @use 'sass:math'

  @debug calc(pi)  // 3.1415926536
  @debug calc(e)   // 2.7182818285
  @debug calc(infinity) > math.$max-number   // true
  @debug calc(-infinity) < math.$min-number  // true
{% endcodeExample %}

## `min()` and `max()`

{% compatibility 'dart: ">=1.11.0 <1.42.0"', 'libsass: false', 'ruby: false', 'feature: "Special function syntax"' %}
  LibSass, Ruby Sass, and versions of Dart Sass prior to 1.11.0 *always* parse
  `min()` and `max()` as Sass functions. To create a plain CSS `min()` or
  `max()` call for those implementations, you can write something like
  `unquote("min(#{$padding}, env(safe-area-inset-left))")` instead.

  Versions of Dart Sass between 1.11.0 and 1.40.0, and between 1.40.1 and 1.42.0
  parse `min()` and `max()` functions as [special functions] if they're valid
  plain CSS, but parse them as Sass functions if they contain Sass features
  other than interpolation, like variables or function calls.

  Dart Sass 1.41.0 parses `min()` and `max()` functions as calculations, but
  doesn't allow unitless numbers to be combined with numbers with units. This
  was backwards-incompatible with the global `min()` and `max()` functions, so
  that behavior was reverted.

  [special functions]: /documentation/syntax/special-functions
{% endcompatibility %}

CSS added support for [`min()` and `max()` functions] in Values and Units Level
4, from where they were quickly adopted by Safari [to support the iPhoneX]. But
Sass supported its own [`min()`] and [`max()`] functions long before this, and
it needed to be backwards-compatible with all those existing stylesheets. This
led to the need for extra-special syntactic cleverness.

[`min()` and `max()` functions]: https://drafts.csswg.org/css-values-4/#calc-notation
[to support the iPhoneX]: https://webkit.org/blog/7929/designing-websites-for-iphone-x/
[`min()`]: /documentation/modules/math#min
[`max()`]: /documentation/modules/math#max

If a `min()` or `max()` function call is a valid calculation expression, it will
be parsed as a calculation. But as soon as any part of the call contains a
SassScript feature that isn't supported in a calculation, like the [modulo
operator], it's parsed as a call to Sass's core `min()` or `max()` function
instead.

Since calculations are simplified to numbers when possible anyway, the only
substantive difference is that the Sass functions only support units that can be
combined at build time, so `min(12px % 10, 10%)` will throw an error.

[modulo operator]: /documentation/operators/numeric

{% headsUp %}
  Other calculations don't allow unitless numbers to be added to, subtracted
  from, or compared to numbers with units. `min()` and `max()` are different,
  though: for backwards-compatibility with the global Sass `min()` and `max()`
  functions which allow unit/unitless mixing for historical reasons, these units
  can be mixed as long as they're contained directly within a `min()` or `max()`
  calculation.
{% endheadsUp %}

{% codeExample 'min-max' %}
  $padding: 12px;

  .post {
    // Since these max() calls are valid calculation expressions, they're
    // parsed as calculations.
    padding-left: max($padding, env(safe-area-inset-left));
    padding-right: max($padding, env(safe-area-inset-right));
  }

  .sidebar {
    // Since these use the SassScript-only modulo operator, they're parsed as
    // SassScript function calls.
    padding-left: max($padding % 10, 20px);
    padding-right: max($padding % 10, 20px);
  }
  ===
  $padding: 12px

  .post
    // Since these max() calls are valid calculation expressions, they're
    // parsed as calculations.
    padding-left: max($padding, env(safe-area-inset-left))
    padding-right: max($padding, env(safe-area-inset-right))


  .sidebar
    // Since these use the SassScript-only modulo operator, they're parsed as
    // SassScript function calls.
    padding-left: max($padding % 10, 20px)
    padding-right: max($padding % 10, 20px)
{% endcodeExample %}