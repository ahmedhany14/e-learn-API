function set_hash() {
    const AccountTypes = new Map<string, {}>();
    AccountTypes.set('active', {
        is_active: true,
    });
    AccountTypes.set('de-activated', {
        is_active: false,
    });
    AccountTypes.set('banned', {
        has_been_banned: true,
    });

    return AccountTypes;
}
export function transformUserType(type: string) {
    const data = set_hash();
    return data.get(type);
}