import Login from './login'
import Project from './project'
import Page from './page'
import PageCreator from './creator'

const allModules = [
  {
    name: 'login',
    title: '登陆',
    comp: Login
  },
  {
    name: 'project',
    title: '所有项目',
    comp: Project
  },
  {
    name: 'page',
    title: '所有页面',
    comp: Page
  },
  {
    name: 'pageCreator',
    title: '创建页面',
    comp: PageCreator
  },
];

export default allModules