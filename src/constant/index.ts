export const MENU = [
    {
      name: '主界面',
      link: 'main',
      children: []
    },
    {
      name: '地图列表',
      link: 'maplist',
      children: []
    },
    {
      name: '任务',
      link: 'task',
      children: [
        { name: '任务列表', link: 'taskList' },
        { name: '任务模板', link: 'taskTemplate' },
        { name: '任务计划', link: 'taskPlan' }
      ]
    },
    {
      name: '系统',
      link: 'system',
      children: [
        {name: '系统设置', link: 'sysSetting'}
      ]
    },
    {
      name: '调试',
      link: 'debug',
      children: []
    },
    {
      name: '关于我们',
      link: 'about',
      children: []
    },
  ]