import BreadCrumbs from '@/components/Breadcrumbs/BreadCrumbs'
import TableOfContents from '@/components/Sidebar/TableOfContents'
import { Markdown } from '@/lib/markdown'
import { buildBreadCrumbs } from '@/lib/posts'
import { DirectoryNode } from '@/types/posts'
import Link from 'next/link'

export default function ArticlePage(props: { 
    data: any,
    category: DirectoryNode | undefined
    subCategory?: DirectoryNode | undefined
}) {

    if (!props.data || !props.category) {
        return null
    }

    return (
        <div id="tutorials-wrap" className="subpage-wrap line-numbers">
            <section className="contain">
                <BreadCrumbs contain={false}>
                    <Link href="/learning-paths">Learning Paths</Link>
                    <Link href={`/learning-paths/${props.category.link}`}>{props.category.name}</Link>
                    { props.subCategory && <Link href={`/learning-paths/${props.category.link}/${props.subCategory.link}`}>{props.subCategory.name.includes('-') ? props.subCategory.name.split('-')[1] : props.subCategory.name}</Link> }
                </BreadCrumbs>

                <div className="page-intro">
                    <h1 className="title">{props.data.title ? props.data.title.split('-')[1] : ""}</h1>
                </div>
                <div className="tutorial-content">
                    { props.data.tableOfContents.length > 0 && (
                    <div className="col col-lt sidebar">
                        <div className="inner">
                            <TableOfContents tableOfContents={props.data.tableOfContents} />
                        </div>
                    </div>
                    )}
                    <div className={`col ${props.data.tableOfContents.length > 0 ? 'col-rt' : ''}`}>
                        <div className="content-group">
                            <Markdown content={props.data.contentHtml || ''} />
                        </div>
                        <div className="tut-nav">
                            {props.data.prevPage && (
                                <Link href={props.data.prevPage} className="btn btn-yellow tut-arrow tut-prev">
                                    <span className="icon">
                                        <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.15997 10.56L3.61997 6L8.15997 1.44L6.71997 0L0.719971 6L6.71997 12L8.15997 10.56Z" fill="currentColor"/>
                                        </svg>
                                    </span>
                                    <span>Previous</span>
                                </Link>
                            )}
                            {props.data.nextPage && (
                                <Link href={props.data.nextPage} className="btn btn-yellow tut-arrow tut-next">
                                    <span>Next</span>
                                    <span className="icon">
                                        <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.719971 10.56L5.25997 6L0.719971 1.44L2.15997 0L8.15997 6L2.15997 12L0.719971 10.56Z" fill="currentColor"/>
                                        </svg>
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
