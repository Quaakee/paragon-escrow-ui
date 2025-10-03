/**
 * ContractFilters Component
 * Filtering and sorting controls for contracts
 */

import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import type { ContractFilters as ContractFiltersType } from '../../types';
import type { ContractStatus } from '@/types/blockchain.types';
import { STATUS_LABELS } from '../../constants';

interface ContractFiltersProps {
  filters: ContractFiltersType;
  onFilterChange: <K extends keyof ContractFiltersType>(
    key: K,
    value: ContractFiltersType[K]
  ) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export const ContractFilters: React.FC<ContractFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  hasActiveFilters,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center',
        mb: 3,
      }}
    >
      {/* Search */}
      <TextField
        placeholder="Search contracts..."
        value={filters.searchQuery}
        onChange={(e) => onFilterChange('searchQuery', e.target.value)}
        size="small"
        sx={{ flexGrow: 1, minWidth: 200 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Status Filter */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status}
          label="Status"
          onChange={(e) =>
            onFilterChange('status', e.target.value as ContractStatus | 'all')
          }
        >
          <MenuItem value="all">{STATUS_LABELS.all}</MenuItem>
          <MenuItem value="initial">{STATUS_LABELS.initial}</MenuItem>
          <MenuItem value="bid-accepted">
            {STATUS_LABELS['bid-accepted']}
          </MenuItem>
          <MenuItem value="work-started">
            {STATUS_LABELS['work-started']}
          </MenuItem>
          <MenuItem value="work-submitted">
            {STATUS_LABELS['work-submitted']}
          </MenuItem>
          <MenuItem value="resolved">{STATUS_LABELS.resolved}</MenuItem>
          <MenuItem value="disputed-by-seeker">
            {STATUS_LABELS['disputed-by-seeker']}
          </MenuItem>
          <MenuItem value="disputed-by-furnisher">
            {STATUS_LABELS['disputed-by-furnisher']}
          </MenuItem>
        </Select>
      </FormControl>

      {/* Sort By */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={filters.sortBy}
          label="Sort By"
          onChange={(e) =>
            onFilterChange(
              'sortBy',
              e.target.value as
                | 'newest'
                | 'oldest'
                | 'bounty-high'
                | 'bounty-low'
                | 'deadline'
            )
          }
        >
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="oldest">Oldest First</MenuItem>
          <MenuItem value="bounty-high">Highest Bounty</MenuItem>
          <MenuItem value="bounty-low">Lowest Bounty</MenuItem>
          <MenuItem value="deadline">Deadline</MenuItem>
        </Select>
      </FormControl>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Clear />}
          onClick={onReset}
        >
          Reset
        </Button>
      )}
    </Box>
  );
};
