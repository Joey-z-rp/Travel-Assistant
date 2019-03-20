export default function fetch(url: string, options?: object) {
    return fetch(url, {
        headers: { Accept: 'application/json' },
        mode: 'cors',
        ...options,
    }).then(response => response.json());
}
