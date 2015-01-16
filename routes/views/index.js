var keystone = require('keystone'),
    _ = require('underscore'),
    async = require('async');


// HELPERS
// -------------------
function taskFactory(key, options) {
    return function(callback) {
        var q = keystone.list(key).model.find();
        if (options && options.ref) {
            q = q.populate(options.ref)
        }
        q.exec(function(err, results) {
            if (err) {
                callback(err)
            }
            if (options && options.postprocess) {
                results = options.postprocess(results);
            }
            callback(null, results)
        });
    }
}

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals,
        section = locals.section = req.params.section || 'home',
        lng = locals.lang = req.params.lng || 'fr';


    if (_.contains(['fr', 'en'], lng) == false || _.contains(keystone.get('sections'), section) == false) {
        return res.render('errors/404');
    }

    switch (section) {
        case 'home':
            view.render(section);
            break;
        default:
            view.render(section);
    }

};
