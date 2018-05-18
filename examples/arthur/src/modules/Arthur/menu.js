import * as urls from '../../global/urls'

export default {
  menu: 'ARTHUR',
  menuKey: 'ARTHUR',
  menuIcon: 'shop',
  menuUrl: urls.ARTHUR,
  children: [
    {
      menu: 'ARTHUR_PAGE',
      menuKey: 'ARTHUR_PAGE',
      menuIcon: 'barcode',
      menuUrl: urls.ARTHUR_PAGE,
      children: [
        {
          menu: 'ARTHUR_PAGE_SUB',
          menuKey: 'ARTHUR_PAGE_SUB',
          menuIcon: 'schedule',
          menuUrl: urls.ARTHUR_PAGE_SUB,
        }
      ]
    }
  ]
}
