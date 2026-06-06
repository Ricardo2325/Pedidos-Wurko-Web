import { useState, useEffect, useRef } from 'react'

const DISMISSED_KEY = 'wurko_pwa_dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as Record<string, unknown>).MSStream
}

function isInStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

export default function InstallBanner() {
  const [showAndroid, setShowAndroid] = useState(false)
  const [showIOS, setShowIOS] = useState(false)
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isInStandalone()) return
    if (localStorage.getItem(DISMISSED_KEY)) return

    if (isIOS()) {
      // iOS no tiene beforeinstallprompt — mostrar instrucciones manuales
      const timer = setTimeout(() => setShowIOS(true), 3000)
      return () => clearTimeout(timer)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      deferredPrompt.current = e as BeforeInstallPromptEvent
      const timer = setTimeout(() => setShowAndroid(true), 3000)
      return () => clearTimeout(timer)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    try { localStorage.setItem(DISMISSED_KEY, '1') } catch { /* sin localStorage */ }
    setShowAndroid(false)
    setShowIOS(false)
  }

  async function install() {
    if (!deferredPrompt.current) return
    await deferredPrompt.current.prompt()
    const { outcome } = await deferredPrompt.current.userChoice
    if (outcome === 'accepted') deferredPrompt.current = null
    dismiss()
  }

  if (!showAndroid && !showIOS) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-surface px-4 py-4 shadow-2xl"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      {showAndroid && (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-brand-blue">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 15v4a2 2 0 002 2h14a2 2 0 002-2v-4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary">Añade Wurko a tu móvil</p>
            <p className="text-xs text-text-muted">Accede más rápido sin escanear el QR</p>
          </div>
          <button
            onClick={dismiss}
            className="shrink-0 text-xs text-text-muted px-2 py-1"
          >
            Ahora no
          </button>
          <button
            onClick={install}
            className="shrink-0 rounded-xl bg-brand-blue px-4 py-2 text-xs font-bold text-white"
          >
            Añadir
          </button>
        </div>
      )}

      {showIOS && (
        <div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-brand-blue">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">Añade Wurko a tu pantalla</p>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                Toca{' '}
                <span className="inline-flex items-center gap-0.5 font-semibold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="inline h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Compartir
                </span>
                {' '}y luego{' '}
                <span className="font-semibold">"Añadir a pantalla de inicio"</span>
              </p>
            </div>
            <button
              onClick={dismiss}
              className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-text-muted"
              aria-label="Cerrar"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
