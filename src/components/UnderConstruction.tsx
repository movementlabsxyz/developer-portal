import Link from 'next/link'

export default function UnderConstruction() {
    return (
        <div className="under-construction">
            <div className="container">
                <div className="content">
                    <h1>We&apos;re Under Construction</h1>
                    <p>This page is temporarily unavailable. For now, head over to the Movement docs:</p>
                    <Link 
                        href="https://docs.movementnetwork.xyz/devs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-yellow"
                    >
                        Visit Movement Docs
                    </Link>
                </div>
            </div>
        </div>
    )
}
