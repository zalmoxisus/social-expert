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
    if (source.getIn([host, 'groups', targetId]).size > 1) {
      source.deleteIn([host, 'groups', targetId, id]);
    } else {
      source.deleteIn([host, 'groups', targetId]);
    }
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

const getPriority = (subs, a) => subs.getIn(['targets', a[0].toString(), 'priority']);
const getWeight = (subs, pr, a) => subs.getIn(['groups', pr]).indexOf(a[0].toString());

export function reorderFeed(feed, subs, order) {
  const groups = feed.get('groups').entrySeq();
  if (!order || !subs) return groups;
  return groups.sort((a, b) => {
    const aPr = getPriority(subs, a);
    const bPr = getPriority(subs, b);
    return order === 2 && aPr === bPr
      ? getWeight(subs, aPr, a) - getWeight(subs, bPr, b)
      : aPr - bPr;
  });
}

export function filterFeed(feed, subs, section) {
  const groups = feed.get('groups').entrySeq();
  if (!section || !subs) return feed.get('groups').entrySeq();
  return groups.filter(id => getPriority(subs, id) === section - 1);
}
