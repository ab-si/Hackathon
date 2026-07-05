import { useEffect, useRef } from 'react';

export interface PresentationShortcutHandlers {
  onPrev?: () => void;
  onNext?: () => void;
  onFullscreen?: () => void;
  onDemo?: () => void;
  onGithub?: () => void;
  onHome?: () => void;
  onToggleNotes?: () => void;
  onEscape?: () => void;
}

export function usePresentationShortcuts(handlers: PresentationShortcutHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;
      if (isTyping) return;

      const h = handlersRef.current;
      switch (e.key) {
        case 'ArrowLeft':
          if (!h.onPrev) return;
          h.onPrev();
          break;
        case 'ArrowRight':
          if (!h.onNext) return;
          h.onNext();
          break;
        case 'f':
        case 'F':
          if (!h.onFullscreen) return;
          h.onFullscreen();
          break;
        case 'd':
        case 'D':
          if (!h.onDemo) return;
          h.onDemo();
          break;
        case 'g':
        case 'G':
          if (!h.onGithub) return;
          h.onGithub();
          break;
        case 'h':
        case 'H':
          if (!h.onHome) return;
          h.onHome();
          break;
        case 'n':
        case 'N':
          if (!h.onToggleNotes) return;
          h.onToggleNotes();
          break;
        case 'Escape':
          if (!h.onEscape) return;
          h.onEscape();
          break;
        default:
          return;
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
