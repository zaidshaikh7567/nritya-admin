import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  Grid,
  Box,
  Tabs,
  Tab,
  Chip,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';

function Transactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Email');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  const API_BASE_URL =  'https://nrityaserver-2b241e0a97e5.herokuapp.com/' //'http://localhost:8000';

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchResults([]);
    setError('');
    setSearchQuery('');
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const fetchTransactions = async (endpoint, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleSearch = async () => {
    if (activeTab !== 3 && !searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      let data = [];
      
      switch (activeTab) {
        case 0: // Email Search
          data = await fetchTransactions('/payments/transactions', { user_email: searchQuery.trim() });
          break;
        case 1: // User ID Search
          data = await fetchTransactions(`/payments/transactions/user/${searchQuery.trim()}`);
          break;
        case 2: // Workshop ID Search
          data = await fetchTransactions(`/payments/transactions/workshop/${searchQuery.trim()}`);
          break;
        case 3: // View All
          data = await fetchTransactions('/payments/transactions');
          break;
        default:
          data = [];
      }
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setSearchResults(data);
      } else if (data.transactions) {
        setSearchResults(data.transactions);
      } else if (data.data) {
        setSearchResults(data.data);
      } else {
        setSearchResults([data]);
      }
      
      if (data.length === 0 || (data.transactions && data.transactions.length === 0)) {
        setError('No transactions found for the given criteria');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError('Error fetching transactions. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return 'N/A';
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'cancelled':
      case 'refunded':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderTransactionCard = (transaction) => (
    <Grid item key={transaction.transaction_id || transaction.id} xs={12} sm={6} md={4} lg={3}>
      <Card style={{ marginBottom: '16px', height: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h3">
              Transaction {transaction.transaction_id}
            </Typography>
            {transaction.payment_status && (
              <Chip 
                label={transaction.payment_status} 
                color={getStatusColor(transaction.payment_status)}
                size="small"
              />
            )}
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    Subtotal
                  </TableCell>
                  <TableCell align="left">
                    {formatAmount(transaction.sub_total)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    Booking Fee
                  </TableCell>
                  <TableCell align="left">
                    {formatAmount(transaction.booking_fee)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    Total Amount
                  </TableCell>
                  <TableCell align="left">
                    {formatAmount(transaction.total_amount)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    User ID
                  </TableCell>
                  <TableCell align="left">
                    {transaction.user_id || transaction.userId || 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    User Email
                  </TableCell>
                  <TableCell align="left">
                    {transaction.user_email || transaction.email || 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    Payment Method
                  </TableCell>
                  <TableCell align="left">
                    {transaction.payment_method || 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    Razorpay Payment ID
                  </TableCell>
                  <TableCell align="left">
                    {transaction.razorpay_payment_id || 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    Razorpay Order ID
                  </TableCell>
                  <TableCell align="left">
                    {transaction.razorpay_order_id || 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    Created At
                  </TableCell>
                  <TableCell align="left">
                    {formatDate(transaction.created_at || transaction.createdAt)}
                  </TableCell>
                </TableRow>
                {transaction.error_code && (
                  <TableRow>
                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                      Error Code
                    </TableCell>
                    <TableCell align="left">
                      {transaction.error_code}
                    </TableCell>
                  </TableRow>
                )}
                {transaction.error_reason && (
                  <TableRow>
                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                      Error Reason
                    </TableCell>
                    <TableCell align="left">
                      {transaction.error_reason}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderTransactionTable = () => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Transaction ID</strong></TableCell>
            <TableCell><strong>User ID</strong></TableCell>
            <TableCell><strong>User Email</strong></TableCell>
            <TableCell><strong>Payment Status</strong></TableCell>
            <TableCell><strong>Payment Method</strong></TableCell>
            <TableCell><strong>Subtotal</strong></TableCell>
            <TableCell><strong>Booking Fee</strong></TableCell>
            <TableCell><strong>Total Amount</strong></TableCell>
            <TableCell><strong>Razorpay Payment ID</strong></TableCell>
            <TableCell><strong>Razorpay Order ID</strong></TableCell>
            <TableCell><strong>Created At</strong></TableCell>
            <TableCell><strong>Error Code</strong></TableCell>
            <TableCell><strong>Error Reason</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchResults.map((transaction) => (
            <TableRow key={transaction.transaction_id || transaction.id}>
              <TableCell>{transaction.transaction_id || transaction.id || 'N/A'}</TableCell>
              <TableCell>{transaction.user_id || transaction.userId || 'N/A'}</TableCell>
              <TableCell>{transaction.user_email || transaction.email || 'N/A'}</TableCell>
              <TableCell>
                <Chip 
                  label={transaction.payment_status || 'N/A'} 
                  color={getStatusColor(transaction.payment_status)}
                  size="small"
                />
              </TableCell>
                             <TableCell>{transaction.payment_method || 'N/A'}</TableCell>
               <TableCell>{formatAmount(transaction.subtotal)}</TableCell>
               <TableCell>{formatAmount(transaction.booking_fee)}</TableCell>
               <TableCell>{formatAmount(transaction.total)}</TableCell>
               <TableCell>{transaction.razorpay_payment_id || 'N/A'}</TableCell>
              <TableCell>{transaction.razorpay_order_id || 'N/A'}</TableCell>
              <TableCell>{formatDate(transaction.created_at || transaction.createdAt)}</TableCell>
              <TableCell>{transaction.error_code || 'N/A'}</TableCell>
              <TableCell>{transaction.error_reason || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Transaction Management
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Search by Email" />
          <Tab label="Search by User ID" />
          <Tab label="Search by Workshop ID" />
          <Tab label="View All" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 0 ? "Enter user email" :
                activeTab === 1 ? "Enter user ID" :
                activeTab === 2 ? "Enter workshop ID" :
                "Click Search to view all transactions"
              }
              disabled={activeTab === 3}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button 
              variant="contained" 
              onClick={handleSearch}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={20} /> : activeTab === 3 ? 'Load All' : 'Search'}
            </Button>
          </Grid>
          {searchResults.length > 0 && (
            <Grid item xs={12} sm={6} md={2}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
              >
                <ToggleButton value="cards" aria-label="card view">
                  Cards
                </ToggleButton>
                <ToggleButton value="table" aria-label="table view">
                  Table
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          )}
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {searchResults.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Found {searchResults.length} transaction(s)
          </Typography>
          
          {viewMode === 'cards' ? (
            <Grid container spacing={2}>
              {searchResults.map(renderTransactionCard)}
            </Grid>
          ) : (
            renderTransactionTable()
          )}
        </Box>
      )}

      {!loading && !error && searchResults.length === 0 && searchQuery && (
        <Alert severity="info">
          No transactions found. Try a different search criteria.
        </Alert>
      )}
    </div>
  );
}

export default Transactions;
