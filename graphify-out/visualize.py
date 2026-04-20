import json
from pathlib import Path
from collections import defaultdict

# Load merged graph
with open('graphify-out/graph.json') as f:
    graph = json.load(f)

nodes = {n['id']: n for n in graph['nodes']}
edges = graph['edges']

# Simple community detection using greedy modularity optimization
adjacency = defaultdict(set)
for edge in edges:
    src, tgt = edge['source'], edge['target']
    if src in nodes and tgt in nodes:
        adjacency[src].add(tgt)
        adjacency[tgt].add(src)

# Assign to communities using greedy clustering
communities = []
unvisited = set(nodes.keys())

while unvisited:
    # Start BFS from an unvisited node
    start = next(iter(unvisited))
    community = set()
    queue = [start]
    
    while queue:
        node = queue.pop(0)
        if node in community:
            continue
        community.add(node)
        unvisited.discard(node)
        
        # Add neighbors that are not in other communities yet
        for neighbor in adjacency[node]:
            if neighbor in unvisited:
                queue.append(neighbor)
    
    if community:
        communities.append(list(community))

# Assign community IDs to nodes
node_community = {}
for comm_id, comm in enumerate(communities):
    for node_id in comm:
        node_community[node_id] = comm_id

# Add community info to nodes
for node in graph['nodes']:
    node['community'] = node_community.get(node['id'], 0)

# Generate HTML visualization
html_content = '''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bharat Ka Apna FD Advisor - Knowledge Graph</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/vis.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; }
        .container { display: flex; height: 100vh; }
        .network { flex: 1; background: white; }
        .sidebar { width: 320px; background: #fff; border-left: 1px solid #e0e0e0; overflow-y: auto; padding: 20px; }
        .sidebar h2 { font-size: 18px; margin-bottom: 16px; color: #333; }
        .node-type { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; margin: 4px 4px 4px 0; font-weight: 600; }
        .type-module { background: #e3f2fd; color: #1565c0; }
        .type-function { background: #f3e5f5; color: #6a1b9a; }
        .type-data { background: #e8f5e9; color: #2e7d32; }
        .type-api { background: #fff3e0; color: #e65100; }
        .type-concept { background: #fce4ec; color: #c2185b; }
        .type-component { background: #e0f2f1; color: #00695c; }
        .stats { background: #f9f9f9; padding: 12px; border-radius: 4px; margin-bottom: 20px; font-size: 13px; }
        .stats p { margin: 4px 0; color: #666; }
        .legend { margin: 20px 0; }
        .legend-item { margin: 8px 0; font-size: 12px; }
        .legend-color { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 6px; vertical-align: middle; }
        #info { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
        #info h3 { font-size: 14px; margin: 8px 0; color: #333; }
        #info p { font-size: 12px; color: #666; line-height: 1.5; margin: 4px 0; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 20px; }
        .header h1 { font-size: 18px; margin: 0; }
        .header p { font-size: 12px; opacity: 0.9; margin: 4px 0 0 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="network" id="network"></div>
        <div class="sidebar">
            <div class="header">
                <h1>FD Advisor Graph</h1>
                <p>Knowledge Graph Visualization</p>
            </div>
            
            <div class="stats">
                <p><strong>Nodes:</strong> {TOTAL_NODES}</p>
                <p><strong>Edges:</strong> {TOTAL_EDGES}</p>
                <p><strong>Communities:</strong> {COMMUNITIES}</p>
                <p><strong>Model:</strong> graphify-v1</p>
            </div>
            
            <div class="legend">
                <strong style="font-size: 12px; display: block; margin-bottom: 8px;">Node Types:</strong>
                <div class="legend-item"><span class="legend-color" style="background: #667eea;"></span> Module</div>
                <div class="legend-item"><span class="legend-color" style="background: #764ba2;"></span> Function</div>
                <div class="legend-item"><span class="legend-color" style="background: #36b9cc;"></span> Data</div>
                <div class="legend-item"><span class="legend-color" style="background: #f59e0b;"></span> API</div>
                <div class="legend-item"><span class="legend-color" style="background: #ec4899;"></span> Concept</div>
                <div class="legend-item"><span class="legend-color" style="background: #10b981;"></span> Component</div>
            </div>
            
            <div id="info">
                <p style="color: #999; font-size: 11px;">Click a node to see details</p>
            </div>
        </div>
    </div>

    <script>
        const container = document.getElementById('network');

        if (typeof vis === 'undefined' || !vis.DataSet || !vis.Network) {
            container.innerHTML = '<div style="padding:24px;font-size:14px;color:#555;line-height:1.6;">Graph visualization library failed to load (likely CDN/network issue). Try opening this page with internet access or rerun graph generation.</div>';
        } else {
            const nodes = new vis.DataSet({NODES_JSON});
            const edges = new vis.DataSet({EDGES_JSON});

            const options = {
                physics: {
                    enabled: true,
                    stabilization: { iterations: 200 },
                    barnesHut: { gravitationalConstant: -30000, centralGravity: 0.3, springLength: 200 }
                },
                nodes: {
                    shape: 'dot',
                    scaling: { min: 10, max: 30 },
                    font: { size: 13, color: '#333' },
                    borderWidth: 2,
                    borderWidthSelected: 3
                },
                edges: {
                    arrows: 'to',
                    smooth: { type: 'continuous' },
                    color: { color: '#d0d0d0', highlight: '#667eea', opacity: 0.5 },
                    width: 2,
                    font: { size: 11, align: 'middle', color: '#999' },
                    widthConstraint: { maximum: 5 }
                }
            };

            const network = new vis.Network(container, { nodes, edges }, options);

            network.on('click', function(params) {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    const node = nodes.get(nodeId);
                    const info = document.getElementById('info');
                    info.innerHTML = `
                        <h3>${node.label}</h3>
                        <p><strong>Type:</strong> ${node.nodeType}</p>
                        <p><strong>File:</strong> ${node.sourceFile || 'N/A'}</p>
                        <p><strong>Community:</strong> ${node.community}</p>
                        <p style="margin-top: 8px; font-style: italic; color: #888;">${node.description || 'No description'}</p>
                    `;
                }
            });
        }
    </script>
</body>
</html>'''

