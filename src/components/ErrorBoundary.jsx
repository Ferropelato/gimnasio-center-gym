import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error capturado por ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Algo salió mal</h2>
          <p>Por favor, recarga la página.</p>
          <button onClick={() => window.location.reload()}>
            Recargar Página
          </button>
          {this.state.error && (
            <details style={{ marginTop: '1rem', textAlign: 'left' }}>
              <summary>Detalles del error</summary>
              <pre style={{ fontSize: '0.875rem', overflow: 'auto' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
