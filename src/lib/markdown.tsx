'use client'

import prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.min.css'
import 'prismjs/components/prism-rust.min.js'
import 'prismjs/components/prism-go.min.js'
import 'prismjs/components/prism-javascript.min.js'
import 'prismjs/components/prism-typescript.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-markdown.min.js'
import 'prismjs/components/prism-bash.min.js'
import 'prismjs/plugins/toolbar/prism-toolbar.min.js'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js'
import 'prismjs/plugins/toolbar/prism-toolbar.min.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.css'
import { useEffect } from 'react'

export function Markdown({ content }: { content: string }) {
    useEffect(() => {
        prism.highlightAll()
    }, [])

    return (
        <div dangerouslySetInnerHTML={{ __html: content || '' }} />
    )
}
