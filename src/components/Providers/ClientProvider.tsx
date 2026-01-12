'use client'

import { ThemeProvider } from '@movementlabsxyz/movement-design-system'

export default function ClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="developer-portal-theme">
            {children}
        </ThemeProvider>
    )
}
