import { Component, type ErrorInfo, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error in app tree', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-medium">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          {this.state.error.message}
        </p>
        <Button onClick={() => this.setState({ error: null })}>
          Try again
        </Button>
      </div>
    )
  }
}
