import { List, Map, OrderedMap, fromJS } from 'immutable';

export function removeEntity(state, host, id, targetId, allFromTarget) {
  if (allFromTarget) {
    return state.withMutations(source => {
      const toDelete = source.getIn([host, 'groups', id]);
      source.setIn(
        [host, 'result'],
        source.getIn([host, 'result']).filterNot(r => toDelete.has(r))
      );
      source.deleteIn([host, 'groups', id]);
    });
  }

  return state.withMutations(source => {
    source.deleteIn([host, 'groups', targetId, id]);
    source.setIn(
      [host, 'result'],
      source.getIn([host, 'result']).filterNot(r => r === id)
    );
  });
}

export function groupByTarget(feed) {
  const reducer = (targets, id) => {
    let post = feed.entities.posts[id];
    let target = post.target;
    if (targets.has(target)) return targets.setIn([target, id], new Map(post));
    return targets.set(target, new OrderedMap([[id, new Map(post)]]));
  };
  const result = List(feed.result);
  return new Map({
    result,
    targets: fromJS(feed.entities.targets),
    groups: result.reduce(reducer, new OrderedMap())
  });
}

export function reorderSubs(state, host, fromObj, toObj) {
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
