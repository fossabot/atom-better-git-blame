'use babel';

import IEditor = AtomCore.IEditor;
import { CompositeDisposable } from 'atom';
import _ from 'lodash';

class SelectionWatcher {
  editor: IEditor;
  selectionHandler: Function;
  subscriptions: Array<any>;

  constructor(editor: IEditor) {
    this.subscriptions = new CompositeDisposable();
    this.editor = editor;
    this.subscriptions.add(
      this.editor.onDidChangeSelectionRange(() => {
        this.getSelections();
      })
    );
  }

  onSelection(selectionsCallback) {
    if (typeof selectionsCallback === 'function') {
      this.selectionHandler = _.debounce(selectionsCallback, 200);
    } else {
      throw new Error('Event listeners must supply a callback');
    }
  }

  getSelections() {
    let selectionRanges = this.editor.selections.map(selection => {
      return selection.getBufferRange();
    });
    this.selectionHandler(selectionRanges);
  }
}

export default SelectionWatcher;
