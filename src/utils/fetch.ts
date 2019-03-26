import { IFetchOptions } from '../interfaces/utils/fetch';

const cache: { [key: string]: any } = {};

export default function fetch(url: string, options: IFetchOptions = {}): Promise<any> {
    if (cache[url]) return Promise.resolve(cache[url]);

    return window.fetch(url, {
        headers: { Accept: 'application/json' },
        mode: 'cors',
        ...options,
        cache: undefined,
    })
        .then(response => response.json())
        .then((json) => {
            if (options.cache && (!options.method || options.method === 'GET')) cache[url] = json;
            return json;
        });
}
