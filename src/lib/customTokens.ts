import type { Token } from '@/config/tokens';

const STORAGE_KEY = 'uv2ui_custom_tokens';

type StoredTokens = Record<number, Token[]>;

function load(): StoredTokens {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as StoredTokens;
  } catch {
    return {};
  }
}

function persist(data: StoredTokens) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCustomTokens(chainId: number): Token[] {
  return load()[chainId] ?? [];
}

export function addCustomToken(token: Token): void {
  const data = load();
  const existing = data[token.chainId] ?? [];
  if (existing.some((t) => t.address.toLowerCase() === token.address.toLowerCase())) return;
  data[token.chainId] = [...existing, token];
  persist(data);
}

export function removeCustomToken(chainId: number, address: string): void {
  const data = load();
  data[chainId] = (data[chainId] ?? []).filter(
    (t) => t.address.toLowerCase() !== address.toLowerCase(),
  );
  persist(data);
}
