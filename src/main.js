(function () {
    let fs = require('fs');

    /*
     * exception handler
     * 
     * */
    process.on('uncaughtException', function (err) {
        console.error('Caught exception: ' + err);
    });

    let mockData;

    loadFileByPath('./mock-data/gpc_list.json');

    function loadFileByPath(path) {
        if (path && path != '') {
            mockData = fs.readFileSync(path, {
                encoding: 'utf8'
            });
            console.log(mockData);
        } else {
            throw (new Error('illegal file path!'));
        }
    }
})();