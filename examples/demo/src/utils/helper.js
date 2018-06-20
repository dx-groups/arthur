
// ===========================> Route <=========================== //

function genRoute(path, breadcrumbName, baseComponent, parentPath) {
  return {
    path,
    exact: true,
    baseComponent,
    breadcrumbName,
    parentPath
  }
}

const RouteHelper = { genRoute }

export {
  RouteHelper,
}
