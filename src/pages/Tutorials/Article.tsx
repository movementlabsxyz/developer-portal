import BreadCrumbs from '@/components/Breadcrumbs/BreadCrumbs'
import TableOfContents from '@/components/Sidebar/TableOfContents'
import { Markdown } from '@/lib/markdown'
import { buildBreadCrumbs } from '@/lib/posts'
import { DirectoryNode } from '@/types/posts'
import Link from 'next/link'

export default function ArticlePage(props: { 
    data: any,
    category: DirectoryNode | undefined
}) {

    if (!props.data || !props.category) {
        return null
    }

    return (
        <div id="tutorials-wrap" className="subpage-wrap">
            <section className="contain">
                <BreadCrumbs contain={false}>
                    <Link href="/learning-paths">Learning Paths</Link>
                    <Link href={`/${props.category.link}`}>{props.category.name}</Link>
                </BreadCrumbs>

                <div className="page-intro">
                    <h1 className="title">{props.data.title ? props.data.title.split('-')[1] : ""}</h1>
                    <p className="body-24">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>
                <div className="tutorial-content">
                    <div className="col col-lt sidebar">
                        <div className="inner">
                            <h4 id="index-heading">On This Page</h4>
                            {/* <!-- ADD CLASS '.ACTIVE' TO 'H4#INDEX-HEADING' TO TRIGGER ACTIVE STATE --> */}
                            <TableOfContents tableOfContents={props.data.tableOfContents} />
                        </div>
                    </div>
                    <div className="col col-rt">
                        <div className="content-group">
                            <Markdown content={props.data.contentHtml || ''} />
                        </div>
                        <div className="tut-nav">
                            <Link href="#" className="tut-arrow tut-prev">
                                <span className="icon">
                                    <svg
                                        width="9"
                                        height="12"
                                        viewBox="0 0 9 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M7.86805e-07 6L9 0.803848L9 11.1962L7.86805e-07 6Z" fill="" />
                                    </svg>
                                </span>
                                <span className="text">Getting Started</span>
                            </Link>
                            <Link href="#" className="tut-arrow tut-next">
                                <span className="text">Movement CLI</span>
                                <span className="icon">
                                    <svg
                                        width="9"
                                        height="12"
                                        viewBox="0 0 9 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M9 6L4.64275e-07 11.1962L9.18537e-07 0.803847L9 6Z" fill="" />
                                    </svg>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
