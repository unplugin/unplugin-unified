import 'github-markdown-css/github-markdown.css'
import './style.css'

// @ts-expect-error type
import content from '../README.md'

document.getElementById('app')!.innerHTML = content
