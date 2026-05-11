"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Sem ErrorBoundary, qualquer erro de render no Index (ex.: dado nulo do EVO
// ou NocoDB) derruba toda a árvore React e a página fica preta — o body usa
// bg-background HSL(0 0% 2%) no tema dark. Aqui exibimos um fallback visível
// para que o usuário não veja uma tela completamente preta.
class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary capturou um erro:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 py-12 text-center">
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
            Algo deu errado
          </h1>
          <p className="text-white/60 max-w-md mb-8 text-sm md:text-base">
            Tivemos um problema ao carregar o conteúdo. Recarregue a página
            para tentar novamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="h-12 px-8 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-white/90 transition-colors"
          >
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
