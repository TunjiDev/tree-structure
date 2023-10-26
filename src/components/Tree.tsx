import React, { useState } from "react";
import styles from "./Tree.module.css";

export interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
}

interface TreeNodeProps {
  node: TreeNode;
  onDelete: (id: number) => void;
  onAddChild: (id: number, name: string) => void;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ node, onDelete, onAddChild }) => {
  const [showChildren, setShowChildren] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [childName, setChildName] = useState("");

  const handleToggleChildren = () => {
    setShowChildren(!showChildren);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChildName(event.target.value);
  };

  const handleAddChild = () => {
    setShowInput(true);
  };

  const handleConfirmAdd = () => {
    if (childName) {
      onAddChild(node.id, childName);
      setShowInput(false);
      setChildName("");
    }
  };

  const handleDelete = () => {
    onDelete(node.id);
  };

  return (
    <div className={styles.treeNode}>
      <div className={styles.treeNode__buttonsContainer}>
        {node.name && <div className={styles.treeNode__title}>{node.name}</div>}
        {showInput && (
          <div className={styles.treeNode__addButtonContainer}>
            <input type="text" value={childName} onChange={handleNameChange} placeholder="Enter name" />
            <div className={styles.treeNode__addButton} onClick={handleConfirmAdd} title="Add">
              ✔
            </div>
          </div>
        )}
        {!showInput && (
          <div className={styles.treeNode__button} onClick={handleAddChild} title="Add">
            +
          </div>
        )}
        <div className={styles.treeNode__deleteButton} onClick={handleDelete} title="Delete">
          x
        </div>
        <div
          className={styles.treeNode__showButton}
          onClick={handleToggleChildren}
          title={showChildren ? "Hide Children" : "Show Children"}
        >
          {showChildren ? "Hide Children" : "Show Children"}
        </div>
      </div>
      {showChildren && (
        <div className={styles.treeNode__childrenContainer}>
          {node.children.map((child) => (
            <TreeNodeComponent key={child.id} node={child} onDelete={onDelete} onAddChild={onAddChild} />
          ))}
        </div>
      )}
    </div>
  );
};

interface TreeProps {
  root: TreeNode;
  onUpdate: (tree: TreeNode) => void;
}

const Tree: React.FC<TreeProps> = ({ root, onUpdate }) => {
  const handleAddChild = (parentId: number, childName: string) => {
    const newNode: TreeNode = {
      id: Date.now(),
      name: childName,
      children: [],
    };

    const updatedTree = traverseAndAddChild(root, parentId, newNode);
    onUpdate(updatedTree);
  };

  const handleDeleteNode = (id: number) => {
    const updatedTree = traverseAndDeleteNode(root, id);
    onUpdate(updatedTree);
  };

  const traverseAndAddChild = (node: TreeNode, parentId: number, newNode: TreeNode): TreeNode => {
    if (node.id === parentId) {
      return {
        ...node,
        children: [...node.children, newNode],
      };
    }

    return {
      ...node,
      children: node.children.map((child) => traverseAndAddChild(child, parentId, newNode)),
    };
  };

  const traverseAndDeleteNode = (node: TreeNode, id: number): TreeNode => {
    const updatedChildren = node.children.filter((child) => child.id !== id);

    return {
      ...node,
      children: updatedChildren.map((child) => traverseAndDeleteNode(child, id)),
    };
  };

  return <TreeNodeComponent node={root} onDelete={handleDeleteNode} onAddChild={handleAddChild} />;
};

export default Tree;
