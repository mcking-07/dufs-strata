import { useCallback, useState } from 'react';
import type { ToastKindType, ToastType } from '../types';

const useToast = () => {
  const [toast, set_toast] = useState<ToastType | null>(null);
  const notify = useCallback((message: string, kind: ToastKindType = 'info') => set_toast({ id: Date.now(), message, kind }), []);
  const dismiss = useCallback(() => set_toast(null), []);
  return { toast, notify, dismiss };
};

export { useToast };
