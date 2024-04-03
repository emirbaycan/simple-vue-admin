export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'projects',
      displayName: 'menu.projects',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'jobs',
      displayName: 'menu.jobs',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'testimonials',
      displayName: 'menu.testimonials',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'images',
      displayName: 'menu.images',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'users',
      displayName: 'menu.users',
      meta: {
        icon: 'group',
      },
      children: [
        {
          name: 'registered-users',
          displayName: 'menu.registered-users',
        },
        {
          name: 'new-users',
          displayName: 'menu.new-users',
        },
      ],
    },
    {
      name: 'preferences',
      displayName: 'menu.preferences',
      meta: {
        icon: 'manage_accounts',
      },
    },
    {
      name: 'settings',
      displayName: 'menu.settings',
      meta: {
        icon: 'settings',
      },
    },
  ] as INavigationRoute[],
}
