import {createEditor, doc, p} from 'jest-prosemirror';
import {EditorState, Transaction} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {VideoPlugin} from './index';
import {VideoEditorState} from './ui/VideoEditor';
import VideoSourceCommand, {insertIFrame} from './VideoSourceCommand';
import 'jest-json';

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

    const state: EditorState = EditorState.create({
      schema: schema,
      selection: editor.selection,
      plugins: [new VideoPlugin()],
    });

    const newState = state.apply(
      insertIFrame(state.tr, schema, veState) as Transaction
    );

    new VideoSourceCommand().executeWithUserInput(
      state,
      editor.view.dispatch as (tr: Transform) => void,
      editor.view,
      veState
    );

    const json = state.doc.toJSON();
    const videoJSON = newState.doc.toJSON();

    expect(json).not.toEqual(videoJSON);

    expect(JSON.stringify(videoJSON)).toContain(
      JSON.stringify({
        type: 'video',
        attrs: {
          align: null,
          alt: '',
          crop: null,
          height: 113,
          rotate: null,
          src: 'https://www.youtube.com/embed/ru60J99ojJw',
          title: '',
          width: 200,
        },
      })
    );
  });
});
