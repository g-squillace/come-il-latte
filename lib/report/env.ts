export function readEnv(name: string): string | null {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}

export function requireEnv(name: string): string {
  const value = readEnv(name);
  if (value === null) {
    throw new Error(`Variabile d'ambiente mancante: ${name}`);
  }
  return value;
}

export function missingList(names: string[]): string {
  const missing = names.filter((name) => readEnv(name) === null);
  return missing.length > 0 ? missing.join(', ') : 'credenziali non valide';
}
