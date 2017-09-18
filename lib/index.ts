'use babel';

import IEditor = AtomCore.IEditor;
import IGutterView = AtomCore.IGutterView;
import SelectionWatcher from './stepsize/SelectionWatcher';
import StepsizeOutgoing from './stepsize/StepsizeOutgoing';
import StepsizeHelper from './stepsize/StepsizeHelper';
import { CompositeDisposable } from 'atom';
import GutterView from './interface/GutterView';
import os from 'os';
import * as ConfigManager from './ConfigManager';

import * as ColorScale from './interface/ColourScale';

let disposables = new CompositeDisposable();
let outgoing: StepsizeOutgoing;
let gutters: Map<IEditor, IGutterView> = new Map();

export const config = ConfigManager.getConfig();

export function activate(state) {
  disposables.add(
    atom.commands.add('atom-workspace', {
      'layer-atom:toggle': () => toggleGutterView(),
    })
  );
  if (os.platform() === 'darwin' && ConfigManager.get('searchInLayerEnabled')) {
    enableLayerSearch();
  } else {
    ConfigManager.set('searchInLayerEnabled', false);
  }
}

async function layerEditorObserver(editor: IEditor) {
  let watcher = new SelectionWatcher(editor);
  watcher.onSelection(function() {
    const event = outgoing.buildSelectionEvent(editor);
    outgoing.send(event);
  });
}

function enableLayerSearch() {
  StepsizeHelper.checkLayerInstallation()
    .then(() => {
      outgoing = new StepsizeOutgoing();
      atom.workspace.observeTextEditors(layerEditorObserver);
    })
    .catch(() => {
      ConfigManager.set('searchInLayerEnabled', false);
    });
}

function toggleGutterView() {
  const editor = atom.workspace.getActiveTextEditor();
  if (editor) {
    const gutter = gutters.get(editor);
    if (gutter) {
      if (gutter.isVisible()) {
        gutter.hide();
      } else {
        gutter.show();
      }
    } else {
      gutters.set(editor, new GutterView(editor, outgoing));
      ColorScale.setEditor(editor);
    }
  }
}

export function deactivate() {
  disposables.dispose();
}
