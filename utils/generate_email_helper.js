export function randomEmail() {
    return `user_${Math.random().toString(36).substring(7)}@test.com`;
}
