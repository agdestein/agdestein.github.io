import { works } from '../../../data/works'

// Resolve the thumbnail for a list entry. Precedence: the entry's own image
// (absolute path, or a bare filename resolved against /<dir>/), then the
// shared work thumbnail, then the list's default.
export default function thumbnail(
    image: string | undefined,
    work: string | undefined,
    dir: string,
): string {
    if (image) return image.startsWith('/') ? image : `/${dir}/${image}`
    const w = work ? (works as Record<string, { image?: string }>)[work] : undefined
    if (w?.image) return w.image
    return `/${dir}/default.svg`
}
