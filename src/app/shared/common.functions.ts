/**
 * JavaScript equivalent of PHP's `ucfirst()`.
 */
String.prototype.ucfirst = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * JavaScript equivalent of PHP's `ucwords()`.
 */
String.prototype.ucwords = function () {
  return (this.toString()).replace(/^([a-z])|\s+([a-z])/g, function ($1: any) {
    return $1.toUpperCase();
  });
};

/**
 * Returns string in Sentence Case. Will observe periods.
 * @example "go code something. right now" -> "Go code something. Right now"
 */
String.prototype.toSentenceCase = function () {
  const temp = this.toString().split(/(\.\s+)/g);
  return temp.map((a) => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()).join('');
};

/**
 * Transforms separated words or PascalCase to snake_case.
 * @example "SnakeCase" -> "snake_case" or "Snake CASE" -> "snake_c_a_s_e"
 */
String.prototype.toSnakeCase = function () {
  return this.replace(/\W+/g, ' ').split(/\s|\B(?=[A-Z])/).map((word) => word.toLowerCase()).join('_');
};

/**
 * Strips out all non-alphanumeric characters and returns the string in camelCase.
 * @example "This is my #1 example!!!" -> "thisIsMy1Example"
 */
String.prototype.toCamelCase = function () {
  return this.replace(/[^a-z0-9 ]/ig, '').replace(/^\w|[A-Z]|\b\w|\s+/g, (match, index) =>
    +match === 0 ? '' : index === 0 ? match.toLowerCase() : match.toUpperCase()
  );
};

/**
 * Compares two linear arrays and returns the element intersection.
 */
Array.prototype.intersection = function (compArray: any[]) {
  return this.filter((x) => !compArray.includes(x));
}

/**
 * Compares two linear arrays and returns the difference.
 */
Array.prototype.difference = function (compArray: any[]) {
  return compArray.length > this.length
    ? compArray.filter((x) => !this.includes(x))
    : this.filter((x) => !compArray.includes(x));
}

/**
 * Compares two linear arrays and returns the symmetric difference.
 */
Array.prototype.xor = function (compArray: any[]) {
  return [
    ...this.filter((x) => !compArray.includes(x)),
    ...compArray.filter((x) => !this.includes(x))
  ];
}

/**
 * Compares two scalar arrays and returns whether there is a difference.
 */
Array.prototype.matches = function (compArray: any[]) {
  return Array.isArray(this) &&
    Array.isArray(compArray) &&
    this.length === compArray.length &&
    this.sort().every((value, index) => value === compArray.sort()[index]);
}
