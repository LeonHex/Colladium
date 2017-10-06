(function () {
    let fs = require('fs'),
        readline = require('readline'),
        FlatToNested = require('./libs/FlatToNested'),
        treeModel = require('./libs/TreeModel');

    /*
     * exception handler
     * 
     * */
    process.on('uncaughtException', function (err) {
        console.error('Caught exception: ' + err);
    });

    let fileContent,
        mockData,
        readL,
        f2nConvertor,
        nestedJson;

    // load mock data from json file
    loadFileByPath('./mock-data/gpc_list.json');
    // transfer origin data to nested form
    formTreeModel(mockData);

    //read user input from console
    readL = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // readL.question('Please enter the label you want to find...\n ', (answer) => {
    //     if (answer && answer != '') {

    //     } else {
    //         // throw (new Error('illegal input!'));
    //     }
    // });

    /* 
        load file by path
    */
    function loadFileByPath(path) {
        if (path && path != '') {
            //load file content as string
            fileContent = fs.readFileSync(path, {
                encoding: 'utf8'
            });
            mockData = JSON.parse(fileContent);
        } else {
            throw (new Error('illegal file path!'));
        }
    }

    function formTreeModel(json) {
        if (json) {
            /* 
                cause the data is in flat form
                1. have to get it into hierachy form
                2. init a treeModel with the hierachy form data
            */
            //test data
            const flat = [
                {value: 111, ancestors: [11,111]},
                {value: 11, ancestors: [1,11]},
                {value: 12, ancestors: [1,12]},
                {value: 1}
            ];
            f2nConvertor = new FlatToNested({
                id: 'value',
                parent: 'ancestors'
            });
            nestedJson = f2nConvertor.convert(flat);
            console.log(nestedJson);
        } else {
            throw (new Error('illegal json data!'));
        }
    }
})();