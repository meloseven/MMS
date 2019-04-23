const serverEntry = require('./dist/serverEntry');
const API = require('./src/api');
module.exports = {
  views: {
    '/auth/login': serverEntry.login,
    '/auth/users': serverEntry.project,
    '/project/all': serverEntry.project,
    '/project/page': serverEntry.page,
    '/project/page/create':serverEntry.pageCreator,
  },
  apis: {
    get: {
      '/api/userInfo':API.auth.getCurrentUser,
      '/api/project/getList': API.project.getList,
      '/api/logout': API.auth.logout,
      '/api/page/getList': API.page.getList,
      '/api/page/preview': API.page.preview,
      '/api/page/close': API.page.closePreview,
      '/api/page/detail': API.page.getPageInfo,
      '/api/comp/getList': API.comp.getList,
    },
    post: {
      '/api/login':API.auth.login,
      '/api/comp/add': API.comp.add,
      '/api/comp/edit': API.comp.edit,
      '/api/page/save': API.page.savePageInfo,
      '/api/page/update': API.page.updatePageInfo,
      '/api/page/publish': API.page.publish,
      '/api/comp/upload': API.comp.uploadImage,
    }
  }
}