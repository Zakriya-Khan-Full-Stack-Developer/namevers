// DEPRECATED — superseded by components/AdSlot.jsx.
//
// This file previously rendered its own copy of the Adsterra container id
// (`container-c90e1cf06dc7451f1fd3d33c703af951`). Because the banner script
// fills only the FIRST matching element, having the id defined in two places
// meant one slot silently never filled.
//
// It is now a thin re-export of AdSlot, so any lingering import still renders
// the single canonical container instead of creating a duplicate id.
// Safe to delete once no import remains.

export { default, AD_CONTAINER_ID } from './AdSlot.jsx';
