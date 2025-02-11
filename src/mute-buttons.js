import { Actions, FocusedPerspectiveStore, PropTypes, React, ReactDOM, TaskFactory, Thread } from 'mailspring-exports';
import { BindGlobalCommands} from 'mailspring-component-kit';

function mute(threads) {
  threads.forEach((t) => {
    console.log("Muting thread "+t.id);
    localStorage.setItem('muted-thread-'+t.id, 1);
    });
  const tasks = TaskFactory.tasksForArchiving({
      threads: threads,
      source: 'Mute',
    });
  Actions.queueTasks(tasks);
}

class MuteButton extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    threads: PropTypes.array,
    direction: PropTypes.string,
    shouldRenderIconImg: PropTypes.bool,
    getBoundingClientRect: PropTypes.func,
  };

  static defaultProps = {
    className: 'btn btn-toolbar',
    direction: 'down',
    shouldRenderIconImg: true,
    getBoundingClientRect: inst =>
      ReactDOM.findDOMNode(inst).getBoundingClientRect(),
  };



  onClick = (event) => {
    if (event) {
      event.stopPropagation();
    }
    const { threads } = this.props;
    mute(threads);
  };

  render() {
    return (
      <button
        title="Mute"
        tabIndex={-1}
        className={`Mute-button ${this.props.className}`}
        onClick={this.onClick}
      >
        {this.props.shouldRenderIconImg ? (
          <img name="mute.png" />
        ) : null}
      </button>
    );
  }
}

export class QuickActionMute extends React.Component {
  static displayName = 'QuickActionMute';

  static propTypes = {
    thread: PropTypes.object,
  };

  static containerRequired = false;

  getBoundingClientRect = () => {
    // Grab the parent node because of the zoom applied to this button. If we
    // took this element directly, we'd have to divide everything by 2
    const element = ReactDOM.findDOMNode(this).parentNode;
    const { height, width, top, bottom, left, right } = element.getBoundingClientRect();

    // The parent node is a bit too much to the left, lets adjust this.
    return { height, width, top, bottom, right, left: left + 5 };
  };

  render() {
    if (!FocusedPerspectiveStore.current().isInbox()) {
      return <span />;
    }
    return (
      <MuteButton
        direction="left"
        threads={[this.props.thread]}
        className="btn action action-Mute"
        shouldRenderIconImg={false}
        getBoundingClientRect={this.getBoundingClientRect}
      />
    );
  }
}

export class ToolbarMute extends React.Component {
  static displayName = 'ToolbarMute';

  static propTypes = {
    items: PropTypes.array,
  };

  static containerRequired = false;

  render() {
    if (!FocusedPerspectiveStore.current().isInbox()) {
      return <span />;
    }
    return (
      <BindGlobalCommands commands={{ 'core:Mute-item': () => this._btn.onClick() }}>
        <MuteButton threads={this.props.items} ref={b => (this._btn = b)} />
      </BindGlobalCommands>
    );
  }
}
