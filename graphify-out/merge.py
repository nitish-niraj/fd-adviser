import json
from pathlib import Path
import sys

# Load all chunks
chunks = []
for chunk_file in sorted(Path('graphify-out').glob('.graphify_chunk_*.json')):
    with open(chunk_file) as f:
        chunk = json.load(f)
        chunks.append(chunk)
        print(f'{chunk_file.name}: {len(chunk.get("nodes", []))} nodes, {len(chunk.get("edges", []))} edges')

# Merge chunks
merged_nodes = []
merged_edges = []
merged_hyperedges = []
total_input = 0
total_output = 0
node_ids_seen = set()

for chunk in chunks:
    # Deduplicate nodes
    for node in chunk.get('nodes', []):
        if node['id'] not in node_ids_seen:
            merged_nodes.append(node)
            node_ids_seen.add(node['id'])
    
    # Add edges
    merged_edges.extend(chunk.get('edges', []))
    merged_hyperedges.extend(chunk.get('hyperedges', []))
    total_input += chunk.get('input_tokens', 0)
    total_output += chunk.get('output_tokens', 0)

# Load and merge AST
try:
    with open('graphify-out/.graphify_ast.json') as f:
        ast = json.load(f)
        for node in ast.get('nodes', []):
            if node['id'] not in node_ids_seen:
                merged_nodes.append(node)
                node_ids_seen.add(node['id'])
        merged_edges.extend(ast.get('edges', []))
        total_input += ast.get('input_tokens', 0)
        total_output += ast.get('output_tokens', 0)
except:
    pass

print(f'\nMerged: {len(merged_nodes)} nodes, {len(merged_edges)} edges, {len(merged_hyperedges)} hyperedges')
print(f'Tokens: {total_input} input, {total_output} output')

# Save merged graph
merged = {
    'nodes': merged_nodes,
    'edges': merged_edges,
    'hyperedges': merged_hyperedges,
    'stats': {
        'total_nodes': len(merged_nodes),
        'total_edges': len(merged_edges),
        'total_hyperedges': len(merged_hyperedges),
        'input_tokens': total_input,
        'output_tokens': total_output,
        'model': 'graphify-semantic-extraction-v1'
    }
}

with open('graphify-out/graph.json', 'w') as f:
    json.dump(merged, f, indent=2)

print('✓ Saved graph.json')
