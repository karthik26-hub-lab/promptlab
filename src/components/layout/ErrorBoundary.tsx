/*
  Safety net: if any page crashes, show a calm message instead of a blank screen.
  Your progress is in localStorage, so reloading is always safe.
  (React only supports this as a class component.)
*/
import { Component, type ReactNode } from "react";

interface State {
  crashed: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, State> {
  state: State = { crashed: false };

  static getDerivedStateFromError(): State {
    return { crashed: true };
  }

  // Moving to another page clears the error, so one broken page doesn't block the app.
  componentDidUpdate(prev: { resetKey?: string }) {
    if (this.state.crashed && prev.resetKey !== this.props.resetKey) this.setState({ crashed: false });
  }

  render() {
    if (!this.state.crashed) return this.props.children;
    return (
      <div className="card crash">
        <p className="label faint">Something went wrong</p>
        <h1 className="dot crash__title">Oops</h1>
        <p className="muted">
          This page hit a problem. Your progress and saved prompts are safe. Try reloading, or pick another stage from
          the sidebar.
        </p>
        <div className="button-row">
          <button type="button" className="btn btn--primary label" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
