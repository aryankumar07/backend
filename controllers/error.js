exports.get404 = (req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404', isAuth : req.user, });
};

exports.get500 = (req, res, next) => {
  res.status(404).render('500', { pageTitle: 'Technical error', path: '/500', isAuth : req.user, });
};
