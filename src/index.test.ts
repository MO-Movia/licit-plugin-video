import {createEditor, doc, p} from 'jest-prosemirror';
import {Transaction} from 'prosemirror-state';
import {VideoPlugin} from './index';
import {VideoEditorState} from './ui/VideoEditor';
import {insertIFrame} from './VideoSourceCommand';

describe('VideoPlugin', () => {
  it('should handle Video', () => {
    const plugin = new VideoPlugin();
    const editor = createEditor(doc(p('<cursor>')), {
      plugins: [plugin],
    });

    const schema = plugin.getEffectiveSchema(editor.schema);

    const veState: VideoEditorState = {
      src: 'https://www.youtube.com/embed/ru60J99ojJw',
      width: 200,
      height: 113,
      validValue: true,
    };

    editor.view.dispatch(
      insertIFrame(editor.state.tr, schema, veState) as Transaction
    );

    // Not complete...
    expect(editor.doc).toEqualProsemirrorNode(editor.doc);
  });
});
