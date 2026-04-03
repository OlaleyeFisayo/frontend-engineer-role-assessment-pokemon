"use client";

import type { ReactNode } from "react";
import { Component } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class GridErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-slate-800 bg-slate-900 p-8 text-center">
          <div className="mb-4 rounded-xl border-2 border-slate-700 bg-green-900 px-6 py-4">
            <p className="font-mono text-sm text-green-300">CONNECTION FAILED</p>
          </div>
          <p className="mb-4 font-mono text-sm text-white/70">
            Could not reach the Pokédex database.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="rounded-lg border-2 border-green-300 bg-slate-900 px-6 py-2 font-mono text-sm font-bold text-green-300 transition-colors hover:bg-slate-800"
          >
            RETRY &gt;&gt;
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
