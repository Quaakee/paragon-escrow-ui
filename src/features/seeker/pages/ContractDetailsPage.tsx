/**
 * ContractDetailsPage
 * Detailed view of a specific contract with actions
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { seekerService } from '@/services/blockchain/SeekerService';
import { ContractInfo } from '../components/contracts/ContractInfo';
import { BidsList } from '../components/bids/BidsList';
import { WorkSubmissionView } from '../components/work/WorkSubmissionView';
import { ContractActions } from '../components/actions/ContractActions';
import { ConfirmApprovalDialog } from '../components/dialogs/ConfirmApprovalDialog';
import { ConfirmCancelDialog } from '../components/dialogs/ConfirmCancelDialog';
import { RaiseDisputeDialog } from '../components/dialogs/RaiseDisputeDialog';
import {
  useAcceptBid,
  useApproveWork,
  useRaiseDispute,
  useCancelContract,
} from '../hooks/useContractActions';
import { canAcceptBid } from '../utils/contractHelpers';
import { getRealBidsCount } from '../utils/bidHelpers';
import { QUERY_STALE_TIME } from '../constants';

export const ContractDetailsPage: React.FC = () => {
  const { txid, outputIndex } = useParams<{
    txid: string;
    outputIndex: string;
  }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);

  // Mutations
  const acceptBidMutation = useAcceptBid();
  const approveWorkMutation = useApproveWork();
  const raiseDisputeMutation = useRaiseDispute();
  const cancelContractMutation = useCancelContract();

  // Fetch contracts and find the specific one
  const {
    data: contracts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['seeker', 'contracts'],
    queryFn: () => seekerService.getMyContracts(),
    staleTime: QUERY_STALE_TIME,
  });

  const contract = contracts.find(
    (c) =>
      c.record.txid === txid &&
      c.record.outputIndex === parseInt(outputIndex || '0', 10)
  );

  // Handlers
  const handleAcceptBid = async (bidIndex: number) => {
    if (!contract) return;
    try {
      await acceptBidMutation.mutateAsync({ contract, bidIndex });
    } catch (error) {
      console.error('Failed to accept bid:', error);
    }
  };

  const handleApproveWork = async () => {
    if (!contract) return;
    setApprovalDialogOpen(false);
    try {
      await approveWorkMutation.mutateAsync(contract);
      navigate('/seeker/dashboard');
    } catch (error) {
      console.error('Failed to approve work:', error);
    }
  };

  const handleRaiseDispute = async (reason: string) => {
    if (!contract) return;
    setDisputeDialogOpen(false);
    try {
      await raiseDisputeMutation.mutateAsync({ contract, reason });
      navigate('/seeker/dashboard');
    } catch (error) {
      console.error('Failed to raise dispute:', error);
    }
  };

  const handleCancelContract = async () => {
    if (!contract) return;
    setCancelDialogOpen(false);
    try {
      await cancelContractMutation.mutateAsync(contract);
      navigate('/seeker/dashboard');
    } catch (error) {
      console.error('Failed to cancel contract:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Error or not found
  if (error || !contract) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/seeker/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Alert severity="error">
          {error instanceof Error
            ? error.message
            : 'Contract not found or failed to load'}
        </Alert>
      </Container>
    );
  }

  const isActionLoading =
    acceptBidMutation.isPending ||
    approveWorkMutation.isPending ||
    raiseDisputeMutation.isPending ||
    cancelContractMutation.isPending;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/seeker/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Contract Details
        </Typography>
      </Box>

      {/* Contract Info */}
      <Box sx={{ mb: 4 }}>
        <ContractInfo contract={contract} />
      </Box>

      {/* Actions */}
      <Box sx={{ mb: 4 }}>
        <ContractActions
          contract={contract}
          onApproveWork={() => setApprovalDialogOpen(true)}
          onRaiseDispute={() => setDisputeDialogOpen(true)}
          onCancelContract={() => setCancelDialogOpen(true)}
          isLoading={isActionLoading}
        />
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label={`Bids (${getRealBidsCount(contract)})`} />
          {contract.record.status === 'work-submitted' && (
            <Tab label="Submitted Work" />
          )}
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {activeTab === 0 && (
          <BidsList
            contract={contract}
            onAcceptBid={handleAcceptBid}
            canAcceptBids={canAcceptBid(contract)}
          />
        )}
        {activeTab === 1 && contract.record.status === 'work-submitted' && (
          <WorkSubmissionView contract={contract} />
        )}
      </Box>

      {/* Dialogs */}
      <ConfirmApprovalDialog
        open={approvalDialogOpen}
        contract={contract}
        onConfirm={handleApproveWork}
        onCancel={() => setApprovalDialogOpen(false)}
        isLoading={approveWorkMutation.isPending}
      />

      <ConfirmCancelDialog
        open={cancelDialogOpen}
        contract={contract}
        onConfirm={handleCancelContract}
        onCancel={() => setCancelDialogOpen(false)}
        isLoading={cancelContractMutation.isPending}
      />

      <RaiseDisputeDialog
        open={disputeDialogOpen}
        contract={contract}
        onConfirm={handleRaiseDispute}
        onCancel={() => setDisputeDialogOpen(false)}
        isLoading={raiseDisputeMutation.isPending}
      />
    </Container>
  );
};
