import React from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[PixelBlog] Error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '2rem',
          background: '#000',
          color: '#ff00ff',
          fontFamily: 'monospace',
          border: '2px solid #ff00ff'
        }}>
          <h3>🕹️ PIXEL_BLOG ERROR</h3>
          <p>Something went wrong in the matrix.</p>
          <pre style={{ fontSize: '0.8rem', color: '#666' }}>
            {this.state.error?.message}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}
