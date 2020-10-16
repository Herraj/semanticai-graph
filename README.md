# semanticai-graph

### Project is incomplete and does not meet all the requirements 
Given the time constraints, I wasn't able to finish it. This project is not in a broken state but is missing some key requirements:

* Unit testing has not been implemented simply because the implementation process took longer than expected
* A simple implementation of PageRank has been done but the output is only showing in the console for now (technical difficulty outputting it on the DOM or the SVG canvas)

#### Project setup
Simply clone the 'main' branch and run npm install and then npm start (ReactJS)
Implementation is in Tree.js file

#### Dependencies:
* react-d3-tree
* clone

#### Features
* Graph is draggable and zoomable
* To add a node: Click on any node on canvas or use the button on top
* To remove a node from root: click the button on top
* To get siblings of a node, type in node name and click on the'Remove Node' button on top
* To view page ranks for all nodes in the console, click on the 'Calculate Page Rank' button on top

#### Challenges faced
* This project took longer than expected (4 - 6 hours) for the implementation phase simply because I had to do research and learn a charting library(D3-tree).  
* Working with React DOM and SVG Canvas was a bit challenging since it doesn't work that smoothly with just regular state management unlike traditional Single Page Applications
* Although the functions could be optimized if given time, I used recursion to traverse the tree structure and that could result in performance and memory issues for big data sets 
