import type { GraphEdge, GraphNode } from '@/lib/algorithms/graph/graphTypes'

type GraphRepresentationsProps = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export function GraphRepresentations({ nodes, edges }: GraphRepresentationsProps) {
  const hasWeights = edges.some((edge) => edge.weight !== undefined)
  const adjacencyList = nodes.map((node) => {
    const neighbors = edges.flatMap((edge) => {
      if (edge.from === node.id) {
        const target = nodes.find((candidate) => candidate.id === edge.to)
        return target ? [`${target.label}${edge.weight === undefined ? '' : `(${edge.weight})`}`] : []
      }
      if (!edge.directed && edge.to === node.id) {
        const target = nodes.find((candidate) => candidate.id === edge.from)
        return target ? [`${target.label}${edge.weight === undefined ? '' : `(${edge.weight})`}`] : []
      }
      return []
    })
    return { node, neighbors }
  })

  function matrixValue(from: GraphNode, to: GraphNode) {
    const matchingEdges = edges.filter((edge) =>
      (edge.from === from.id && edge.to === to.id) ||
      (!edge.directed && edge.from === to.id && edge.to === from.id),
    )
    if (matchingEdges.length === 0) return hasWeights ? '' : '0'
    return matchingEdges.map((edge) => edge.weight === undefined ? '1' : String(edge.weight)).join(', ')
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-2">
      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950" aria-labelledby="adjacency-matrix-heading">
        <h2 id="adjacency-matrix-heading" className="text-lg font-semibold text-slate-900 dark:text-white">Adjacency Matrix</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-center text-sm" aria-label="Graph adjacency matrix">
            <thead>
              <tr>
                <th scope="col" className="border-b border-slate-200 px-3 py-2 text-slate-500 dark:border-slate-800 dark:text-slate-400">Node</th>
                {nodes.map((node) => <th key={node.id} scope="col" className="border-b border-slate-200 px-3 py-2 font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200">{node.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {nodes.map((from) => (
                <tr key={from.id}>
                  <th scope="row" className="border-b border-slate-100 px-3 py-2 font-semibold text-slate-700 dark:border-slate-900 dark:text-slate-200">{from.label}</th>
                  {nodes.map((to) => (
                    <td key={to.id} className="min-w-12 border-b border-slate-100 px-3 py-2 tabular-nums text-slate-600 dark:border-slate-900 dark:text-slate-300">
                      {matrixValue(from, to)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {nodes.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No nodes in the graph.</p>}
        </div>
      </section>

      <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950" aria-labelledby="adjacency-list-heading">
        <h2 id="adjacency-list-heading" className="text-lg font-semibold text-slate-900 dark:text-white">Adjacency List</h2>
        {adjacencyList.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-900">
            {adjacencyList.map(({ node, neighbors }) => (
              <li key={node.id} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 py-3 text-sm">
                <span className="font-semibold text-slate-800 dark:text-slate-100">{node.label}</span>
                <span className="break-words text-slate-600 dark:text-slate-300">
                  <span className="mr-2 text-teal-600 dark:text-teal-400">→</span>
                  {neighbors.length > 0 ? neighbors.join(', ') : '—'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-500">No nodes in the graph.</p>
        )}
      </section>
    </div>
  )
}