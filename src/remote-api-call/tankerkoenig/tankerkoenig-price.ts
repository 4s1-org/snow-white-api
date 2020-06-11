// ToDo: In dto ändern
// ToDo: Weg vom Konstruktor Pattern
export class TankerkoenigPrice {
  constructor (
    public readonly remoteId: string,
    public readonly status: 'open' | 'closed' | 'no prices',
    public readonly e5: number | false,
    public readonly e10: number | false,
    public readonly diesel: number | false
  ) { }
}
