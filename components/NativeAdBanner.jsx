// DEPRECATED — superseded by components/AdSlot.jsx.
//
// This component was a Google AdSense placeholder that rendered a per-placement
// container id and a "configure your ad provider" empty state. NameVerse now
// serves Adsterra, whose banner script targets one fixed container id, so the
// per-placement ids here were dead weight and the empty state was visible to
// users on every hub page.
//
// It is now a thin re-export of AdSlot, so any lingering import renders the
// real ad slot instead of an empty placeholder.
// Safe to delete once no import remains.

export { default } from './AdSlot.jsx';
