import { useState } from "react";
import Tree, { TreeNode } from "./components/Tree";
import styles from "./App.module.css";

function App() {
  const [tree, setTree] = useState<TreeNode>({
    id: 1,
    name: "Categories",
    children: [],
  });

  const [treeScale, setTreeScale] = useState(1);

  const handleZoomIn = () => {
    setTreeScale((prevScale) => {
      const newScale = prevScale + 0.1;
      return newScale <= 2 ? newScale : prevScale;
    });
  };

  const handleZoomOut = () => {
    setTreeScale((prevScale) => Math.max(0.2, prevScale - 0.1));
  };

  const handleReset = () => {
    setTreeScale(1);
  };

  const handleUpdateTree = (updatedTree: TreeNode) => {
    setTree(updatedTree);
  };

  return (
    <div className={styles.app}>
      <div className={styles.zoomControls}>
        <div onClick={handleZoomIn}>+</div>
        <div onClick={handleReset}>Reset</div>
        <div onClick={handleZoomOut}>-</div>
      </div>
      <div draggable={true}>
        <h1 className={styles.heading}>TREE STRUCTURE</h1>
        <div style={{ transform: `scale(${treeScale})` }}>
          <Tree root={tree} onUpdate={handleUpdateTree} />
        </div>
      </div>
    </div>
  );
}

export default App;
