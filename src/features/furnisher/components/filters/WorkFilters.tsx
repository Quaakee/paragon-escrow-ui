/**
 * WorkFilters Component
 * Filter and sort controls for available work
 */

import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Grid,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import type { WorkFilters as WorkFiltersType } from '../../types';

interface WorkFiltersProps {
  filters: WorkFiltersType;
  onFiltersChange: (filters: Partial<WorkFiltersType>) => void;
}

export const WorkFilters: React.FC<WorkFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search work..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
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
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Min Bounty (sats)"
            type="number"
            value={filters.minBounty}
            onChange={(e) =>
              onFiltersChange({ minBounty: Number(e.target.value) })
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Max Bounty (sats)"
            type="number"
            value={filters.maxBounty}
            onChange={(e) =>
              onFiltersChange({ maxBounty: Number(e.target.value) })
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) =>
                onFiltersChange({
                  sortBy: e.target.value as WorkFiltersType['sortBy'],
                })
              }
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="bounty-high">Highest Bounty</MenuItem>
              <MenuItem value="bounty-low">Lowest Bounty</MenuItem>
              <MenuItem value="deadline">Deadline Soon</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.showOnlyNoBids}
                onChange={(e) =>
                  onFiltersChange({ showOnlyNoBids: e.target.checked })
                }
              />
            }
            label="Show only work with no bids"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
