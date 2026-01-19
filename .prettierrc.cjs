/*
 * @Author: ZHAO
 * @Date: 2026-01-13 16:35:40
 * @LastEditTime: 2026-01-19 11:27:10
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\.prettierrc.cjs
 *
 */
module.exports = {
  printWidth: 120, //每行最多显示的字符数
  tabWidth: 2, //tab的宽度 2个字符
  useTabs: false, //禁止使用tab代替空格
  semi: true, //结尾使用分号
  singleQuote: false, //使用单引号代替双引号
  trailingComma: 'all', //结尾是否添加逗号 all添加，none不添加
  bracketSpacing: true, //对象括号俩边是否用空格隔开
  bracketSameLine: true, //组件最后的尖括号不另起一行
  arrowParens: 'always', //箭头函数参数始终添加括号
  htmlWhitespaceSensitivity: 'ignore', //html存在空格是不敏感的
  vueIndentScriptAndStyle: false, //vue 的script和style的内容是否缩进
  endOfLine: 'auto', //行结尾形式 mac和linux是\n  windows是\r\n
  singleAttributePerLine: false, //组件或者标签的属性是否控制一行只显示一个属性
};
