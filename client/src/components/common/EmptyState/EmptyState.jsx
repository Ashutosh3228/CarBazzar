import React from 'react';
import {
  Car,
  Heart,
  PlusCircle,
  MessageSquare,
  BellOff,
  SearchX,
  FileQuestion
} from 'lucide-react';
import Button from '../Loading/Button';

/**
 * EmptyState Component
 * Displays helpful, aesthetically pleasing empty states for marketplace pages.
 *
 * @param {'no-cars'|'no-favorites'|'no-listings'|'no-inquiries'|'no-notifications'|'search-empty'|'custom'} type
 * @param {string} title - Main headline
 * @param {string} description - Explanatory guidance text
 * @param {React.ReactNode} icon - Custom icon (overrides preset icon)
 * @param {Object} primaryAction - { label, onClick, icon, variant }
 * @param {Object} secondaryAction - { label, onClick, icon, variant }
 * @param {boolean} compact - Compact layout for cards / sidebars
 */
export const EmptyState = ({
  type = 'no-cars',
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  compact = false,
  className = '',
  style = {}
}) => {
  // Preset definitions tailored for CarBazaar
  const presets = {
    'no-cars': {
      icon: <Car size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'No Vehicles Found',
      description: 'We couldn’t find any cars matching your current filters. Try relaxing your filter criteria or adjusting price range.',
      primaryAction: { label: 'Reset All Filters', variant: 'primary' },
      secondaryAction: { label: 'Browse All Cars', variant: 'outline' },
      badgeColor: 'var(--cb-primary)'
    },
    'no-favorites': {
      icon: <Heart size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'Your Saved Garage is Empty',
      description: 'You haven’t saved any cars to your wishlist yet. Click the heart icon on any listing to track vehicles you love.',
      primaryAction: { label: 'Explore Marketplace', variant: 'primary' },
      badgeColor: 'var(--cb-error)'
    },
    'no-listings': {
      icon: <PlusCircle size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'No Active Listings',
      description: 'You haven’t listed any cars for sale yet. Create your first listing and reach thousands of verified buyers.',
      primaryAction: { label: 'Post a Car for Sale', variant: 'cyan' },
      badgeColor: 'var(--cb-cyan)'
    },
    'no-inquiries': {
      icon: <MessageSquare size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'No Inquiries Yet',
      description: 'When interested buyers reach out about your listed vehicles, their direct inquiries and contact details will appear here.',
      primaryAction: { label: 'View Your Listings', variant: 'secondary' },
      badgeColor: 'var(--cb-info)'
    },
    'no-notifications': {
      icon: <BellOff size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'All Caught Up!',
      description: 'You have no new alerts, price drops, or account notifications at this moment.',
      badgeColor: 'var(--cb-success)'
    },
    'search-empty': {
      icon: <SearchX size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'No Matching Search Results',
      description: 'No car models, makes, or keywords matched your search query. Please verify your spelling or try broader terms.',
      primaryAction: { label: 'Clear Search', variant: 'primary' },
      badgeColor: 'var(--cb-warning)'
    },
    custom: {
      icon: <FileQuestion size={compact ? 28 : 44} strokeWidth={1.5} />,
      title: 'No Data Available',
      description: 'There are currently no items or records to display here.',
      badgeColor: 'var(--cb-primary)'
    }
  };

  const preset = presets[type] || presets.custom;
  const displayIcon = icon || preset.icon;
  const displayTitle = title || preset.title;
  const displayDesc = description || preset.description;
  const finalPrimary = primaryAction !== undefined ? primaryAction : preset.primaryAction;
  const finalSecondary = secondaryAction !== undefined ? secondaryAction : preset.secondaryAction;
  const badgeColor = preset.badgeColor || 'var(--cb-primary)';

  return (
    <div
      role="region"
      aria-label={displayTitle}
      className={`cb-empty-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: compact ? '28px 20px' : '56px 24px',
        backgroundColor: 'var(--cb-bg-card)',
        borderRadius: 'var(--cb-radius-lg)',
        border: '1px dashed var(--cb-border-medium)',
        maxWidth: compact ? '100%' : '580px',
        margin: '0 auto',
        boxShadow: 'var(--cb-shadow-sm)',
        animation: 'cb-fade-in 250ms ease-out',
        ...style
      }}
    >
      {/* Icon Badge with Glow */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: compact ? '54px' : '88px',
          height: compact ? '54px' : '88px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--cb-border-subtle)',
          color: badgeColor,
          marginBottom: compact ? '16px' : '22px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            backgroundColor: badgeColor,
            opacity: 0.12,
            filter: 'blur(12px)'
          }}
        />
        {displayIcon}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: compact ? '1.1rem' : '1.35rem',
          fontWeight: 700,
          color: 'var(--cb-text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '8px'
        }}
      >
        {displayTitle}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: compact ? '0.85rem' : '0.95rem',
          color: 'var(--cb-text-secondary)',
          lineHeight: 1.55,
          maxWidth: '440px',
          marginBottom: finalPrimary || finalSecondary ? (compact ? '20px' : '28px') : '0'
        }}
      >
        {displayDesc}
      </p>

      {/* Action Buttons */}
      {(finalPrimary || finalSecondary) && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          {finalPrimary && (
            <Button
              size={compact ? 'sm' : 'md'}
              variant={finalPrimary.variant || 'primary'}
              icon={finalPrimary.icon}
              onClick={finalPrimary.onClick}
            >
              {finalPrimary.label}
            </Button>
          )}

          {finalSecondary && (
            <Button
              size={compact ? 'sm' : 'md'}
              variant={finalSecondary.variant || 'outline'}
              icon={finalSecondary.icon}
              onClick={finalSecondary.onClick}
            >
              {finalSecondary.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
