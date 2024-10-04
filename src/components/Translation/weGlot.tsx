import Script from 'next/script'

export default function WeGlot() {
    return (
        <>
            <script defer type="text/javascript" src="https://cdn.weglot.com/weglot.min.js"></script>
            <Script id="weglot-init">{`Weglot.initialize({api_key: 'wg_d6ced877badd2aada4f29e4eb613ce8e4', switchers:[ { location: { target: '.lang-selector'}, style: { full_name: false }}]})`}</Script>
        </>
    )
}
