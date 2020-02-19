let ipUrl = 'http://47.101.215.198:7001/admin/'

let servicePath = {
    checkLogin:ipUrl + 'checkLogin', // 检查用户名是否正确
    getTypeInfo:ipUrl + 'getTypeInfo', //获得文章类别信息
    addArticle:ipUrl + 'addArticle', //添加文章
    updateArticle:ipUrl + 'updateArticle', //修改文章
    getArticleList:ipUrl + 'getArticleList', //得到文章列表
    delArticle:ipUrl + 'delArticle/', // 根据id删除文章
    getArticleById:ipUrl + 'getArticleById/',//根据文章ID 修改文章
    registered:ipUrl + 'Registered' //注册新用户
}
export default servicePath;