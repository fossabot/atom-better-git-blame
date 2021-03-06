'use babel';

class GutterRange {
  public identifier: string | number;
  public range: {
    start: number;
    end: number;
  };

  constructor(currentLine: number, identifier?: string | number) {
    if (identifier) {
      this.identifier = identifier;
    }
    this.range = {
      start: currentLine,
      end: currentLine,
    };
  }

  public incrementRange() {
    this.range.end = this.range.end + 1;
  }

  public toAtomRange() {
    return [[this.range.start, 0], [this.range.end, 900000]];
  }
}
export default GutterRange;
