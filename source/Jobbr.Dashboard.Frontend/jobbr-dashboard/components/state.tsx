import React from "react";

const StateToClassName = (state: string) => {
    switch(state) {
        case 'Null': return '';
        case 'Scheduled': return '';
        case 'Preparing': return 'text-warning';
        case 'Starting': return 'text-warning';
        case 'Started': return 'text-warning';
        case 'Connected': return 'text-warning';
        case 'Initializing': return 'text-warning';
        case 'Processing': return 'text-warning';
        case 'Finishing': return 'text-warning';
        case 'Collecting': return 'text-warning';
        case 'Completed': return 'text-success';
        case 'Failed': return 'text-danger';
        case 'Deleted': return 'text-info';
        case 'Omitted': return 'text-info';
  
        default: return '';
    }
}

export default function State({ state }) {
    const className = StateToClassName(state);
    return <span className={className}>{state}</span>;
}