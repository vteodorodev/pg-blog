function isActiveRoute(route, currentRoute) {
    console.log('route', route, currentRoute);
    return route === currentRoute ? 'active' : '';
}

module.exports = { isActiveRoute };
