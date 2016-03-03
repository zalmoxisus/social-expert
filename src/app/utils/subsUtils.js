import { List, Map } from 'immutable';
import { IN } from './createReducer';

const pushInList = id => list => list.push(id);

export function storeSubs(state, { host, login, data }) {
  return state.withMutations(source => {
    source.set('status', IN);
    let targets = source.getIn([host, 'targets']);
    if (!targets) {
      source.setIn([host, 'targets'], Map());
      source.setIn([host, 'groups'], List([List(), List(), List()]));
    }

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const target = data[i][j];
        const id = target.id.toString();
        let priority = 1;
        if (targets) priority = targets.getIn([id, 'priority']);
        else if (target.owner.login === login) priority = 0;
        source.setIn([host, 'targets', id], Map({
          id,
          name: target.name,
          owner: target.owner.login,
          avatar: target.owner.avatar_url,
          url: target.owner.html_url,
          priority
        }));
        source.updateIn([host, 'groups', priority], List(), pushInList(id));
      }
    }
  });
}

export function reorderSubs(state, { host, fromObj, toObj }) {
  const dragListId = fromObj.listIdx;
  const dragId = fromObj.id;
  const dropListId = toObj.listIdx;
  const dropId = toObj.id;

  return state.withMutations(source => {
    let dragList = source.getIn([host, 'groups', dragListId]);
    const dragIndex = dragList.findIndex(item => item === dragId);
    const dragItem = dragList.get(dragIndex);
    source.setIn([host, 'groups', dragListId], dragList.delete(dragIndex));

    let dropList = source.getIn([host, 'groups', dropListId]);
    let dropIndex = dropList.findIndex(item => item === dropId);
    if (dropIndex === -1) dropIndex = dropList.size;
    source.setIn([host, 'groups', dropListId], dropList.splice(dropIndex, 0, dragItem));

    if (dragListId !== dropListId) {
      source.setIn([host, 'targets', dragItem, 'priority'], dropListId);
    }
  });
}
