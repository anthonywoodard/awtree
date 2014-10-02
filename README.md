awTree
--------------
awTree displays JSON data as an interactive HTML unordered list.  It uses jQuery and the jQuery UI widget factory.

Setup
---------------
Run Bower to install dependencies:

    bower install
    
Options
---------------------

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>checkbox</td>
            <td>Append checkboxes to nodes</td>
            <td>Boolean</td>
            <td>false</td>
            
            <td>expandAll</td>
            <td>Expand all nodes</td>
            <td>Boolean</td>
            <td>false</td>
            
            <td>labelKey</td>
            <td>The name in the JSON data string that is to be the text for the node</td>
            <td>String</td>
            <td>name</td>
            
            <td>childrenKey</td>
            <td>The name in the JSON data string that stores the child nodes</td>
            <td>String</td>
            <td>children</td>
            
            <td>lazyLoad</td>
            <td>Determines if a lazyLoad event is triggered when showing children for elements with has-children attribute</td>
            <td>Boolean</td>
            <td>false</td>
            
            <td>data</td>
            <td>Stores the data used to create the tree</td>
            <td>Object</td>
            <td>{}</td>
            
            <td>nodeClicked</td>
            <td>Executes the supplied function when a node is clicked and triggers the nodeClicked event</td>
            <td>Function</td>
            <td>Empty Function</td>
            
            <td>nodeChecked</td>
            <td>If checkbox is true, executes the supplied function when a node is checked and triggers the nodeChecked event</td>
            <td>Function</td>
            <td>Empty Function</td>
            
            <td>nodeUnChecked</td>
            <td>If checkbox is true, executes the supplied function when a node is unchecked and triggers the nodeUnChecked event</td>
            <td>Function</td>
            <td>Empty Function</td>
            
            <td>childNodeChecked</td>
            <td>If checkbox is true, executes the supplied function when a child node is checked and triggers the childNodeChecked event</td>
            <td>Function</td>
            <td>Empty Function</td>
            
            <td>childNodeUnChecked</td>
            <td>If checkbox is true, executes the supplied function when a child node is unchecked and triggers the childNodeUnChecked event</td>
            <td>Function</td>
            <td>Empty Function</td>
            
            <td>nodeCollapsed</td>
            <td>Executes the supplied function when a node is collapsed and triggers the nodeCollapsed event</td>
            <td>Function</td>
            <td>Empty Function</td>
            
            <td>nodeExpanded</td>
            <td>Executes the supplied function when a node is expanded and triggers the nodeExpanded event</td>
            <td>Function</td>
            <td>Empty Function</td>
        </tr>
    </tbody>
</table>

Example
------------
See index.html for an example usage.
 