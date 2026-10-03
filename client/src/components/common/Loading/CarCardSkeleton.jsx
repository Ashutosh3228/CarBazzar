import React from 'react';
import Skeleton from './Skeleton';

/**
 * CarCardSkeleton Component
 * Matches the planned CarBazaar car listing card geometry.
 * Provides instant visual feedback while car listings are being fetched.
 */
export const CarCardSkeleton = ({ className = '' }) => {
  return (
    <div
      className={`cb-car-card-skeleton ${className}`}
      style={{
        backgroundColor: 'var(--cb-bg-card)',
        borderRadius: 'var(--cb-radius-lg)',
        border: '1px solid var(--cb-border-subtle)',
        overflow: 'hidden',
        boxShadow: 'var(--cb-shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Image Area Skeleton */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '60%', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Skeleton width="100%" height="100%" radius="0" />
        </div>
        {/* Featured / Verified Badge Skeleton */}
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
          <Skeleton width={80} height={24} radius="var(--cb-radius-full)" />
        </div>
        {/* Favorite Icon Skeleton */}
        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {/* Title and Year */}
        <div>
          <Skeleton width="80%" height="22px" radius="var(--cb-radius-sm)" />
          <div style={{ marginTop: '8px' }}>
            <Skeleton width="45%" height="14px" radius="var(--cb-radius-sm)" />
          </div>
        </div>

        {/* Specs Grid (Fuel, Transmission, Km, Location) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            padding: '10px',
            borderRadius: 'var(--cb-radius-md)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton width="60%" height="12px" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton width="70%" height="12px" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton width="55%" height="12px" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton width="65%" height="12px" />
          </div>
        </div>

        {/* Price & Action Button Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid var(--cb-border-subtle)'
          }}
        >
          <div>
            <Skeleton width={90} height={24} radius="var(--cb-radius-sm)" />
          </div>
          <div>
            <Skeleton width={110} height={36} radius="var(--cb-radius-md)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCardSkeleton;
