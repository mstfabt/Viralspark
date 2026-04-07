'use client'

import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean; error: string }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">:(</div>
            <h2 className="text-xl font-semibold mb-2">Bir şeyler ters gitti</h2>
            <p className="text-gray-500 mb-6 text-sm max-w-md">{this.state.error || 'Beklenmeyen bir hata oluştu.'}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors text-sm"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
