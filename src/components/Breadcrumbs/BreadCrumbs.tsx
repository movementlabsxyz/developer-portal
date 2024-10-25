import Link from "next/link";

export default function BreadCrumbs(props: { 
    children: React.ReactNode;
    contain?: boolean | true;
 }) {
    return (
        <div className={`breadcrumbs ${props.contain && "contain"}`}>
            <Link href="/">Home</Link>
            {props.children}
        </div>
    )
}
