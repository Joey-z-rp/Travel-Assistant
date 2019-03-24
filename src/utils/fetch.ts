export default function fetch(url: string, options?: object): Promise<any> {
    return window.fetch(url, {
        headers: { Accept: 'application/json' },
        mode: 'cors',
        ...options,
    }).then(response => response.json());
}
