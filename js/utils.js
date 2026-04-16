/*
 * Modular programming and code reusability.
 * This module exports helper functions that perform repetitive tasks 
 * independently of the main application logic.
 */

/*
 * Simplifies element selection and provides a centralized place 
 * for basic error handling if an element is missing.
 */
export const $ = (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
};

/*
 * Logic: Capitalizes the first letter of a string. Useful for 
 * displaying API data (like diet names) in a user-friendly format.
 */
export const capitalize = (str) => {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/*
 * Logic: Safely clears all child nodes of a given container.
 * Often used before rendering new search results or favorite cards.
 */
export const clearContainer = (container) => {
    if (container) {
        container.innerHTML = '';
    }
};

/*
 * Simplifies the process of getting data from the URL query string,
 * which is essential for passing search terms between index.html and recipes.html.
 */
export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};