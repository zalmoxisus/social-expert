import { showNotification } from '../services/electron';

export default function notify(feed) {
  const id = feed.result[0];
  const post = feed.entities.posts[id];
  const target = feed.entities.targets[post.target];
  showNotification(target.owner + '/' + target.name, post.subject, target.avatar);
}
