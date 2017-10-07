describe("colladium", function () {
    let path = require('path'),
        Colladium = require('../../src/main'),
        col,
        mockData,
        readL,
        nestedJson,
        treeRoot,
        mockInput,
        mockOutput;

    beforeEach(function () {
        //prepare mock data
        col = new Colladium();
        mockData = col.loadFileByPath(path.resolve(__dirname, '../../src/mock-data/gpc_list.json'));
        nestedJson = col.formNestedData(mockData);
        treeRoot = col.formTreeModel(nestedJson);

        //prepare input data
        mockInput = col.loadFileByPath(path.resolve(__dirname, '../input/gpc_tree_test_input.json'));

        //prepare output data
        mockOutput = col.loadFileByPath(path.resolve(__dirname, '../output/gpc_tree_test_result.json'));
    });

    it("find a certain node", function () {
        for (item of mockInput) {
            console.log(`\n[Finding node with label:]${item}`);
            expect(col.findNodesByLabel(treeRoot, item).length).toBeGreaterThanOrEqual(1);
        }
    });

    it("find path to a node", function () {
        for (item of mockInput) {
            console.log(`\n[Finding path to node with label:]${item}`);
            let itemNodes = col.findNodesByLabel(treeRoot, item);
            for(it of itemNodes){
                expect(col.findAncestorsByNode(it)).toEqual(mockOutput[item]);
            }
        }
    });
});