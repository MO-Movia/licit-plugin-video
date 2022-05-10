// Plugin to handle Citation.
import {Plugin, PluginKey} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Node, Schema} from 'prosemirror-model';
import VideoNodeView from './ui/VideoNodeView';
import {VIDEO} from './Constants';
import VideoNodeSpec from './VideoNodeSpec';
import OrderedMap from 'orderedMap';
import VideoFromURLCommand from './VideoFromURLCommand';
import { EditorFocused } from './ui/CustomNodeView';

// singleton instance of CitationPlugin
let siVideoPlugin: VideoPlugin;

// [FS] IRAD-1503 2021-07-02
// Fix: Update the private plugin classes as a named export rather than the default
export class VideoPlugin extends Plugin {
  _view: EditorView = null;
  constructor() {
    super({
      key: new PluginKey('VideoPlugin'),
      state: {
        init(_config, _state) {
          siVideoPlugin.spec.props.nodeViews[VIDEO] = bindVideoView.bind(this);
        },
        apply(_tr, _set) {
          //do nothing
        },
      },
      props: {
        nodeViews: {},
      },
    });
    if (siVideoPlugin) {
      return siVideoPlugin;
    }
    siVideoPlugin = this as VideoPlugin;
  }

  getEffectiveSchema(schema: Schema): Schema {
    const nodes = (schema.spec.nodes as OrderedMap).append({
      video: VideoNodeSpec,
    });
    const marks = schema.spec.marks;

    return new Schema({
      nodes: nodes,
      marks: marks,
    });
  }

  initButtonCommands() {
    return {
      '[video_label] Insert Video': new VideoFromURLCommand(),
    };
  }
}

export function bindVideoView(
  node: Node,
  view: EditorView,
  curPos: boolean | (() => number)
): VideoViewExt {
  return new VideoViewExt(node, view, curPos);
}

class VideoViewExt extends VideoNodeView {
  constructor(node: Node, view: EditorView, getCurPos) {
    super(node, view as EditorFocused, getCurPos, null);
  }
}
