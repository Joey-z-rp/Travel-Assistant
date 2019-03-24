// action types

export const HOVER_ON_COUNTRY = 'HOVER_ON_COUNTRY';

// action creators

export function hoverOnCountry(country: string) {
    return { country, type: HOVER_ON_COUNTRY };
}
