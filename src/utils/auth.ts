export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function setCurrentUser(user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('current_user', JSON.stringify(user));
  }
}
