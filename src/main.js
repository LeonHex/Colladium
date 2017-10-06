(function () {
    let fs = require('fs'),
        readline = require('readline'),
        FlatToNested = require('./libs/FlatToNested'),
        TreeModel = require('./libs/TreeModel');

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
        nestedJson,
        treeModel,
        treeRoot;

    // load mock data from json file
    loadFileByPath('./mock-data/gpc_list.json');
    // transfer origin data to nested form
    formNestedData(mockData);
    // form tree model from nested data
    formTreeModel(nestedJson);

    //read user input from console
    readL = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '[Enter label]'
    });

    readL.prompt();

    readL.on('line', (answer) => {
        if (answer && answer != '') {
            // print the number of nodes found and each node seperately
            let nodes = findNodesByLabel(treeRoot, answer);
            console.log(`[${nodes.length}] nodes that match the label`);
            console.log('=============================================');
            for (node of nodes) {
                console.log('[NODE]');
                console.log(JSON.stringify(node.model));

                console.log('[PATH]');
                console.log(findAncestorsByNode(node));
                console.log('=============================================');
            }
            readL.prompt();
            // readL.close();
        } else {
            console.log('Please enter valid label!');
            readL.prompt();
        }
    });

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

    /* 
        form nested data from flat form
     */
    function formNestedData(json, nestId = 'id', nestParent = 'ancestry', nestChildren = 'children') {
        if (json) {
            /* 
                cause the data is in flat form
                1. have to get it into hierachy form
                2. init a treeModel with the hierachy form data
            */

            // time for a little hack: libs/FlatToNested.js line 35 - 39
            // parent key is lost when nested. this is the 3rd lib's flaw.
            f2nConvertor = new FlatToNested({
                id: nestId,
                parent: nestParent,
                children: nestChildren
            });
            nestedJson = f2nConvertor.convert(json);
            // for output test data
            fs.writeFileSync('./mock-data/gpc_list_nested.json', JSON.stringify(nestedJson));
        } else {
            throw (new Error('illegal json data!'));
        }
    }

    /* 
        form tree model from nested data
    */
    function formTreeModel(nested) {
        treeModel = new TreeModel();
        treeRoot = treeModel.parse(nested);
    }

    /* 
        find all nodes that has the same label as param lbl
    */
    function findNodesByLabel(tree, lbl) {
        let resultNodes;
        if (tree && lbl && lbl != "") {
            resultNodes = tree.all(function (node) {
                return node.model.label == lbl;
            });
        } else {
            throw (new Error('empty label!'));
        }
        return resultNodes;
    }

    /* 
        find all ancestor nodes of the param node
        return a string contains all ancestor label splitted by comma
    */
    function findAncestorsByNode(node) {
        let pathArr,
            leng,
            pathLbl = [];
        if (node) {
            pathArr = node.getPath();
            leng = pathArr.length;
        } else {
            throw (new Error('invalid node!'));
        }

        if (pathArr.length > 0) {
            let resultArr = pathArr.map((item) => {
                return item.model.label == 'ROOT' ? 'All products' : item.model.label;
            });
            return resultArr;
        } else {
            return [];
        }
    }
})();