import React from "react";
import Tree from "react-d3-tree";
import clone from "clone";

const debugData = {
    name: "Root",
    children: [
        {
            name: "1",
            children: [
                {
                    name: "12",
                    children: [
                        {
                            name: "123",
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            name: "2",
            children: [{
                name: "21",
                children: []
            },
            {
                name: "22",
                children: [
                    {
                        name: "221",
                        children: []
                    },
                    {
                        name: "222",
                        children: []
                    }
                ]
            }]
        }

    ]
};

const containerStyles = {
    width: "100%",
    height: "100vh"
};

export default class CenteredTree extends React.PureComponent {
    state = {
        data: debugData
    };

    rootChildCount = 0;

    findNode = (data, nodeName, nestingKey) => (
        data.reduce((a, item) => {
            if (a) return a;
            if (item.name === nodeName) return item;
            if (item[nestingKey]) return this.findNode(item[nestingKey], nodeName, nestingKey)
        }, null)
    );

    addChildNodeToRoot = () => {
        const newData = clone(this.state.data);
        const target = newData.children;
        this.rootChildCount++;
        target.push({
            name: `Child ${this.rootChildCount}`,
            id: `child-${this.rootChildCount}`,
            children: [],
            attributes: {
                parent: 'Root'
            }
        });
        this.setState({
            data: newData
        });
    };

    removeChildNodeFromRoot = () => {
        const newData = clone(this.state.data);
        const target = newData.children;
        target.pop();
        this.rootChildCount--;
        this.setState({
            data: newData
        });
    };

    addChildNode = (nodeData, evt) => {
        //console.log(nodeData);
        const nodeName = nodeData.name;

        const newData = clone(this.state.data);
        const target = newData.children.find((node) => { return node.name === nodeName });
        console.log(newData.children)
        console.log(nodeName)
        const targetChildren = target.children;
        const noOfTargetChildren = target.children.length;

        targetChildren.push({
            name: `${nodeName}-${noOfTargetChildren}`,
            id: `child-${nodeName}-${noOfTargetChildren}`,
            children: [],
            attributes: {
                parent: nodeName
            }
        });



        //console.log("newData", newData)

        this.setState({
            data: newData
        });

        //console.log("state childern: ", this.state.data.children);
    }

    showEdgeDetails = (linkSource, linkTarget, evt) => {
        console.log('node parent: ', linkSource)
        console.log('node: ', linkTarget)
    }

    componentDidMount() {
        // Get treeContainer's dimensions so we can center the tree
        const dimensions = this.treeContainer.getBoundingClientRect();
        this.setState({
            translate: {
                x: dimensions.width / 2,
                y: dimensions.height / 2
            }
        });

        //console.log(this.findNode(this.state.data.children, '223', 'children'));
    }

    render() {
        return (
            <div style={containerStyles} ref={tc => (this.treeContainer = tc)}>
                <button onClick={this.addChildNodeToRoot}>Add Node To Root</button>
                <button onClick={this.removeChildNodeFromRoot}>Remove Node From Root</button>

                {/* <button onClick={console.log(this.bob)}>Show state</button> */}

                <Tree
                    data={this.state.data}
                    translate={this.state.translate}
                    orientation={"vertical"}
                    pathFunc={'straight'}
                    separation={{ siblings: 2 }}
                    onClick={(nodeData, evt) => this.addChildNode(nodeData, evt)}
                    onLinkClick={(linkSource, linkTarget, evt) => this.showEdgeDetails(linkSource, linkTarget, evt)}
                />
            </div>
        );
    }
}

//export default Tree;