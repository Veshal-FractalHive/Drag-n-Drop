import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, addEdge, BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import type { Node, Edge, Connection, NodeTypes, EdgeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { MatchPair } from '../types';
import { PageLayout, Button, ResultMessage } from '../components';

const matchingPairs: MatchPair[] = [
  { id: '1', left: 'Apple', right: '🍎' },
  { id: '2', left: 'Car', right: '🚗' },
  { id: '3', left: 'Cat', right: '🐱' },
  { id: '4', left: 'Tree', right: '🌳' },
  { id: '5', left: 'Book', right: '📚' },
  { id: '6', left: 'Sun', right: '☀️' },
];

const CustomNode = ({ data }: any) => {
  return (
    <div className="px-6 py-4 rounded-lg border-2 bg-white border-gray-300 relative cursor-default">
      <div className="text-center font-semibold text-lg">{data.label}</div>
      {/* Only show output handle on left nodes, input handle on right nodes */}
      {data.isLeft ? (
        <Handle 
          type="source" 
          position={Position.Right} 
          className="!bg-green-500 !w-4 !h-4 !border-2 !border-white" 
          style={{ right: -8 }}
        />
      ) : (
        <Handle 
          type="target" 
          position={Position.Left} 
          className="!bg-green-500 !w-4 !h-4 !border-2 !border-white" 
          style={{ left: -8 }}
        />
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

function MatchTheFollowing2() {
  const [leftItems, setLeftItems] = useState<string[]>(
    // [...matchingPairs].sort(() => Math.random() - 0.5).map((p) => p.left)
    matchingPairs.map((p) => p.left)
  );
  const [rightItems, setRightItems] = useState<string[]>(
    // [...matchingPairs].sort(() => Math.random() - 0.5).map((p) => p.right)
    [...matchingPairs].sort((a, b) => a.right.localeCompare(b.right)).map((p) => p.right)
  );
  const [edges, setEdges] = useState<Edge[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());

  // Create nodes from items - useMemo to update when items change
  const nodes = useMemo(() => {
    const leftNodes: Node[] = leftItems.map((item, index) => ({
      id: `left-${index}`,
      type: 'custom',
      position: { x: 50, y: index * 100 + 50 },
      data: { label: item, isLeft: true },
    }));

    const rightNodes: Node[] = rightItems.map((item, index) => ({
      id: `right-${index}`,
      type: 'custom',
      position: { x: 400, y: index * 100 + 50 },
      data: { label: item, isLeft: false },
    }));

    return [...leftNodes, ...rightNodes];
  }, [leftItems, rightItems]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      if (!sourceNode || !targetNode) return;

      // Check if source or target already has a connection
      const existingSourceEdge = edges.find((e) => e.source === params.source);
      const existingTargetEdge = edges.find((e) => e.target === params.target);

      // Check if this is a valid match
      const sourceLabel = sourceNode.data.label;
      const targetLabel = targetNode.data.label;
      const pair = matchingPairs.find(
        (p) => p.left === sourceLabel && p.right === targetLabel
      );
      const isCorrect = !!pair;

      // If either node already has a connection, remove the old one first
      if (existingSourceEdge || existingTargetEdge) {
        const edgeToRemove = existingSourceEdge || existingTargetEdge;
        
        // Remove old matched pair if it was correct
        if (edgeToRemove) {
          const oldSourceNode = nodes.find((n) => n.id === edgeToRemove.source);
          const oldTargetNode = nodes.find((n) => n.id === edgeToRemove.target);
          
          if (oldSourceNode && oldTargetNode) {
            const oldPair = matchingPairs.find(
              (p) => p.left === oldSourceNode.data.label && p.right === oldTargetNode.data.label
            );
            
            if (oldPair) {
              setMatchedPairs((prev) => {
                const newSet = new Set(prev);
                newSet.delete(oldPair.id);
                return newSet;
              });
            }
          }
        }
        
        // Remove old edge and add new one
        if (edgeToRemove) {
          setEdges((eds) => {
            const filtered = eds.filter((e) => e.id !== edgeToRemove.id);
            if (isCorrect) {
              return addEdge({ ...params, type: 'default', animated: true, style: { stroke: '#22c55e', strokeWidth: 3 } }, filtered);
            } else {
              return addEdge({ ...params, type: 'default', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 } }, filtered);
            }
          });
        }
        
        // Add to matched pairs if correct
        if (isCorrect && pair) {
          setMatchedPairs((prev) => new Set([...prev, pair.id]));
        }
      } else {
        // No existing connection
        if (isCorrect) {
          // Correct match
          setEdges((eds) => addEdge({ ...params, type: 'default', animated: true, style: { stroke: '#22c55e', strokeWidth: 3 } }, eds));
          setMatchedPairs((prev) => new Set([...prev, pair.id]));
        } else {
          // Incorrect match
          setEdges((eds) => addEdge({ ...params, type: 'default', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 } }, eds));
        }
      }
    },
    [nodes, edges]
  );

  const onEdgesDelete = useCallback((deletedEdges: Edge[]) => {
    // Remove matched pairs when edges are deleted
    deletedEdges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (sourceNode && targetNode) {
        const pair = matchingPairs.find(
          (p) => p.left === sourceNode.data.label && p.right === targetNode.data.label
        );
        
        if (pair) {
          setMatchedPairs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(pair.id);
            return newSet;
          });
        }
      }
    });
  }, [nodes]);

  // Custom Edge with delete button
  const CustomEdge = useCallback(({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd, source, target }: EdgeProps) => {
    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const handleDelete = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      setEdges((currentEdges) => currentEdges.filter((e) => e.id !== id));
      
      // Update matched pairs
      const sourceNode = nodes.find((n) => n.id === source);
      const targetNode = nodes.find((n) => n.id === target);
      
      if (sourceNode && targetNode) {
        const pair = matchingPairs.find(
          (p) => p.left === sourceNode.data.label && p.right === targetNode.data.label
        );
        
        if (pair) {
          setMatchedPairs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(pair.id);
            return newSet;
          });
        }
      }
    };

    return (
      <>
        <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${sourceX + (targetX - sourceX) / 2}px,${sourceY + (targetY - sourceY) / 2}px)`,
              zIndex: 1000,
              pointerEvents: 'auto',
            }}
            className="nodrag nopan"
          >
            <button
              className="bg-red-500 rounded-full w-8 h-8 border-2 border-white text-white font-bold hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center"
              style={{ pointerEvents: 'auto' }}
              onClick={handleDelete}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <span className="text-sm">✕</span>
            </button>
          </div>
        </EdgeLabelRenderer>
      </>
    );
  }, [edges, nodes, matchingPairs]);

  const edgeTypes = {
    default: CustomEdge,
  };

  const handleReset = () => {
    setEdges([]);
    setMatchedPairs(new Set());
    const newLeftItems = [...matchingPairs].sort(() => Math.random() - 0.5).map((p) => p.left);
    const newRightItems = [...matchingPairs].sort(() => Math.random() - 0.5).map((p) => p.right);
    setLeftItems(newLeftItems);
    setRightItems(newRightItems);
  };

  const allMatched = matchedPairs.size === matchingPairs.length;

  // Add this function inside your component
  const getOutputData = useCallback(() => {
    const userMatches = edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const leftValue = sourceNode.data.label;
      const rightValue = targetNode.data.label;
      
      // Check if this match is correct
      const pair = matchingPairs.find(
        (p) => p.left === leftValue && p.right === rightValue
      );
      
      return {
        left: leftValue,
        right: rightValue,
        isCorrect: !!pair,
        pairId: pair?.id || null,
      };
    }).filter(Boolean);
    
    return {
      matches: userMatches,
      totalCorrect: matchedPairs.size,
      totalPairs: matchingPairs.length,
      isComplete: matchedPairs.size === matchingPairs.length,
      score: Math.round((matchedPairs.size / matchingPairs.length) * 100),
    };
  }, [edges, nodes, matchedPairs]);

  const handleSubmit = async () => {
    const outputData = getOutputData();
    
    console.log('Sending to backend:', outputData);
    
    try {
      // const response = await fetch('/api/submit-matches', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(outputData),
      // });
      
      // const result = await response.json();
      // console.log('Backend response:', result);
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  return (
    <PageLayout
      title="Match the Following"
      subtitle="Click and drag from left nodes to right nodes to create connections"
    >
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-500">
          💡 Tip: Click the red ❌ button on a connection line to remove it
        </p>
      </div>

      <div style={{ height: '500px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onEdgesDelete={onEdgesDelete}
          deleteKeyCode="Delete"
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          nodesDraggable={false}
          nodesConnectable={true}
          connectionLineStyle={{ stroke: '#22c55e', strokeWidth: 3 }}
          connectionRadius={20}
          selectNodesOnDrag={false}
          panOnDrag={false}
          zoomOnScroll={true}
          zoomOnPinch={true}
          edgesFocusable={true}
        >
          <div className="absolute top-4 left-4 bg-white p-2 rounded shadow z-10">
            <p className="text-xs text-gray-600">
              {matchedPairs.size} of {matchingPairs.length} matched
            </p>
          </div>
        </ReactFlow>
      </div>

      {/* Result message */}
      {allMatched && (
        <ResultMessage
          isCorrect={true}
          title="🎉 Excellent! All matches are correct!"
        />
      )}

      <div className="mt-4 flex gap-2">
        <Button onClick={handleReset}>Reset</Button>
        <Button onClick={handleSubmit}>Submit Answers</Button>
      </div>
    </PageLayout>
  );
}

export default MatchTheFollowing2;