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

    let ids = [];
    for (let i = data.length - 1; i >= 0; i--) {
      for (let j = data[i].length - 1; j >= 0; j--) {
        const target = data[i][j];
        const id = target.id.toString();
        ids.push(id);
        let priority = 1;
        if (targets) priority = targets.getIn([id, 'priority']) || 1;
        else if (target.fork && !target.stargazers_count) priority = 2;
        else if (target.owner.login === login) priority = 0;
        source.setIn([host, 'targets', id], Map({
          id,
          name: target.name,
          owner: target.owner.login,
          avatar: target.owner.avatar_url,
          url: target.owner.html_url,
          priority
        }));
        if (!targets || !source.getIn([host, 'groups', priority]).contains(id)) {
          source.updateIn([host, 'groups', priority], List(), pushInList(id));
        }
      }
    }

    // Remove unsubscribed targets
    if (targets) {
      targets.forEach(target => {
        const id = target.get('id');
        if (ids.indexOf(id) === -1) {
          source.setIn(
            [host, 'groups', target.get('priority')],
            source.getIn([host, 'groups', target.get('priority')]).filter(r => r !== id)
          );
          source.deleteIn([host, 'targets', id]);
        }
      });
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
