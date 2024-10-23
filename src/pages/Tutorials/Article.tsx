import TableOfContents from '@/components/Sidebar/TableOfContents'
import { Markdown } from '@/lib/markdown'
import { buildBreadCrumbs } from '@/lib/posts'

export default async function ArticlePage(props: { data: any }) {
    const breadCrumbs = buildBreadCrumbs(
        'Learning Paths',
        'Basic Concepts',
        props.data.title,
    )
    return (
        <div id="tutorials-wrap" className="subpage-wrap">
            <section className="contain">
                <div className="breadcrumbs">
                    {breadCrumbs.map((crumb, index) => (
                        <a key={index} href={crumb.link}>
                            {crumb.name}
                        </a>
                    ))}
                </div>
                <div className="page-intro">
                    <h1 className="title">{props.data.title.split('-')[1]}</h1>
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
                        <div className="content-group"></div>
                        <div className="tut-nav">
                            <a href="#" className="tut-arrow tut-prev">
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
                            </a>
                            <a href="#" className="tut-arrow tut-next">
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
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
