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
import 'prismjs/components/prism-ruby.min.js'
import 'prismjs/plugins/toolbar/prism-toolbar.min.js'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js'
import 'prismjs/plugins/toolbar/prism-toolbar.min.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.css'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import styles from '../styles/markdown.module.scss'

export function Markdown({ content }: { content: string }) {
    const pathname = usePathname()
    useEffect(() => {
        prism.highlightAll()
    }, [pathname])

    return (
        <div className={styles.markdown} dangerouslySetInnerHTML={{ __html: content || '' }} />
    )
}
