import { List, OrderedMap } from 'immutable';

export function removeEntityByTarget(state, host, id) {
  const obj = state[host];
  let targets = obj.entities.targets;
  if (!targets[id]) return state;
  targets = { ...targets };
  delete targets[id];
  const result = [...obj.result];
  const posts = { ...obj.entities.posts };

  for (let i = result.length - 1; i >= 0; i--) {
    const idx = result[i];
    const post = posts[idx];
    if (post.target === id) {
      result.splice(i, 1);
      delete posts[idx];
    }
  }

  return { ...state,
    [host]: {
      ...state[host],
      entities: { ...obj.entities, posts, targets },
      result
    }
  };
}

export function removeEntity(state, host, id, target) {
  if (target) return removeEntityByTarget(state, host, id, target);
  return state.withMutations(source => {
    source.deleteIn([host, 'entities', 'posts', id]);
    source.setIn(
      [host, 'result'],
      source.getIn([host, 'result']).filterNot(r => r === id)
    );
  });
}

export function groupByTarget(feed) {
  const reducer = (targets, id) => {
    let post = feed.getIn(['entities', 'posts', id]);
    let target = post.get('target');
    return targets.set(target, targets.get(target, new List()).push(post));
  };
  return feed.get('result').reduce(reducer, new OrderedMap());
}

export function reorder(state, host, fromObj, toObj) {
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
