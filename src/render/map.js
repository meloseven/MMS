import Login from './login'
import Project from './project'
import Page from './page'
import PageCreator from './creator'
import ProjectAdd from './projectAdd'

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
  {
    name: 'projectAdd',
    title: '添加项目',
    comp: ProjectAdd
  },
];

export default allModules