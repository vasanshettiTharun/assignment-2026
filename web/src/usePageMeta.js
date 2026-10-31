import { useEffect } from 'react'

// Updates the tab title and description when moving between pages.
// The tags for link previews are set by the server, see server/meta.js
export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
