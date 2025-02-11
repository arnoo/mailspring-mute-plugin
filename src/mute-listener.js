import _ from 'underscore';
import {
  Thread,
  Actions,
  AccountStore,
  Message,
  SoundRegistry,
  NativeNotifications,
  DatabaseStore,
  localized,
  DatabaseChangeRecord,
  TaskFactory,
  ChangeFolderTask
} from 'mailspring-exports';

const WAIT_FOR_CHANGES_DELAY = 400;

export class MuteListener {

  constructor() {
    this.listen();
  }
  
  listen() {
    this.unlisten = DatabaseStore.listen(this._onDatabaseChanged, this);
  }

  // async for testing
  async _onDatabaseChanged({ objectClass, objects, objectsRawJSON }) {
    if (objectClass === Thread.name) {
      this._onThreadsChanged(objects);
      this.unlisten();
      setTimeout(() => { this.listen(); }, WAIT_FOR_CHANGES_DELAY);
    }
  }

  _onThreadsChanged(threads) {
    var mutedThreads = threads.filter(({id, unread}) => localStorage.getItem('muted-thread-'+id));
    mutedThreads.forEach((t) => {
      console.log("Thread "+t.id+ "is Muted. Archiving.");
    });
    const tasks = TaskFactory.tasksForArchiving({
      threads: mutedThreads,
      source: 'Mute',
    });
    Actions.queueTasks(tasks);
  }
}
