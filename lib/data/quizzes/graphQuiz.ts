import type { QuizQuestion } from './quizTypes'

export const graphQuiz: QuizQuestion[] = [
  {
    id: 'graph-adjacency-matrix',
    question: 'What is the space complexity of an adjacency matrix for V vertices?',
    options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V^2)'],
    correctIndex: 3,
    explanation: 'The matrix stores a cell for every possible pair of vertices.',
  },
  {
    id: 'graph-adjacency-list',
    question: 'What space does an adjacency list use for V vertices and E edges?',
    options: ['O(V^2)', 'O(V + E)', 'O(log V)', 'O(E^2)'],
    correctIndex: 1,
    explanation: 'It stores the vertices and their incident edges rather than every possible pair.',
  },
  {
    id: 'graph-bfs-structure',
    question: 'Which data structure does Breadth-First Search use to track its frontier?',
    options: ['Stack', 'Queue', 'Binary search tree', 'Union-find'],
    correctIndex: 1,
    explanation: 'A FIFO queue processes discovered nodes level by level.',
  },
  {
    id: 'graph-dfs-structure',
    question: 'Which data structure is used by the iterative Depth-First Search?',
    options: ['Queue', 'Stack', 'Priority queue', 'Fenwick tree'],
    correctIndex: 1,
    explanation: 'A LIFO stack follows a path deeply before returning to other candidates.',
  },
  {
    id: 'graph-dijkstra-weights',
    question: 'What edge-weight condition does Dijkstra’s algorithm require?',
    options: ['All weights must be negative', 'Weights must be non-negative', 'All weights must be equal', 'Weights must be integers'],
    correctIndex: 1,
    explanation: 'A negative edge can produce a shorter path after a node has been finalized, violating Dijkstra’s assumption.',
  },
  {
    id: 'graph-prim',
    question: 'How does Prim’s algorithm grow a minimum spanning tree?',
    options: ['Choose the cheapest edge connecting the tree to an unvisited node', 'Choose the heaviest edge first', 'Sort all nodes by label', 'Follow only directed paths'],
    correctIndex: 0,
    explanation: 'Prim repeatedly selects the minimum-weight edge crossing from the current tree to a new node.',
  },
  {
    id: 'graph-kruskal',
    question: 'How does Kruskal’s algorithm avoid adding an edge that creates a cycle?',
    options: ['Use in-degree counts', 'Use union-find to compare components', 'Use a FIFO queue', 'Use binary search'],
    correctIndex: 1,
    explanation: 'An edge is accepted only when its endpoints belong to different disjoint-set components.',
  },
  {
    id: 'graph-topological-cycle',
    question: 'What does Kahn’s topological-sort algorithm conclude if nodes remain after its queue empties?',
    options: ['The graph is a tree', 'The graph has a cycle', 'All edges are weighted', 'The order is complete'],
    correctIndex: 1,
    explanation: 'Nodes blocked with positive in-degree indicate a cycle, so no complete topological order exists.',
  },
]