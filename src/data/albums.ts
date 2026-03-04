// Album metadata — display names mapped from folder IDs
export interface AlbumMeta {
    id: string         // exact folder name in src/assets/albums/
    title: string      // human-readable display name
    subtitle?: string  // optional romantic subtitle
}

export const ALBUMS: AlbumMeta[] = [
    { id: 'monthsary', title: 'Monthsary', subtitle: 'every month, a small forever' },
    { id: 'AFTER-CHURCH', title: 'After Church', subtitle: 'sunday sweetness' },
    { id: 'CHURCH-1', title: 'Church', subtitle: 'in the quiet together' },
    { id: 'EVENT-1', title: 'Event I', subtitle: 'dressed up for us' },
    { id: 'EVENT-2', title: 'Event II', subtitle: 'another night to remember' },
    { id: 'GYM-1', title: 'Gym Days', subtitle: 'growing stronger, together' },
    { id: 'GYM-2', title: 'Gym Vol. 2', subtitle: 'showing up for each other' },
    { id: 'GYM-2_39', title: 'Gym Moments', subtitle: 'the small victories' },
    { id: 'Hilltop-1', title: 'Hilltop', subtitle: 'above the noise of the world' },
    { id: 'JOGGING', title: 'Jogging', subtitle: 'side by side in motion' },
    { id: 'JOLLIBEE-1', title: 'Jollibee I', subtitle: 'honey stars & stolen glances' },
    { id: 'JOLLIBEE-2', title: 'Jollibee II', subtitle: 'our favourite table' },
    { id: 'MALL-1', title: 'Mall Strolls I', subtitle: 'wandering with you' },
    { id: 'MALL-2', title: 'Mall Strolls II', subtitle: 'holding hands between stores' },
    { id: 'RANDOM', title: 'Random', subtitle: 'the unplanned moments are the best' },
    { id: 'WILDSHAKE', title: 'Wildshake', subtitle: 'shaken, not stirred, just happy' },
]
