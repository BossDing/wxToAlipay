const babel = require("babel-core")


function ast ({ types: t }) {
  

  function require (path) {
    let param = path.get('arguments')[0]

    if (!param) return

    let name = param.get('value').node.trim()
    let reg = /^[\w$]/

    name = name.replace(/\.wxs/, '.sjs')

     if (reg.test(name)) {
      name = `./${name}`
    }

    param.replaceWith(t.StringLiteral(name))
  }



  return {
    name: 'wxs文件转化',
    visitor: {
      CallExpression (path) {
        let caller = path.get('callee')

        if (caller.isIdentifier()) {
          let apiName = caller.get('name').node

          if (apiName === 'require') {
            require(path)
          }
        }
      }
    }
  }
}

function transform(code) {
  // 第一次批量处理
  code =  babel.transform(code, {
    plugins: [
      ast
    ],
    comments: true
  }).code

  return code
}

module.exports = transform