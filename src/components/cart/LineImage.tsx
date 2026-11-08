import { FACE_BY_ID, type FaceId } from '../../data/product';

/** Miniatura de una línea: una cara o un mosaico con las caras del pack. */
export function LineImage({ faces, size = 'md' }: { faces: FaceId[]; size?: 'sm' | 'md' }) {
  const unique = [...new Set(faces)];
  const box = size === 'sm' ? 'h-16 w-16' : 'h-[88px] w-[88px] md:h-[100px] md:w-[100px]';
  if (unique.length === 1) {
    return (
      <img
        src={FACE_BY_ID[unique[0]].image}
        alt={FACE_BY_ID[unique[0]].name}
        className={`${box} shrink-0 rounded-[10px] bg-white object-cover ring-1 ring-ink/[0.06]`}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`${box} grid shrink-0 grid-cols-2 gap-px overflow-hidden rounded-[10px] bg-ink/[0.06] ring-1 ring-ink/[0.06] ${
        unique.length > 2 ? 'grid-rows-2' : 'grid-rows-1'
      }`}
    >
      {Array.from({ length: unique.length > 2 ? 4 : 2 }, (_, i) => {
        const f = unique[i];
        return f ? (
          <img key={i} src={FACE_BY_ID[f].image} alt={FACE_BY_ID[f].name} className="h-full w-full bg-white object-cover" loading="lazy" />
        ) : (
          <span key={i} className="bg-white" />
        );
      })}
    </div>
  );
}

/** "Lengua fuera ×2, Chomp" */
export function summarizeFaces(faces: FaceId[]): string {
  const counts = new Map<FaceId, number>();
  for (const f of faces) counts.set(f, (counts.get(f) ?? 0) + 1);
  return [...counts].map(([f, n]) => (n > 1 ? `${FACE_BY_ID[f].name} ×${n}` : FACE_BY_ID[f].name)).join(', ');
}
