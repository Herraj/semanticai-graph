import React, { useRef } from "react";
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

    // array to hold calculated page ranks for each node
    pageRanks = []

    // Creating ref to pass it to input field in dom to fetch value 
    inputRef = React.createRef();

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

    // function to show neighboring nodes of the user input node
    getNeighborNodes = () => {
        //get node name from input field
        const nodeName = this.inputRef.current.value;
        const targetNode = this.findNode(this.state.data.children, nodeName, 'children');
        let neighborNodes = [];

        if (targetNode !== null) {
            const targetParentName = targetNode.attributes.parent;

            if (targetParentName === 'Root') {
                this.state.data.children.forEach(node => {
                    if (node.name !== nodeName) {
                        neighborNodes.push(node.name)
                    }
                });
            }
            else {
                const targetParentNode = this.findNode(this.state.data.children, targetParentName, 'children');
                const targetNeighbors = targetParentNode.children;

                targetNeighbors.forEach(node => {
                    if (node.name !== nodeName) {
                        neighborNodes.push(node.name)
                    }
                });
            }
            neighborNodes.length === 0 ? alert(`No Neighbours for ${nodeName}`) : alert(`Neighbor nodes for ${nodeName}: ${neighborNodes}`);

        } else {
            alert('Invalid node');
        }
    }

    // function to calculate page ranks for each node and store them in pageRanks global array
    calculatePageRanks = (treeData) => {
        treeData.children.forEach((node) => {
            if (node.children.length > 0) {
                this.pageRanks.push({ name: node.name, pageRank: node.children.length + 1 });
                this.generatePageRanks(node)
            }
            else {
                this.pageRanks.push({ name: node.name, pageRank: 1 });
            }
        });
    }

    //function to load calculated page ranks
    generatePageRanks = () => {
        const treeData = clone(this.state.data);
        this.generatePageRanks(treeData);
        console.log(this.pageRanks)
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
    }

    render() {
        return (
            <div style={containerStyles} ref={tc => (this.treeContainer = tc)}>
                <button onClick={this.addChildNodeToRoot}>Add Node To Root</button>
                <button onClick={this.removeChildNodeFromRoot}>Remove Node From Root</button>
                <input type='text' ref={this.inputRef} placeholder="enter node number"></input>
                <button onClick={this.getNeighborNodes}>Get neighbouring nodes</button>
                <button onClick={this.bob}>Calculate Page rank</button>

                <Tree
                    data={this.state.data}
                    translate={this.state.translate}
                    orientation={"vertical"}
                    pathFunc={'straight'}
                    separation={{ siblings: 2 }}
                    onClick={(nodeData, evt) => this.addChildNode(nodeData, evt)}
                />
            </div>
        );
    }
}