"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_action-browser_src_lib_password_ts";
exports.ids = ["_action-browser_src_lib_password_ts"];
exports.modules = {

/***/ "(action-browser)/./src/lib/password.ts":
/*!*****************************!*\
  !*** ./src/lib/password.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"(action-browser)/./node_modules/bcryptjs/index.js\");\n\nconst ROUNDS = 12;\nasync function hashPassword(plain) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"].hash(plain, ROUNDS);\n}\nasync function verifyPassword(plain, passwordHash) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"].compare(plain, passwordHash);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL3NyYy9saWIvcGFzc3dvcmQudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQThCO0FBRTlCLE1BQU1DLFNBQVM7QUFFUixlQUFlQyxhQUFhQyxLQUFhO0lBQzlDLE9BQU9ILHFEQUFXLENBQUNHLE9BQU9GO0FBQzVCO0FBRU8sZUFBZUksZUFBZUYsS0FBYSxFQUFFRyxZQUFvQjtJQUN0RSxPQUFPTix3REFBYyxDQUFDRyxPQUFPRztBQUMvQiIsInNvdXJjZXMiOlsiRDpcXEludGVybmFsVG9vbHNcXHdlYl9iYXNlXFxzcmNcXGxpYlxccGFzc3dvcmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJjcnlwdCBmcm9tIFwiYmNyeXB0anNcIjtcblxuY29uc3QgUk9VTkRTID0gMTI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYXNoUGFzc3dvcmQocGxhaW46IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gIHJldHVybiBiY3J5cHQuaGFzaChwbGFpbiwgUk9VTkRTKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZlcmlmeVBhc3N3b3JkKHBsYWluOiBzdHJpbmcsIHBhc3N3b3JkSGFzaDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHJldHVybiBiY3J5cHQuY29tcGFyZShwbGFpbiwgcGFzc3dvcmRIYXNoKTtcbn1cbiJdLCJuYW1lcyI6WyJiY3J5cHQiLCJST1VORFMiLCJoYXNoUGFzc3dvcmQiLCJwbGFpbiIsImhhc2giLCJ2ZXJpZnlQYXNzd29yZCIsInBhc3N3b3JkSGFzaCIsImNvbXBhcmUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(action-browser)/./src/lib/password.ts\n");

/***/ })

};
;