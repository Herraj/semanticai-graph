import React from "react";
import Tree from "react-d3-tree";
import clone from "clone";

const treeData = {
    name: "Root",
    children: []
};

const containerStyles = {
    width: "100%",
    height: "100vh"
};

export default class CenteredTree extends React.PureComponent {
    state = {
        data: treeData
    };

    rootChildCount = 0;

    // Recursive function to find a specific node 
    findNode = (data, nodeName, nestingKey) => (
        data.reduce((a, item) => {
            if (a) return a;
            if (item.name === nodeName) return item;
            if (item[nestingKey]) return this.findNode(item[nestingKey], nodeName, nestingKey)
        }, null)
    );

    // Function to add a child node to the root node
    addChildNodeToRoot = () => {
        const newData = clone(this.state.data);
        const target = newData.children;
        this.rootChildCount++;
        target.push({
            name: `${this.rootChildCount}`,
            children: [],
            attributes: {
                parent: 'Root'
            }
        });
        this.setState({
            data: newData
        });
    };

    // Add a child node to an existing node
    addChildNode = (nodeData, evt) => {
        if (nodeData.name === 'Root') {
            this.addChildNodeToRoot();
        }
        else {
            const nodeName = nodeData.name;
            const newData = clone(this.state.data);
            const targetNode = this.findNode(newData.children, nodeName, 'children');
            const noChildrenOfTarget = targetNode.children.length;

            targetNode.children.push({
                name: `${nodeName}${noChildrenOfTarget + 1}`,
                children: [],
                attributes: {
                    parent: nodeName
                }
            });

            this.setState({
                data: newData
            });
        }
    }

    // Remove last direct child of Root
    removeChildNodeFromRoot = () => {
        const newData = clone(this.state.data);
        const targetNode = newData.children;
        targetNode.pop();
        this.rootChildCount--;
        this.setState({
            data: newData
        });
    };

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