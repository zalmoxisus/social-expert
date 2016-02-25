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
  const obj = state[host];
  const index = obj.result.indexOf(id);
  if (index === -1) return state;
  const result = [...obj.result];
  result.splice(index, 1);
  const posts = { ...obj.entities.posts };
  delete posts[id];
  return { ...state,
    [host]: {
      ...state[host],
      entities: { ...obj.entities, posts },
      result
    }
  };
}

export function groupByTarget(feed) {
  let posts = [];
  let targets = [];
  let post;
  let index;

  for (let i = 0; i < feed.result.length; i++) {
    post = feed.entities.posts[feed.result[i]];
    index = targets.indexOf(post.target);
    if (index === -1) {
      posts.push([post]);
      targets.push(post.target);
    }
    else posts[index].push(post);
  }
  return { targets, posts };
}

export function reorder(state, host, fromObj, toObj) {
  const dragListId = fromObj.listIdx;
  const dragId = fromObj.id;
  const dropListId = toObj.listIdx;
  const dropId = toObj.id;

  const data = state[host].withMutations(source => {
    let dragList = source.get('groups').get(dragListId);
    const dragIndex = dragList.findIndex(item => item === dragId);
    const dragItem = dragList.get(dragIndex);
    source.setIn(['groups', dragListId], dragList.delete(dragIndex));

    let dropList = source.get('groups').get(dropListId);
    let dropIndex = dropList.findIndex(item => item === dropId);
    if (dropIndex === -1) dropIndex = dropList.size;
    source.setIn(['groups', dropListId], dropList.splice(dropIndex, 0, dragItem));

    if (dragListId !== dropListId) {
      source.setIn(['targets', dragItem, 'priority'], dropListId);
    }
  });

  return { [host]: data };
}
