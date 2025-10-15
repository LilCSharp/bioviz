import { NextResponse } from 'next/server';
import { db } from '../../_mock/db';

// Catch-all so IDs with "/" are supported, e.g. /api/folder/f%3Agallery%2Ftrips
export async function GET(_: Request, ctx: { params: Promise<{ id: string[] | string }> }) {
  const { id } = await ctx.params; // <-- await params in Next 14

  // Normalize to a single string and decode any %2F etc.
  const raw = Array.isArray(id) ? id.join('/') : id;
  const decodedId = decodeURIComponent(raw);

  const f = db.folders.get(decodedId);
  if (!f) return NextResponse.json({ error: 'not found' }, { status: 404 });

  // Build ancestor chain with real IDs + names
  const chain: { id: string; name: string }[] = [];
  let cur: string | undefined = decodedId;
  while (cur) {
    const node = db.folders.get(cur);
    if (!node) break;
    chain.push({ id: node.id, name: node.name });
    cur = node.parentId;
  }

  const root = db.folders.get(db.rootId)!;
  if (!chain.find((c) => c.id === root.id)) chain.push({ id: root.id, name: root.name });

  chain.reverse();
  return NextResponse.json({ path: chain });
}
