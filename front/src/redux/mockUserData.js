export const mockUserData = {
  email: 'test@test.com',
  username: 'testuser',
  school: "test highschool",
  comments: [
    { id: 1, text: 'This is a mock comment.', postTitle: 'First Post', postId: 1 },
    { id: 2, text: 'This is another mock comment.', postTitle: 'Second Post', postId: 2 }
  ],
  posts: [
    { id: 1, title: 'Mock Post 1', content: 'Content of mock post 1' },
    { id: 2, title: 'Mock Post 2', content: 'Content of mock post 2' },
  ],
  likedPosts: [
    { id: 1, title: 'Liked Mock Post 1', content: 'Content of liked mock post 1' },
    { id: 2, title: 'Liked Mock Post 2', content: 'Content of liked mock post 2' },
  ],
};
