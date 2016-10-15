module.exports = function(db) {
    /* Save */
    function save(key, doc) {
        db.view('index', 'byLocationAndDate', {
            keys: [key]
        }, function(err, body) {
            if (err) {
                console.log(err);
                return;
            }

            if (body.rows.length <= 0) {
                // no document with specified key found, insert new one
                db.insert(doc, function(err, body) {});
            } else {
                // document with specified key found, update it
                body.rows.forEach(function(rdoc) {
                    doc._id = rdoc.value[0];
                    doc._rev = rdoc.value[1];
                    db.insert(doc, function(err, body) {});
                });
            }
        });
    }

    return {
        save: save
    };
};
