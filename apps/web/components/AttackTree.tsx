import { AlertTriangle, Shield, AlertCircle, Info } from 'lucide-react';

interface AttackTreeNode {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  children?: AttackTreeNode[];
}

interface AttackTreeProps {
  nodes: AttackTreeNode[];
}

const severityIcons = {
  critical: AlertTriangle,
  high: AlertCircle,
  medium: Shield,
  low: Info
};

const severityColors = {
  critical: 'border-red-500 bg-red-500/10 text-red-500',
  high: 'border-orange-500 bg-orange-500/10 text-orange-500',
  medium: 'border-yellow-500 bg-yellow-500/10 text-yellow-500',
  low: 'border-blue-500 bg-blue-500/10 text-blue-500'
};

function TreeNode({ node }: { node: AttackTreeNode }) {
  const Icon = severityIcons[node.severity];
  const colors = severityColors[node.severity];

  return (
    <div className="space-y-2">
      <div className={`rounded-lg border p-4 ${colors}`}>
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold">{node.name}</h3>
            <p className="mt-1 text-sm opacity-90">{node.description}</p>
            <div className="mt-2">
              <span className="inline-block rounded-full px-2 py-1 text-xs font-medium uppercase">
                {node.severity}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {node.children && node.children.length > 0 && (
        <div className="ml-6 space-y-2 border-l-2 border-zinc-700 pl-4">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AttackTree({ nodes }: AttackTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <p className="text-zinc-400">Waiting for attack tree generation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      {nodes.map(node => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
}
