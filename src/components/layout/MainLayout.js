

export default function MainLayout({ children, ...rest }) {
    return (
        <>
            <div className="bg-white px-3 mb-5">
                <main>
                    <div className="py-3">{children}</div>
                </main>
            </div>
        </>
    )
}