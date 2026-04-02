"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_rsc_src_lib_password_ts";
exports.ids = ["_rsc_src_lib_password_ts"];
exports.modules = {

/***/ "(rsc)/./src/lib/password.ts":
/*!*****************************!*\
  !*** ./src/lib/password.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n\nconst ROUNDS = 12;\nasync function hashPassword(plain) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"].hash(plain, ROUNDS);\n}\nasync function verifyPassword(plain, passwordHash) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"].compare(plain, passwordHash);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3Bhc3N3b3JkLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QjtBQUU5QixNQUFNQyxTQUFTO0FBRVIsZUFBZUMsYUFBYUMsS0FBYTtJQUM5QyxPQUFPSCxxREFBVyxDQUFDRyxPQUFPRjtBQUM1QjtBQUVPLGVBQWVJLGVBQWVGLEtBQWEsRUFBRUcsWUFBb0I7SUFDdEUsT0FBT04sd0RBQWMsQ0FBQ0csT0FBT0c7QUFDL0IiLCJzb3VyY2VzIjpbIkQ6XFxJbnRlcm5hbFRvb2xzXFx3ZWJfYmFzZVxcc3JjXFxsaWJcXHBhc3N3b3JkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiY3J5cHQgZnJvbSBcImJjcnlwdGpzXCI7XG5cbmNvbnN0IFJPVU5EUyA9IDEyO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFzaFBhc3N3b3JkKHBsYWluOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICByZXR1cm4gYmNyeXB0Lmhhc2gocGxhaW4sIFJPVU5EUyk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2ZXJpZnlQYXNzd29yZChwbGFpbjogc3RyaW5nLCBwYXNzd29yZEhhc2g6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gYmNyeXB0LmNvbXBhcmUocGxhaW4sIHBhc3N3b3JkSGFzaCk7XG59XG4iXSwibmFtZXMiOlsiYmNyeXB0IiwiUk9VTkRTIiwiaGFzaFBhc3N3b3JkIiwicGxhaW4iLCJoYXNoIiwidmVyaWZ5UGFzc3dvcmQiLCJwYXNzd29yZEhhc2giLCJjb21wYXJlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/password.ts\n");

/***/ })

};
;