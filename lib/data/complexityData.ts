export type ComplexityEntry = {
  category: string
  name: string
  timeBest?: string
  timeAverage: string
  timeWorst: string
  space: string
  notes?: string
}

export const complexityData: ComplexityEntry[] = [
  { category: 'Sorting', name: 'Bubble Sort', timeBest: 'O(n)', timeAverage: 'O(n^2)', timeWorst: 'O(n^2)', space: 'O(1)', notes: 'Early exit when a pass makes no swaps.' },
  { category: 'Sorting', name: 'Insertion Sort', timeBest: 'O(n)', timeAverage: 'O(n^2)', timeWorst: 'O(n^2)', space: 'O(1)' },
  { category: 'Sorting', name: 'Selection Sort', timeBest: 'O(n^2)', timeAverage: 'O(n^2)', timeWorst: 'O(n^2)', space: 'O(1)' },
  { category: 'Sorting', name: 'Merge Sort', timeBest: 'O(n log n)', timeAverage: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(n)' },
  { category: 'Sorting', name: 'Quick Sort', timeBest: 'O(n log n)', timeAverage: 'O(n log n)', timeWorst: 'O(n^2)', space: 'O(log n) average; O(n) worst', notes: 'Worst case occurs with consistently unbalanced partitions.' },
  { category: 'Searching', name: 'Linear Search', timeBest: 'O(1)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(1)' },
  { category: 'Searching', name: 'Binary Search', timeBest: 'O(1)', timeAverage: 'O(log n)', timeWorst: 'O(log n)', space: 'O(1)', notes: 'Requires sorted input.' },
  { category: 'Stack', name: 'Array Stack Operations', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Push/pop snapshots copy the array; abstract stack operations are O(1).' },
  { category: 'Stack', name: 'Linked-List Stack', timeBest: 'O(1)', timeAverage: 'O(1)', timeWorst: 'O(1)', space: 'O(n)', notes: 'Push and pop at the head.' },
  { category: 'Stack', name: 'Postfix Expression Evaluation', timeBest: 'O(t)', timeAverage: 'O(t)', timeWorst: 'O(t)', space: 'O(t)', notes: 't is the number of tokens.' },
  { category: 'Stack', name: 'Prefix Expression Evaluation', timeBest: 'O(t)', timeAverage: 'O(t)', timeWorst: 'O(t)', space: 'O(t)', notes: 'Scans tokens in reverse using an operand stack.' },
  { category: 'Queue', name: 'Array Queue', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Immutable enqueue/dequeue copy the backing array.' },
  { category: 'Queue', name: 'Linked-List Queue', timeBest: 'O(1)', timeAverage: 'O(1)', timeWorst: 'O(1)', space: 'O(n)', notes: 'With head and tail references.' },
  { category: 'Queue', name: 'Circular Queue', timeBest: 'O(1)', timeAverage: 'O(1)', timeWorst: 'O(1)', space: 'O(c)', notes: 'c is the fixed buffer capacity.' },
  { category: 'Queue', name: 'Deque', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Array-backed front insertion/removal shifts or copies elements.' },
  { category: 'Queue', name: 'Priority Queue', timeBest: 'O(1) peek', timeAverage: 'O(n log n) enqueue', timeWorst: 'O(n log n) enqueue; O(n) dequeue', space: 'O(n)', notes: 'The visualizer keeps items in a sorted array rather than a heap.' },
  { category: 'Linked List', name: 'Singly Linked List Operations', timeBest: 'O(1)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Head operations are O(1); indexed insertion, deletion, and search are O(n).' },
  { category: 'Linked List', name: 'Doubly Linked List Operations', timeBest: 'O(1)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Head/tail operations are O(1); locating an indexed node is O(n).' },
  { category: 'Linked List', name: 'Circular Singly Linked List', timeBest: 'O(1)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Head/tail operations are O(1); indexed operations and search are O(n).' },
  { category: 'Linked List', name: 'Circular Doubly Linked List', timeBest: 'O(1)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Head/tail operations are O(1); indexed operations and search are O(n).' },
  { category: 'Linked List', name: 'Reverse List', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Produces a copied node sequence for visualization.' },
  { category: 'Linked List', name: 'Merge Sorted Lists', timeBest: 'O(min(m, n))', timeAverage: 'O(m + n)', timeWorst: 'O(m + n)', space: 'O(m + n)', notes: 'm and n are the input list lengths.' },
  { category: 'Linked List', name: 'Compare Lists', timeBest: 'O(1)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(1)', notes: 'Stops at the first mismatch; n is the longer list length.' },
  { category: 'Tree', name: 'Binary Search Tree', timeBest: 'O(1)', timeAverage: 'O(log n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Insert/delete/search depend on height; an unbalanced tree can become a chain.' },
  { category: 'Tree', name: 'AVL Tree', timeBest: 'O(log n)', timeAverage: 'O(log n)', timeWorst: 'O(log n)', space: 'O(n)', notes: 'Height balancing guarantees logarithmic updates.' },
  { category: 'Tree', name: 'Red-Black Tree', timeBest: 'O(log n)', timeAverage: 'O(log n)', timeWorst: 'O(log n)', space: 'O(n)', notes: 'Recoloring and rotations maintain logarithmic height.' },
  { category: 'Tree', name: 'Preorder Traversal', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(h)', notes: 'h is tree height; recursive call stack.' },
  { category: 'Tree', name: 'Inorder Traversal', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(h)', notes: 'h is tree height; recursive call stack.' },
  { category: 'Tree', name: 'Postorder Traversal', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(h)', notes: 'h is tree height; recursive call stack.' },
  { category: 'Tree', name: 'Level-Order Traversal', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Queue can hold a full tree level.' },
  { category: 'Tree', name: 'Morris Inorder Traversal', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(1)', notes: 'Temporarily threads links to avoid a stack.' },
  { category: 'Tree', name: 'Trie Operations', timeBest: 'O(L)', timeAverage: 'O(L)', timeWorst: 'O(L)', space: 'O(L)', notes: 'L is the input word or prefix length; insert/search/prefix lookup.' },
  { category: 'Tree', name: 'Segment Tree', timeBest: 'O(log n)', timeAverage: 'O(log n)', timeWorst: 'O(n) build; O(log n) query/update', space: 'O(n)', notes: 'Build takes O(n); range query and point update take O(log n).' },
  { category: 'Tree', name: 'Fenwick Tree', timeBest: 'O(log n)', timeAverage: 'O(log n)', timeWorst: 'O(n log n) build; O(log n) update/query', space: 'O(n)', notes: 'Build inserts each value through repeated Fenwick updates.' },
  { category: 'Tree', name: 'Lowest Common Ancestor', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Searches root-to-target paths without preprocessing.' },
  { category: 'Tree', name: 'Tree Diameter', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'One postorder height pass.' },
  { category: 'Tree', name: 'Tree Isomorphism', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Compares corresponding child structure recursively.' },
  { category: 'Tree', name: 'Serialize / Deserialize', timeBest: 'O(n)', timeAverage: 'O(n)', timeWorst: 'O(n)', space: 'O(n)', notes: 'Serialization includes null-child markers.' },
  { category: 'Tree', name: 'Heap Sort', timeBest: 'O(n log n)', timeAverage: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(1)', notes: 'Auxiliary space; the visualizer retains step snapshots.' },
  { category: 'Tree', name: 'Huffman Coding', timeBest: 'O(N + k^2 log k)', timeAverage: 'O(N + k^2 log k)', timeWorst: 'O(N + k^2 log k)', space: 'O(N + k)', notes: 'k distinct symbols; this implementation re-sorts its queue during each merge.' },
  { category: 'Graph', name: 'Adjacency Matrix', timeBest: 'O(1) edge lookup', timeAverage: 'O(1) edge lookup', timeWorst: 'O(V^2) build/traversal', space: 'O(V^2)', notes: 'Fast edge lookup; storage is quadratic in vertices.' },
  { category: 'Graph', name: 'Adjacency List', timeBest: 'O(1) vertex lookup', timeAverage: 'O(V + E) traversal', timeWorst: 'O(V + E) traversal', space: 'O(V + E)', notes: 'Stores each vertex and its incident edges.' },
  { category: 'Graph', name: 'Breadth-First Search', timeBest: 'O(V + E)', timeAverage: 'O(V + E)', timeWorst: 'O(V + E)', space: 'O(V + E)', notes: 'Adjacency-list traversal.' },
  { category: 'Graph', name: 'Depth-First Search', timeBest: 'O(V + E)', timeAverage: 'O(V + E)', timeWorst: 'O(V + E)', space: 'O(V + E)', notes: 'Adjacency-list traversal with an explicit stack.' },
  { category: 'Graph', name: "Dijkstra's Algorithm", timeBest: 'O((V + E) log V)', timeAverage: 'O((V + E) log V)', timeWorst: 'O((V + E) log V)', space: 'O(V + E)', notes: 'Binary min-heap; non-negative edge weights.' },
  { category: 'Graph', name: "Prim's Minimum Spanning Tree", timeBest: 'O(VE log E)', timeAverage: 'O(VE log E)', timeWorst: 'O(VE log E)', space: 'O(V + E)', notes: 'This implementation rescans and sorts frontier edges at each step.' },
  { category: 'Graph', name: "Kruskal's Minimum Spanning Tree", timeBest: 'O(E log E)', timeAverage: 'O(E log E)', timeWorst: 'O(E log E)', space: 'O(V + E)', notes: 'Edge sorting dominates union-find operations.' },
  { category: 'Graph', name: 'Topological Sort', timeBest: 'O(V + E)', timeAverage: 'O(V + E)', timeWorst: 'O(V + E)', space: 'O(V + E)', notes: "Kahn's algorithm with in-degree tracking." },
]