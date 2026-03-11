export interface IHashCompare {
  compare(value: string, hash: string): Promise<boolean>
}

export interface IHashGenerate {
  hash(value: string): Promise<string>
}