# Prepare data for visualization
type_colors = {
    'module': '#667eea',
    'function': '#764ba2',
    'data': '#36b9cc',
    'api': '#f59e0b',
    'concept': '#ec4899',
    'component': '#10b981'
}

# Format nodes for vis.js
vis_nodes = []
for node in graph['nodes']:
    color = type_colors.get(node.get('node_type', 'module'), '#667eea')
    vis_nodes.append({
        'id': node['id'],
        'label': node['label'],
        'title': node.get('description', ''),
        'color': color,
        'font': {'color': 'white', 'size': 12, 'bold': {'color': 'white'}},
        'nodeType': node.get('node_type', 'unknown'),
        'sourceFile': node.get('source_file', ''),
        'community': node.get('community', 0),
        'description': node.get('description', ''),
        'size': 15 + len([e for e in edges if e['source'] == node['id']]) * 2
    })

# Format edges for vis.js
vis_edges = []
for edge in edges:
    vis_edges.append({
        'from': edge['source'],
        'to': edge['target'],
        'label': edge.get('relationship', 'related'),
        'title': edge.get('evidence', ''),
        'smooth': {'enabled': True, 'type': 'continuous'}
    })

import json
nodes_json = json.dumps(vis_nodes)
edges_json = json.dumps(vis_edges)

# Replace placeholders
html_content = html_content.replace('{TOTAL_NODES}', str(len(graph['nodes'])))
html_content = html_content.replace('{TOTAL_EDGES}', str(len(graph['edges'])))
html_content = html_content.replace('{COMMUNITIES}', str(len(communities)))
html_content = html_content.replace('{NODES_JSON}', nodes_json)
html_content = html_content.replace('{EDGES_JSON}', edges_json)

with open('graphify-out/graph.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f'✓ Generated graph.html ({len(graph["nodes"])} nodes, {len(graph["edges"])} edges)')
print(f'✓ Detected {len(communities)} communities')
