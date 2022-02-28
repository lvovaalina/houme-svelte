
   
import { derived } from 'svelte/store';
import { dictionary, locale, _ } from 'svelte-i18n';

const MESSAGE_FILE_URL_TEMPLATE = '/langs/{locale}.json';

let cachedLocale;

function setupI18n({ withLocale: _locale } = { withLocale: 'pl' }) {
    const messsagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', _locale);

    return fetch(messsagesFileUrl, {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then((messages) => {
            dictionary.set({ [_locale]: messages });

            cachedLocale = _locale;

            locale.set(_locale);
        });
}

function formatDate(date, options) {
    return new Intl.DateTimeFormat(cachedLocale, options)
        .format(new Date(date));
}

const isLocaleLoaded = derived(locale, $locale => typeof $locale === 'string');

export { _, locale, setupI18n, formatDate, isLocaleLoaded };