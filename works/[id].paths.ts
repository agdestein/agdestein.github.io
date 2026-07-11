import { works } from '../data/works'

export default {
  paths: () => Object.keys(works).map((id) => ({ params: { id } })),
}
