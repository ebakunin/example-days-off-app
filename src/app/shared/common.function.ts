declare global {
    // declare prototype functions
    interface String {
        ucfirst(): string;
        ucwords(): string;
        toSnakeCase(): string;
        toSentenceCase(): string;
        toCamelCase(): string;
    }
}

/**
 * JavaScript equivalent of PHP's ucfirst().
 * @returns {string}
 */
String.prototype.ucfirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * JavaScript equivalent of PHP's ucwords().
 * @returns {string}
 */
String.prototype.ucwords = function () {
    return (this.toString()).replace(/^([a-z])|\s+([a-z])/g, function ($1: any) {
        return $1.toUpperCase();
    });
};

/**
 * Returns string in Sentence Case. Will observe periods.
 * @example "go code something. right now" -> "Go code something. Right now"
 * @returns {string}
 */
String.prototype.toSentenceCase = function () {
    const temp = this.toString().split(/(\.\s+)/g);
    return temp.map(a => a.charAt(0).toUpperCase() + a.slice(1).toLowerCase()).join('');
};

/**
 * Transforms separated words or PascalCase to snake_case.
 * @example "SnakeCase" -> "snake_case" or "Snake CASE" -> "snake_c_a_s_e"
 * @returns {string}
 */
String.prototype.toSnakeCase = function () {
    return this.replace(/\W+/g, ' ').split(/\s|\B(?=[A-Z])/).map(word => word.toLowerCase()).join('_');
};

/**
 * Strips out all non-alphanumeric characters and returns the string in camelCase.
 * @example "This is my #1 example!!!" -> "thisIsMy1Example"
 * @returns {string}
 */
String.prototype.toCamelCase = function () {
    return this.replace(/[^a-z0-9 ]/ig, '').replace(/^\w|[A-Z]|\b\w|\s+/g, (match, index) => {
        return +match === 0 ? '' : index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
};

/**
 * Compares two linear arrays and returns the element intersection.
 * @param {any[]} array1
 * @param {any[]} array2
 * @returns {any[]}
 */
export function arrayIntersection(array1: any[], array2: any[]): any[] {
    return array1.filter(x => !array2.includes(x));
}

/**
 * Compares two linear arrays and returns the difference.
 * @param {any[]} array1
 * @param {any[]} array2
 * @returns {any[]}
 */
export function arrayDiff(array1: any[], array2: any[]): any[] {
    return array2.length > array1.length
        ? array2.filter(x => !array1.includes(x))
        : array1.filter(x => !array2.includes(x));
}

/**
 * Compares two linear arrays and returns the symmetric difference.
 * @param {any[]} array1
 * @param {any[]} array2
 * @returns {any[]}
 */
export function arraySymmetricDiff(array1: any[], array2: any[]): any[] {
    return array1.filter(x => !array2.includes(x)).concat(array2.filter(x => !array1.includes(x)));
}

/**
 * Compares two scalar arrays and returns whether there is a difference.
 * @param {any[]} array1
 * @param {any[]} array2
 * @returns {boolean}
 */
export function arrayMatch(array1: any[], array2: any[]): boolean {
    return Array.isArray(array1) && Array.isArray(array2) &&
        array1.length === array2.length &&
        array1.sort().every((value, index) => value === array2.sort()[index]);
}
