import { writable } from 'svelte/store';

export const pageTitle = writable({});

export const projectStored = writable({});

export const propertiesStored = writable([]);

export const adminAuthentificated = writable(false);

export const adminStored = writable({})

export const responsive = writable(false);