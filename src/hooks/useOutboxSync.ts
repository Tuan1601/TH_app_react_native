import { useSync } from '../context/SyncContext';

export default function useOutboxSync() {
  const { pendingCount, syncing, syncNow } = useSync();
  return { pendingCount, syncing, syncNow };
}
